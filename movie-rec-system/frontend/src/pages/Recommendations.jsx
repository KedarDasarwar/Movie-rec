import React, { useState, useRef, useEffect } from 'react';
import { Film, Lock, ChevronLeft, ChevronRight, Sparkles, Users, Heart, Shuffle, Star, TrendingUp } from 'lucide-react';

const RecommendationsPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeNav, setActiveNav] = useState('Recommendations');
  const [showLoginOverlay, setShowLoginOverlay] = useState(true);
  const personalScrollRef = useRef(null);
  const audienceScrollRef = useRef(null);
  const [personalScrollProgress, setPersonalScrollProgress] = useState(0);
  const [audienceScrollProgress, setAudienceScrollProgress] = useState(0);
  const [personalRecommendations, setPersonalRecommendations] = useState([]);
const [audienceFavorites, setAudienceFavorites] = useState([]);


  // Mock movie data
//   const personalRecommendations = [
//     { id: 1, title: 'Blade Runner 2049', year: 2017, genre: 'Sci-Fi', rating: 8.0, poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop', topPick: true },
//     { id: 2, title: 'Dune', year: 2021, genre: 'Sci-Fi', rating: 8.0, poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop', topPick: false },
//     { id: 3, title: 'Arrival', year: 2016, genre: 'Sci-Fi', rating: 7.9, poster: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=300&h=450&fit=crop', topPick: true },
//     { id: 4, title: 'Ex Machina', year: 2014, genre: 'Sci-Fi', rating: 7.7, poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop', topPick: false },
//     { id: 5, title: 'Her', year: 2013, genre: 'Romance', rating: 8.0, poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop', topPick: false },
//     { id: 6, title: 'Ghost in the Shell', year: 2017, genre: 'Sci-Fi', rating: 6.3, poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop', topPick: false },
//     { id: 7, title: 'Annihilation', year: 2018, genre: 'Sci-Fi', rating: 6.8, poster: 'https://images.unsplash.com/photo-1574267432644-f74f501ec1c5?w=300&h=450&fit=crop', topPick: true },
//     { id: 8, title: 'The Matrix Resurrections', year: 2021, genre: 'Sci-Fi', rating: 5.7, poster: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=300&h=450&fit=crop', topPick: false },
//   ];

//   const audienceFavorites = [
//     { id: 11, title: 'The Shawshank Redemption', year: 1994, genre: 'Drama', rating: 9.3, poster: 'https://images.unsplash.com/photo-1574267432644-f74f501ec1c5?w=300&h=450&fit=crop', topPick: true },
//     { id: 12, title: 'The Godfather', year: 1972, genre: 'Crime', rating: 9.2, poster: 'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=300&h=450&fit=crop', topPick: true },
//     { id: 13, title: 'The Dark Knight', year: 2008, genre: 'Action', rating: 9.0, poster: 'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop', topPick: false },
//     { id: 14, title: 'Pulp Fiction', year: 1994, genre: 'Crime', rating: 8.9, poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop', topPick: true },
//     { id: 15, title: 'Forrest Gump', year: 1994, genre: 'Drama', rating: 8.8, poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop', topPick: false },
//     { id: 16, title: 'Inception', year: 2010, genre: 'Sci-Fi', rating: 8.8, poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop', topPick: false },
//     { id: 17, title: 'Fight Club', year: 1999, genre: 'Drama', rating: 8.8, poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop', topPick: true },
//     { id: 18, title: 'The Matrix', year: 1999, genre: 'Sci-Fi', rating: 8.7, poster: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=300&h=450&fit=crop', topPick: false },
//   ];


useEffect(() => {
  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem('token'); // get token from storage

        const personalPosters = [
        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop',
        'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop',
        'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=300&h=450&fit=crop',
        'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop',
        'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop',
        'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop',
        'https://images.unsplash.com/photo-1574267432644-f74f501ec1c5?w=300&h=450&fit=crop',
        'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=300&h=450&fit=crop',
      ];

      const audiencePosters = [
        'https://images.unsplash.com/photo-1574267432644-f74f501ec1c5?w=300&h=450&fit=crop',
        'https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=300&h=450&fit=crop',
        'https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop',
        'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop',
        'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop',
        'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop',
        'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop',
        'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=300&h=450&fit=crop',
      ];




// Fetch content-based recommendations
      const contentRes = await fetch('http://localhost:4000/api/recommendations/content?limit=10', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const contentData = await contentRes.json();
      if (contentData.recommendations) {
        // Assign posters by index
        const withPosters = contentData.recommendations.map((movie, i) => ({
          ...movie,
          poster: personalPosters[i % personalPosters.length] // loop if more movies than posters
        }));
        setPersonalRecommendations(withPosters);
      }

      // Fetch collaborative filtering (audience) recommendations
      const cfRes = await fetch('http://localhost:4000/api/recommendations/cf?limit=10', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const cfData = await cfRes.json();
      if (cfData.recommendations) {
        const withPosters = cfData.recommendations.map((movie, i) => ({
          ...movie,
          poster: audiencePosters[i % audiencePosters.length]
        }));
        setAudienceFavorites(withPosters);
      }

    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    }
  };

  fetchRecommendations();
}, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setTimeout(() => {
      setShowLoginOverlay(false);
    }, 500);
  };

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const updateScrollProgress = (ref, setProgress) => {
    if (ref.current) {
      const { scrollLeft, scrollWidth, clientWidth } = ref.current;
      const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
      setProgress(Math.min(progress, 100));
    }
  };

  useEffect(() => {
    const personalRef = personalScrollRef.current;
    const audienceRef = audienceScrollRef.current;

    const handlePersonalScroll = () => updateScrollProgress(personalScrollRef, setPersonalScrollProgress);
    const handleAudienceScroll = () => updateScrollProgress(audienceScrollRef, setAudienceScrollProgress);

    if (personalRef) personalRef.addEventListener('scroll', handlePersonalScroll);
    if (audienceRef) audienceRef.addEventListener('scroll', handleAudienceScroll);

    return () => {
      if (personalRef) personalRef.removeEventListener('scroll', handlePersonalScroll);
      if (audienceRef) audienceRef.removeEventListener('scroll', handleAudienceScroll);
    };
  }, []);

  const navItems = ['Home', 'Search', 'Recommendations', 'Analytics'];

  const MovieCard = ({ movie, index }) => (
    <div 
      className="flex-none w-56 group cursor-pointer"
      style={{ 
        animation: 'slideIn 0.5s ease-out forwards',
        animationDelay: `${index * 100}ms`,
        opacity: 0
      }}
    >
      <div className="relative overflow-hidden rounded-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-cyan-500/50">
        {movie.topPick && (
          <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1 animate-pulse">
            <Star className="w-3 h-3 fill-current" />
            <span>Top Pick</span>
          </div>
        )}
        <img 
          src={movie.poster} 
          alt={movie.title}
          className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-bold text-lg mb-1 drop-shadow-lg">{movie.title}</h3>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-300">{movie.year} • {movie.genre}</span>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">{movie.rating}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 px-1">
        <h3 className="text-white font-semibold truncate group-hover:text-cyan-400 transition-colors">
          {movie.title}
        </h3>
        <p className="text-gray-400 text-sm">{movie.year} • {movie.genre}</p>
      </div>
    </div>
  );

  const CarouselSection = ({ title, icon: Icon, movies, scrollRef, scrollProgress, iconColor }) => (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-6 px-4 md:px-8">
        <div className="flex items-center space-x-3">
          <Icon className={`w-6 h-6 ${iconColor}`} />
          <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
        </div>
      </div>
      
      <div className="relative group">
        {/* Left Arrow */}
        <button 
          onClick={() => scroll(scrollRef, 'left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-70 hover:bg-opacity-90 p-3 rounded-r-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-l-0 border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/50"
        >
          <ChevronLeft className="w-8 h-8 text-cyan-400" />
        </button>

        {/* Gradient Edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-[5] pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-[5] pointer-events-none"></div>

        {/* Carousel */}
        <div 
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide px-4 md:px-8 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie, index) => (
            <MovieCard key={movie.id} movie={movie} index={index} />
          ))}
        </div>

        {/* Right Arrow */}
        <button 
          onClick={() => scroll(scrollRef, 'right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black bg-opacity-70 hover:bg-opacity-90 p-3 rounded-l-xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-r-0 border-purple-400 hover:shadow-lg hover:shadow-purple-500/50"
        >
          <ChevronRight className="w-8 h-8 text-purple-400" />
        </button>
      </div>

      {/* Scroll Progress Bar */}
      <div className="mt-4 px-4 md:px-8">
        <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-all duration-300 rounded-full"
            style={{ width: `${scrollProgress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white font-sans overflow-x-hidden">
      {/* Floating Particles Background */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-cyan-400"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-40 backdrop-blur-lg border-b border-gray-800">
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

      {/* Login Overlay */}
      {showLoginOverlay && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black bg-opacity-60 transition-opacity duration-500 ${
            isLoggedIn ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="bg-gray-900 bg-opacity-80 backdrop-blur-xl rounded-3xl p-12 border-2 border-cyan-400 shadow-2xl shadow-cyan-500/50 max-w-md w-full mx-4 transform transition-all duration-500 scale-100 hover:scale-105">
            <div className="text-center">
              <div className="inline-block p-6 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full mb-6 animate-pulse">
                <Lock className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                Unlock Personalized Recommendations
              </h2>
              <p className="text-gray-300 mb-8">
                Login to discover movies handpicked just for you based on your taste and preferences.
              </p>
              <button
                onClick={handleLogin}
                className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Lock className="w-5 h-5" />
                <span>Login to Continue</span>
              </button>
              <p className="text-gray-500 text-sm mt-4">
                New user? This is a demo - just click to explore!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`relative pt-24 transition-all duration-500 ${isLoggedIn ? 'opacity-100' : 'opacity-0'}`}>
        {/* Header */}
        <div className="text-center mb-12 px-4 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Your Movie Recommendations
          </h1>
          <p className="text-gray-400 text-lg mb-4">
            Movies handpicked just for you and inspired by audience trends
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto rounded-full animate-pulse"></div>
        </div>

        {/* Shuffle Button */}
        <div className="flex justify-center mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl font-semibold hover:shadow-xl hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105 flex items-center space-x-2">
            <Shuffle className="w-5 h-5" />
            <span>Shuffle Recommendations</span>
          </button>
        </div>

        {/* Carousel Sections */}
        <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
          <CarouselSection 
            title="Movies You Might Like"
            icon={Heart}
            movies={personalRecommendations}
            scrollRef={personalScrollRef}
            scrollProgress={personalScrollProgress}
            iconColor="text-pink-400"
          />
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '600ms' }}>
          <CarouselSection 
            title="Audience Favorites for You"
            icon={Users}
            movies={audienceFavorites}
            scrollRef={audienceScrollRef}
            scrollProgress={audienceScrollProgress}
            iconColor="text-cyan-400"
          />
        </div>

        {/* Bottom Spacing */}
        <div className="h-16"></div>
      </div>

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
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default RecommendationsPage;