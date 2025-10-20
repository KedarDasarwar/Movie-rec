import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Film, Users, Star, TrendingUp, Target, Calendar, Award, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,LabelList , AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnalyticsDashboard = () => {
  const [activeNav, setActiveNav] = useState('Analytics');
  const [timeFilter, setTimeFilter] = useState('all');
  const [animatedMetrics, setAnimatedMetrics] = useState({
    totalUsers: 0,
    totalMovies: 0,
    totalRatings: 0,
    avgRating: 0,
    coverage: 0
  });

  const [genreData, setGenreData] = useState([]);

  // Mock data
//   const metrics = {
//     totalUsers: 15847,
//     totalMovies: 8542,
//     totalRatings: 94231,
//     avgRating: 4.2,
//     coverage: 73.5
//   };

//   const genreData = [
//     { genre: 'Sci-Fi', avgRating: 4.5, count: 1250, color: '#06b6d4' },
//     { genre: 'Action', avgRating: 4.3, count: 1840, color: '#8b5cf6' },
//     { genre: 'Drama', avgRating: 4.6, count: 2100, color: '#ec4899' },
//     { genre: 'Comedy', avgRating: 4.0, count: 980, color: '#f59e0b' },
//     { genre: 'Thriller', avgRating: 4.4, count: 1560, color: '#10b981' },
//     { genre: 'Romance', avgRating: 3.9, count: 720, color: '#ef4444' }
//   ];

  const ratingsOverTime = [
    { date: 'Jan 1', ratings: 450, avgRating: 4.1 },
    { date: 'Jan 8', ratings: 520, avgRating: 4.2 },
    { date: 'Jan 15', ratings: 680, avgRating: 4.3 },
    { date: 'Jan 22', ratings: 590, avgRating: 4.0 },
    { date: 'Jan 29', ratings: 720, avgRating: 4.4 },
    { date: 'Feb 5', ratings: 850, avgRating: 4.5 },
    { date: 'Feb 12', ratings: 920, avgRating: 4.6 },
    { date: 'Feb 19', ratings: 780, avgRating: 4.3 },
    { date: 'Feb 26', ratings: 1050, avgRating: 4.7 },
    { date: 'Mar 5', ratings: 1180, avgRating: 4.8 }
  ];

  const topMovies = [
    { title: 'Inception', rating: 4.9, reviews: 2340 },
    { title: 'The Shawshank Redemption', rating: 4.8, reviews: 3120 },
    { title: 'Interstellar', rating: 4.7, reviews: 2890 },
    { title: 'The Dark Knight', rating: 4.8, reviews: 3450 },
    { title: 'Pulp Fiction', rating: 4.6, reviews: 2210 }
  ];

  const activeUsers = [
    { name: 'Sarah M.', ratings: 342, avatar: '👩' },
    { name: 'John D.', ratings: 298, avatar: '👨' },
    { name: 'Emily R.', ratings: 276, avatar: '👩' },
    { name: 'Michael B.', ratings: 254, avatar: '👨' },
    { name: 'Jessica L.', ratings: 231, avatar: '👩' }
  ];

  // Animate metrics counting up
useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/metrics/overview');
        const data = res.data;

        // Map API topGenres to your chart format with random colors
        const colors = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444', '#f43f5e', '#6366f1', '#facc15', '#0ea5e9'];
        const genresFormatted = data.topGenres.map((g, idx) => ({
          genre: g.genres,
          avgRating: 4 + Math.random() * 0.8, // mock average rating (API doesn't provide)
          count: g.cnt,
          color: colors[idx % colors.length]
        }));
        setGenreData(genresFormatted);

        // Animate metrics counting up
        const metrics = {
          totalUsers: data.totalUsers,
          totalMovies: data.totalMovies,
          totalRatings: data.totalRatings,
          avgRating: data.avgRatingsPerUser.toFixed(1),
          coverage: (data.coverage * 100).toFixed(1)
        };

        const duration = 200;
        const steps = 20;
        const interval = duration / steps;
        let currentStep = 0;

        const timer = setInterval(() => {
          currentStep++;
          const progress = currentStep / steps;

          setAnimatedMetrics({
            totalUsers: Math.floor(metrics.totalUsers * progress),
            totalMovies: Math.floor(metrics.totalMovies * progress),
            totalRatings: Math.floor(metrics.totalRatings * progress),
            avgRating: (metrics.avgRating * progress).toFixed(1),
            coverage: (metrics.coverage * progress).toFixed(1)
          });

          if (currentStep >= steps) {
            clearInterval(timer);
            setAnimatedMetrics(metrics);
          }
        }, interval);

      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
  }, []);

  //const navItems = ['Home', 'Search', 'Analytics', 'About'];

  const MetricCard = ({ icon: Icon, label, value, suffix = '', delay = 0 }) => (
    <div 
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-cyan-400 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30 group"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className="w-10 h-10 text-cyan-400 group-hover:text-purple-400 transition-colors" />
        <div className="w-12 h-12 bg-cyan-500 bg-opacity-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
          <div className="w-8 h-8 bg-cyan-500 bg-opacity-20 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
        {value}{suffix}
      </div>
      <div className="text-gray-400 text-sm font-medium">{label}</div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 bg-opacity-95 backdrop-blur-lg border border-cyan-400 rounded-xl p-4 shadow-2xl">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-950 text-white font-sans overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '700ms' }}></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1400ms' }}></div>
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

      {/* Main Content */}
      <div className="relative pt-24 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto rounded-full mb-4 animate-pulse"></div>
            <p className="text-gray-400 text-lg">Your movie insights at a glance</p>
          </div>

          {/* Time Filter */}
          <div className="flex justify-end mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center space-x-2 bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-1 border border-gray-700">
              <Calendar className="w-5 h-5 text-cyan-400 ml-2" />
              {['Week', 'Month', 'All Time'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter.toLowerCase().replace(' ', ''))}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    timeFilter === filter.toLowerCase().replace(' ', '')
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            <MetricCard 
              icon={Users} 
              label="Total Users" 
              value={animatedMetrics.totalUsers.toLocaleString()} 
              delay={0}
            />
            <MetricCard 
              icon={Film} 
              label="Total Movies" 
              value={animatedMetrics.totalMovies.toLocaleString()} 
              delay={100}
            />
            <MetricCard 
              icon={Star} 
              label="Total Ratings" 
              value={animatedMetrics.totalRatings.toLocaleString()} 
              delay={200}
            />
            <MetricCard 
              icon={TrendingUp} 
              label="Avg Rating Given Per User" 
              value={animatedMetrics.avgRating} 
              suffix="" 
              delay={300}
            />
            <MetricCard 
              icon={Target} 
              label="Coverage" 
              value={animatedMetrics.coverage} 
              suffix="%" 
              delay={400}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
{/* Top Genres Chart */}
<div
  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-purple-500 transition-all duration-500 animate-fade-in"
  style={{ animationDelay: '500ms' }}
>
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
      <Activity className="w-6 h-6 text-purple-400" />
      <span>Top Genres</span>
    </h2>
  </div>

  <ResponsiveContainer width="100%" height={350}>
    <BarChart
      layout="vertical"
      data={[...genreData] // ✅ make a copy to avoid mutating state
        .sort((a, b) => b.count - a.count)
        .slice(0, 6)
      }
      margin={{ top: 10, right: 30, left: 120, bottom: 10 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
      <XAxis type="number" stroke="#aaa" />
      <YAxis
        dataKey="genre"
        type="category"
        width={100}
        stroke="#aaa"
        tick={{ fontSize: 14, fill: '#fff', wordWrap: 'break-word' }}
      />
      <Tooltip
        contentStyle={{
          backgroundColor: '#1f2937',
          border: '1px solid #4c1d95',
          color: '#fff'
        }}
      />
      <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} barSize={25} />
    </BarChart>
  </ResponsiveContainer>
</div>

            {/* Average Rating by Genre */}
<div 
  className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-cyan-500 transition-all duration-500 animate-fade-in" 
  style={{ animationDelay: '600ms' }}
>
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
      <TrendingUp className="w-6 h-6 text-cyan-400" />
      <span>Average Rating by Genre</span>
    </h2>
  </div>

  <ResponsiveContainer width="100%" height={350}>
  <BarChart
    data={[...genreData]
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, 6)
    }
    margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
  >
    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />

    {/* Hide X-axis labels since we’ll show genre names inside bars */}
    <XAxis dataKey="genre" hide />
    <YAxis stroke="#9ca3af" domain={[0, 5]} />
    <Tooltip content={<CustomTooltip />} />

    <Bar dataKey="avgRating" radius={[6, 6, 0, 0]}>
      {genreData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={entry.color || '#06b6d4'} />
      ))}

      {/* Genre name inside bars (vertical) */}
      <LabelList 
  dataKey="genre"
  position="inside"
  angle={-90}
  style={{
    fill: "#f0f9ff",                 // bright cyan-white for contrast
    fontSize: 14,                    // larger & more readable
    fontWeight: 700,                 // bold and clear
    textAnchor: "middle",
    fontFamily: "'Orbitron', sans-serif", // futuristic Google font
    letterSpacing: "0.5px",
    textShadow: "0 0 6px rgba(56, 189, 248, 0.8)" // glowing text effect
  }}
