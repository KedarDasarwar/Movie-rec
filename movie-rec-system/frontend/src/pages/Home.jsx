import React, { useState, useEffect } from 'react';
import { Star, Search, Film, TrendingUp, Clock, Sparkles, ChevronDown, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MovieRecommendationApp = () => {
  const [activeNav, setActiveNav] = useState('Home');
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState(null);
  const [movies, setMovies] = useState([]);
  const [ratedMovies, setRatedMovies] = useState([]);
  const [displayCount, setDisplayCount] = useState(8);
  const [recOffset, setRecOffset] = useState(0);
  const [recHasMore, setRecHasMore] = useState(false);
  const [recLoading, setRecLoading] = useState(false);
  const [showLoginOverlay, setShowLoginOverlay] = useState(false);


  const fetchHybridPage = async (offset = 0, append = false) => {
  const token = localStorage.getItem('token');
  if (!token) return;
  try {
    setRecLoading(true);
    const res = await fetch(`http://localhost:4000/api/recommendations/hybrid?limit=8&offset=${offset}&alpha=0.6`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const ct = res.headers.get('content-type') || '';
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Hybrid fetch failed ${res.status}: ${text.substring(0,200)}`);
    }
    const data = ct.includes('application/json') ? await res.json() : { recommendations: [] };
    const newRecs = data.recommendations || [];
    setRecommendations(prev => append ? [...prev, ...newRecs] : newRecs);
    setDisplayCount((append ? (prev => prev + newRecs.length) : newRecs.length));
    setRecOffset(offset + newRecs.length);
    setRecHasMore(newRecs.length === 8);
    setShowRecommendations(true);
  } catch (err) {
    console.error(err);
  } finally {
    setRecLoading(false);
  }
};

  const submitRatingToBackend = async (movie) => {
  const token = localStorage.getItem('token');
  if (!token) return alert("You must be logged in to rate!");

  try {
    const res = await fetch(`http://localhost:4000/api/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ movieId: movie.id, rating: movie.rating })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to submit rating');

    // ✅ After successful submission, update local state
    addOrUpdateRating({
      id: data?.rating?.id,    // rating id from backend response
      movieId: movie.id,
      title: movie.title,
      year: movie.year,
      genre: movie.genre,
      poster: movie.poster,
      rating: movie.rating
    });

    console.log('Rating submitted:', data);

    window.dispatchEvent(new Event('ratingsUpdated'));

    // Fetch first page of hybrid recommendations after rating
    setRecOffset(0);
    await fetchHybridPage(0, false);

  } catch (err) {
    console.error(err);
    alert('Failed to submit rating. Check console.');
  }
};

const addOrUpdateRating = (movie) => {
  // Check if this movie is already in ratedMovies
  const existing = ratedMovies.find(m => m.movieId === movie.movieId);

  if (existing) {
    // Update existing rating
    setRatedMovies(ratedMovies.map(m =>
      m.movieId === movie.movieId ? { ...m, rating: movie.rating, dateRated: new Date().toISOString() } : m
    ));
  } else {
    // Add new rating
    setRatedMovies([
      ...ratedMovies,
      {
        id: movie.id,           // rating id from backend
        movieId: movie.movieId, // movie id
        title: movie.title,
        year: movie.year,
        genre: movie.genre,
        poster: movie.poster,
        rating: movie.rating,
        dateRated: new Date().toISOString()
      }
    ]);
  }
};

useEffect(() => {
  const fetchSearchResults = async () => {
    const token = localStorage.getItem('token');
    if (!searchQuery.trim()) {
      setMovies([]);
      return;
    }
    if (!token) {
      setShowLoginOverlay(true);
      setMovies([]);
      return;
    } else {
      setShowLoginOverlay(false);
    }
    try {
      const res = await fetch(`http://localhost:4000/api/movies/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setMovies(data.movies || []);
    } catch (err) {
      console.error('Search fetch failed:', err);
      setMovies([]);
    }
  };



  const debounce = setTimeout(fetchSearchResults, 200); // debounce typing
  return () => clearTimeout(debounce);
}, [searchQuery]);

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    setSearchQuery(movie.title);
    setShowDropdown(false);
    setUserRating(0);
    setShowRecommendations(false);
  };

  const handleRatingSubmit = () => {
  if (userRating > 0 && selectedMovie) {
    submitRatingToBackend({
      ...selectedMovie,
      rating: userRating
    }); 
    // Recommendations fetched by submitRatingToBackend -> fetchHybridPage
  }
};

  useEffect(() => {
    if (userRating > 0&& selectedMovie) {
      handleRatingSubmit();
    }
  }, [userRating]);

  //const navItems = ['Home', 'Search', 'My Ratings', 'About'];
  const visibleRecommendations = recommendations.slice(0, displayCount);

  const handleLoginRedirect = () => {
    setShowLoginOverlay(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white font-sans overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation Bar */}
      {/* <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-40 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Film className="w-8 h-8 text-cyan-400" />
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                MovieMind
              </span>
            </div>
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveNav(item)}
                  className="relative group"
                >
                  <span className={`transition-colors ${
                    activeNav === item ? 'text-cyan-400' : 'text-gray-300 hover:text-white'
                  }`}>
                    {item}
                  </span>
                  {activeNav === item && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 animate-pulse"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav> */}

      {/* Login Overlay (shown when user searches while not logged in) */}
      {showLoginOverlay && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black bg-opacity-60 transition-opacity duration-500`}
        >
          <div className="bg-gray-900 bg-opacity-80 backdrop-blur-xl rounded-3xl p-12 border-2 border-cyan-400 shadow-2xl shadow-cyan-500/50 max-w-md w-full mx-4 transform transition-all duration-500 scale-100 hover:scale-105">
            <div className="text-center">
              <div className="inline-block p-6 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full mb-6 animate-pulse">
                <Lock className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Login to See Recommendations
              </h2>
              <p className="text-gray-300 mb-8">
                Please login to discover movies tailored to your taste.
              </p>
              <button
                onClick={handleLoginRedirect}
                className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Lock className="w-5 h-5" />
                <span>Login to Continue</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
              Find. Rate. Discover.
            </h1>
            <p className="text-gray-400 text-lg">Your personalized movie recommendation engine</p>
          </div>

          {/* Search & Rating Section */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="relative mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Search for a movie..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-800 bg-opacity-50 border-2 border-gray-700 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 transition-all backdrop-blur-sm"
                />
              </div>

              {/* Dropdown */}
              {showDropdown && searchQuery &&   (
                <div className="absolute w-full mt-2 bg-gray-800 bg-opacity-95 backdrop-blur-lg border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-10 animate-fade-in">
                  {movies.map((movie) =>  (
                    <button
                      key={movie.id}
                      onClick={() => handleMovieSelect(movie)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex items-center space-x-3 border-b border-gray-700 last:border-b-0"
                    >
                      <Film className="w-5 h-5 text-cyan-400" />
                      <div>
                        <div className="text-white font-medium">{movie.title}</div>
                        <div className="text-gray-400 text-sm">{movie.year} • {movie.genre}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Rating Component */}
            {selectedMovie && (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 shadow-2xl animate-fade-in">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{selectedMovie.title}</h3>
                  <p className="text-gray-400">{selectedMovie.year} • {selectedMovie.genre}</p>
                </div>
                <div className="flex justify-center items-center space-x-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setUserRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-125"
                    >
                      <Star
                        className={`w-10 h-10 transition-colors ${
                          star <= (hoveredRating || userRating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {userRating > 0 && (
                  <p className="text-center text-cyan-400 font-semibold animate-pulse">
                    You rated: {userRating} star{userRating > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Recommendations Section */}
          {showRecommendations && recommendations.length > 0 && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-center space-x-3 mb-8">
                <Sparkles className="w-6 h-6 text-cyan-400" />
                <h2 className="text-3xl font-bold text-center">Recommended For You</h2>
                <Sparkles className="w-6 h-6 text-purple-400" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pb-16">
                {visibleRecommendations.map((movie, index) => (
                  <div
                    key={movie.id}
                    onClick={() => setSelectedPreview(movie)}
                    className="group relative bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden border border-gray-700 hover:border-cyan-400 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30 cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="aspect-[2/3] overflow-hidden">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="p-2 bg-gradient-to-t from-gray-900 to-transparent">
                      <h3 className="text-sm font-bold mb-1 group-hover:text-cyan-400 transition-colors truncate">
                        {movie.title}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="flex items-center space-x-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{movie.year}</span>
                        </span>
                        <span className="flex items-center space-x-0.5">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-yellow-400 font-semibold text-xs">{movie.rating}</span>
                        </span>
                      </div>
                      <div className="mt-1">
                        <span className="inline-block px-2 py-0.5 bg-purple-500 bg-opacity-30 text-purple-300 rounded text-xs truncate">
                          {movie.genre}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {recHasMore && (
                <div className="flex justify-center pb-16">
                  <button
                    onClick={() => fetchHybridPage(recOffset, true)}
                    className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all animate-pulse"
                  >
                    <span>Load More Movies</span>
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {selectedPreview && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedPreview(null)}
        >
          <div
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl max-w-2xl w-full border border-cyan-400 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-video overflow-hidden">
              <img
                src={selectedPreview.poster}
                alt={selectedPreview.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                {selectedPreview.title}
              </h2>
              <div className="flex items-center space-x-4 mb-4 text-gray-400">
                <span className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{selectedPreview.year}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">{selectedPreview.rating}</span>
                </span>
                <span className="px-3 py-1 bg-purple-500 bg-opacity-30 text-purple-300 rounded-full text-sm">
                  {selectedPreview.genre}
                </span>
              </div>
              <button
                onClick={() => setSelectedPreview(null)}
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MovieRecommendationApp;