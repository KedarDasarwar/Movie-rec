import React, { useState, useRef, useEffect } from 'react';
import { Film, Star, Edit2, Trash2, ChevronLeft, ChevronRight, Search, Calendar, TrendingUp, Check, X, ArrowRight, Filter } from 'lucide-react';


const MyRatingsPage = () => {
  const [activeNav, setActiveNav] = useState('My Ratings');
  const [ ratedMovies, setRatedMovies] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingRating, setEditingRating] = useState(0);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [toast, setToast] = useState(null);
  const [hoveredRating, setHoveredRating] = useState(0);
  const scrollRef = useRef(null);
//     { id: 1, title: 'Inception', year: 2010, genre: 'Sci-Fi', rating: 5, poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=150&h=225&fit=crop', dateRated: '2025-01-15' },
//     { id: 2, title: 'The Dark Knight', year: 2008, genre: 'Action', rating: 5, poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=150&h=225&fit=crop', dateRated: '2025-01-20' },
//     { id: 3, title: 'Interstellar', year: 2014, genre: 'Sci-Fi', rating: 4, poster: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=150&h=225&fit=crop', dateRated: '2025-02-01' },
//     { id: 4, title: 'Pulp Fiction', year: 1994, genre: 'Crime', rating: 4, poster: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=150&h=225&fit=crop', dateRated: '2025-02-05' },
//     { id: 5, title: 'The Matrix', year: 1999, genre: 'Sci-Fi', rating: 5, poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=150&h=225&fit=crop', dateRated: '2025-02-10' },
//     { id: 6, title: 'Forrest Gump', year: 1994, genre: 'Drama', rating: 4, poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=150&h=225&fit=crop', dateRated: '2025-02-15' },
//     { id: 7, title: 'Fight Club', year: 1999, genre: 'Drama', rating: 5, poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=150&h=225&fit=crop', dateRated: '2025-02-20' },
//     { id: 8, title: 'The Shawshank Redemption', year: 1994, genre: 'Drama', rating: 5, poster: 'https://images.unsplash.com/photo-1574267432644-f74f501ec1c5?w=150&h=225&fit=crop', dateRated: '2025-02-25' },
//   ]);

  const recommendations = [
    { id: 11, title: 'Blade Runner 2049', year: 2017, rating: 8.0, poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop' },
    { id: 12, title: 'Dune', year: 2021, rating: 8.0, poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop' },
    { id: 13, title: 'Arrival', year: 2016, rating: 7.9, poster: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=300&h=450&fit=crop' },
    { id: 14, title: 'Ex Machina', year: 2014, rating: 7.7, poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop' },
    { id: 15, title: 'Her', year: 2013, rating: 8.0, poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop' },
    { id: 16, title: 'Annihilation', year: 2018, rating: 6.8, poster: 'https://images.unsplash.com/photo-1574267432644-f74f501ec1c5?w=300&h=450&fit=crop' },
  ];

const fetchRatings = async () => {
  try {
    const res = await fetch('http://localhost:4000/api/ratings/me', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await res.json();
    if (data.ratings) {
      const formatted = data.ratings.map(r => ({
        id: r.id,
        movieId: r.Movie.id,
        title: r.Movie.title,
        year: r.Movie.year,
        genre: r.Movie.genres,
        poster: `https://via.placeholder.com/150x225?text=${encodeURIComponent(r.Movie.title)}`,
        rating: r.rating,
        dateRated: r.updatedAt
      }));
      setRatedMovies(formatted);
    }
  } catch (err) {
    console.error(err);
  }
};


  useEffect(() => {
    
  

  fetchRatings();
}, []);

  const navItems = ['Home', 'Search', 'My Ratings', 'Recommendations', 'Analytics'];

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleEdit = (movie) => {
    setEditingId(movie.id);
    setEditingRating(movie.rating);
  };

  const handleSaveEdit = async (id, movieId) => {
  try {
    const res = await fetch('/api/ratings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ movieId, rating: editingRating })
    });
    const data = await res.json();
    if (data.ok) {
      setRatedMovies(prev => prev.map(m => m.id === id ? { ...m, rating: editingRating, dateRated: new Date().toISOString() } : m));    
      setEditingId(null);
      showToast('Rating updated successfully!');
    } else {
      showToast('Failed to update rating', 'error');
    }
  } catch (err) {
    console.error(err);
    showToast('Failed to update rating', 'error');
  }
};


 const handleDelete = async (id, movieId) => {
  try {
    const res = await fetch(`/api/ratings?movieId=${movieId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    const data = await res.json();
    if (data.ok) {
      setRatedMovies(ratedMovies.filter(m => m.id !== id));
      setDeleteConfirm(null);
      showToast('Rating deleted successfully!');
    } else {
      showToast('Failed to delete rating', 'error');
    }
  } catch (err) {
    console.error(err);
    showToast('Failed to delete rating', 'error');
  }
};

useEffect(() => {
  const handler = () => fetchRatings();   // re-fetch whenever a rating is submitted
  window.addEventListener('ratingsUpdated', handler);

  return () => window.removeEventListener('ratingsUpdated', handler); // cleanup
}, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const filteredMovies = ratedMovies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return new Date(b.dateRated) - new Date(a.dateRated);
  });

  const avgRating = ratedMovies.length > 0 
    ? (ratedMovies.reduce((sum, m) => sum + m.rating, 0) / ratedMovies.length).toFixed(1)
    : 0;

  const lastUpdated = ratedMovies.length > 0
    ? new Date(Math.max(...ratedMovies.map(m => new Date(m.dateRated)))).toLocaleDateString()
    : 'N/A';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white font-sans overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '700ms' }}></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1400ms' }}></div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-4 z-50 animate-slide-in">
          <div className={`px-6 py-4 rounded-xl backdrop-blur-lg border-2 flex items-center space-x-3 shadow-2xl ${
            toast.type === 'success' 
              ? 'bg-green-500 bg-opacity-20 border-green-400 text-green-300' 
              : 'bg-red-500 bg-opacity-20 border-red-400 text-red-300'
          }`}>
            {toast.type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
            <span className="font-semibold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black bg-opacity-40 backdrop-blur-lg border-b border-gray-800">
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
      </nav>

      {/* Main Content */}
      <div className="relative pt-24 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Your Rated Movies
            </h1>
            <p className="text-gray-400 text-lg mb-4">
              Here's what you've watched and how you rated them
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto rounded-full animate-pulse"></div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/30 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Movies Rated</p>
                  <p className="text-4xl font-bold text-cyan-400">{ratedMovies.length}</p>
                </div>
                <Film className="w-12 h-12 text-cyan-400 opacity-50" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-purple-400 hover:shadow-2xl hover:shadow-purple-500/30 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Average Rating</p>
                  <p className="text-4xl font-bold text-purple-400">{avgRating}/5</p>
                </div>
                <Star className="w-12 h-12 text-purple-400 opacity-50 fill-current" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-pink-400 hover:shadow-2xl hover:shadow-pink-500/30 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Last Updated</p>
                  <p className="text-2xl font-bold text-pink-400">{lastUpdated}</p>
                </div>
                <Calendar className="w-12 h-12 text-pink-400 opacity-50" />
              </div>
            </div>
          </div>

          {/* Search and Sort */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your rated movies..."
                className="w-full pl-12 pr-4 py-3 bg-gray-800 bg-opacity-50 border-2 border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 transition-all backdrop-blur-sm"
              />
            </div>
            <div className="flex items-center space-x-2 bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-1 border border-gray-700">
              <Filter className="w-5 h-5 text-cyan-400 ml-2" />
              {['Date', 'Rating', 'Title'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSortBy(filter.toLowerCase())}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    sortBy === filter.toLowerCase()
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Ratings Table/Cards */}
          <div className="animate-fade-in" style={{ animationDelay: '600ms' }}>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-gray-800 bg-opacity-30 backdrop-blur-lg rounded-2xl border border-gray-700 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900 bg-opacity-50 border-b border-gray-700">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">Poster</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">Movie Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-cyan-400">Your Rating</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-cyan-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedMovies.map((movie, index) => (
                    <tr 
                      key={movie.id}
                      className="border-b border-gray-800 hover:bg-gray-700 hover:bg-opacity-30 transition-all group"
                      style={{ 
                        animation: 'fadeInRow 0.5s ease-out forwards',
                        animationDelay: `${index * 50}ms`,
                        opacity: 0
                      }}
                    >
                      <td className="px-6 py-4">
                        <img 
                          src={movie.poster} 
                          alt={movie.title}
                          className="w-16 h-24 object-cover rounded-lg shadow-lg group-hover:scale-105 transition-transform"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                          {movie.title}
                        </div>
                        <div className="text-sm text-gray-400">{movie.year} • {movie.genre}</div>
                      </td>
                      <td className="px-6 py-4">
                        {editingId === movie.id ? (
                          <div className="flex items-center space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => setEditingRating(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                className="transition-transform hover:scale-125"
                              >
                                <Star
                                  className={`w-6 h-6 transition-colors ${
                                    star <= (hoveredRating || editingRating)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-600'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${
                                  i < movie.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-600'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          {editingId === movie.id ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(movie.id,movie.movieId)}
                                className="p-2 bg-green-500 bg-opacity-20 hover:bg-opacity-30 text-green-400 rounded-lg transition-all hover:scale-110"
                              >
                                <Check className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="p-2 bg-red-500 bg-opacity-20 hover:bg-opacity-30 text-red-400 rounded-lg transition-all hover:scale-110"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(movie)}
                                className="p-2 bg-cyan-500 bg-opacity-20 hover:bg-opacity-30 text-cyan-400 rounded-lg transition-all hover:scale-110"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(movie.id)}
                                className="p-2 bg-red-500 bg-opacity-20 hover:bg-opacity-30 text-red-400 rounded-lg transition-all hover:scale-110"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {sortedMovies.map((movie, index) => (
                <div 
                  key={movie.id}
                  className="bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-xl border border-gray-700 p-4 hover:border-cyan-400 transition-all"
                  style={{ 
                    animation: 'fadeInRow 0.5s ease-out forwards',
                    animationDelay: `${index * 50}ms`,
                    opacity: 0
                  }}
                >
                  <div className="flex space-x-4">
                    <img 
                      src={movie.poster} 
                      alt={movie.title}
                      className="w-20 h-30 object-cover rounded-lg shadow-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{movie.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">{movie.year} • {movie.genre}</p>
                      <div className="flex items-center space-x-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < movie.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(movie)}
                          className="flex-1 py-2 bg-cyan-500 bg-opacity-20 hover:bg-opacity-30 text-cyan-400 rounded-lg transition-all text-sm font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(movie.id)}
                          className="flex-1 py-2 bg-red-500 bg-opacity-20 hover:bg-opacity-30 text-red-400 rounded-lg transition-all text-sm font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations Section */}
          <div className="mt-16 animate-fade-in" style={{ animationDelay: '800ms' }}>
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                <h2 className="text-3xl font-bold text-white">Based on Your Ratings</h2>
              </div>
              <p className="text-gray-400">Discover more movies similar to what you've loved</p>
            </div>

            <div className="relative group">
              <button 
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-70 hover:bg-opacity-90 p-3 rounded-r-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-l-0 border-cyan-400"
              >
                <ChevronLeft className="w-8 h-8 text-cyan-400" />
              </button>

              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-[5] pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-[5] pointer-events-none"></div>

              <div 
                ref={scrollRef}
                className="flex space-x-4 overflow-x-auto scrollbar-hide px-4 scroll-smooth"
              >
                {recommendations.map((movie, index) => (
                  <div 
                    key={movie.id}
                    className="flex-none w-56 group/card cursor-pointer"
                    style={{ 
                      animation: 'slideIn 0.5s ease-out forwards',
                      animationDelay: `${index * 100}ms`,
                      opacity: 0
                    }}
                  >
                    <div className="relative overflow-hidden rounded-xl transition-all duration-300 group-hover/card:scale-105 group-hover/card:shadow-2xl group-hover/card:shadow-purple-500/50">
                      <img 
                        src={movie.poster} 
                        alt={movie.title}
                        className="w-full h-80 object-cover transition-transform duration-500 group-hover/card:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <div className="mt-3 px-1">
                      <h3 className="text-white font-semibold truncate group-hover/card:text-purple-400 transition-colors">
                        {movie.title}
                      </h3>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">{movie.year}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-yellow-400 font-semibold">{movie.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* See More Card */}
                <div className="flex-none w-56 flex items-center justify-center">
                  <button className="w-full h-80 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all hover:scale-105 flex flex-col items-center justify-center space-y-4 group/more">
                    <ArrowRight className="w-16 h-16 text-white group-hover/more:translate-x-2 transition-transform" />
                    <span className="text-white font-bold text-xl">See More</span>
                    <span className="text-white text-sm opacity-80">Recommendations</span>
                  </button>
                </div>
              </div>

              <button 
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-70 hover:bg-opacity-90 p-3 rounded-l-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-r-0 border-purple-400"
              >
                <ChevronRight className="w-8 h-8 text-purple-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm animate-fade-in">
          <div className="bg-gray-900 bg-opacity-95 backdrop-blur-xl rounded-2xl p-8 border-2 border-red-400 shadow-2xl shadow-red-500/50 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="inline-block p-4 bg-red-500 bg-opacity-20 rounded-full mb-4">
                <Trash2 className="w-12 h-12 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-white">Delete Rating?</h2>
              <p className="text-gray-400 mb-6">
                Are you sure you want to remove this movie from your rated list? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm, ratedMovies.find(m => m.id === deleteConfirm).movieId)}

                  className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:shadow-xl hover:shadow-red-500/50 rounded-xl font-semibold transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
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
        @keyframes fadeInRow {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default MyRatingsPage;