/>
    </Bar>
  </BarChart>
</ResponsiveContainer>

</div>

          </div>

          {/* Additional Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Rated Movies */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-pink-500 transition-all duration-500 animate-fade-in" style={{ animationDelay: '700ms' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <Award className="w-6 h-6 text-pink-400" />
                  <span>Top Rated Movies</span>
                </h2>
              </div>
              <div className="space-y-4">
                {topMovies.map((movie, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-700 bg-opacity-30 rounded-xl hover:bg-opacity-50 transition-all group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold text-cyan-400 bg-cyan-500 bg-opacity-10 w-10 h-10 rounded-full flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                          {movie.title}
                        </div>
                        <div className="text-sm text-gray-400">{movie.reviews.toLocaleString()} reviews</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xl font-bold text-yellow-400">{movie.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Active Users */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 hover:border-green-500 transition-all duration-500 animate-fade-in" style={{ animationDelay: '800ms' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                  <Users className="w-6 h-6 text-green-400" />
                  <span>Most Active Users</span>
                </h2>
              </div>
              <div className="space-y-4">
                {activeUsers.map((user, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-700 bg-opacity-30 rounded-xl hover:bg-opacity-50 transition-all group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{user.avatar}</div>
                      <div>
                        <div className="font-semibold text-white group-hover:text-green-400 transition-colors">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-400">{user.ratings} ratings</div>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-green-500 bg-opacity-20 text-green-400 rounded-full text-sm font-semibold">
                      #{index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
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
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AnalyticsDashboard;