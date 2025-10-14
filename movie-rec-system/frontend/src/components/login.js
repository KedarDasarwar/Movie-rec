import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Mail, Lock, User, X, Sparkles, Eye, EyeOff } from 'lucide-react';

const BACKEND_URL = "http://localhost:4000/api";


const AuthPage = () => {
    const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsAnimating(false);
    }, 300);
  };

 const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isLogin ? `${BACKEND_URL}/auth/login` : `${BACKEND_URL}/auth/signup`;
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || 'Something went wrong');
        setLoading(false);
        return;
      }
      
      if (isLogin) {
        // save JWT token
        localStorage.setItem('token', data.token);
        alert('Login successful! 🎬');
        navigate('/'); 
        // optionally redirect or show movies page
      } else {
        alert('Signup successful! Welcome to MovieMind 🎥');
        // after signup, optionally switch to login
        setIsLogin(true);
      }
    } catch (err) {
      console.error(err);
      alert('Network error. Check backend is running.');
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden flex items-center justify-center p-4">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '700ms' }}></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1400ms' }}></div>
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* Blurred Background Overlay */}
      <div className="fixed inset-0 backdrop-blur-md bg-black bg-opacity-50"></div>

      {/* Auth Modal */}
      <div className={`relative z-10 w-full max-w-md transform transition-all duration-500 ${
        isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        <div className="bg-gradient-to-br from-gray-900/90 to-indigo-900/70 backdrop-blur-xl rounded-3xl border-2 border-cyan-400/30 shadow-2xl shadow-cyan-500/20 overflow-hidden animate-modal-appear">
          {/* Close Button */}
          <button 
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-all hover:rotate-90 duration-300 z-10"
            onClick={() => console.log('Close modal')}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Header */}
          <div className="relative pt-8 pb-6 px-8 text-center">
            <div className="inline-flex items-center justify-center space-x-2 mb-4">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full animate-pulse">
                <Film className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
              {isLogin ? 'Welcome Back' : 'Join MovieMind'}
            </h1>
            <p className="text-gray-400 text-sm flex items-center justify-center space-x-1">
              <Sparkles className="w-4 h-4" />
              <span>{isLogin ? 'Your cinematic world awaits' : 'Start your movie journey today'}</span>
            </p>
          </div>

          {/* Form Content */}
          <div className="px-8 pb-8">
            <div className="space-y-5">
              {/* Name Field (Signup only) */}
              {!isLogin && (
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all backdrop-blur-sm"
                  />
                </div>
              )}

              {/* Email Field */}
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all backdrop-blur-sm"
                />
              </div>

              {/* Password Field */}
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full pl-12 pr-12 py-3 bg-gray-800/50 border-2 border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 transition-all backdrop-blur-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Forgot Password (Login only) */}
              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 group relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="relative">{loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}</span>
                <Film className="relative w-5 h-5 group-hover:rotate-12 transition-transform" />
              </button>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-900/50 text-gray-400">or</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="py-3 bg-gray-800/50 border-2 border-gray-700 rounded-xl text-white font-semibold hover:border-cyan-400 hover:bg-gray-800/70 transition-all hover:scale-105"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span className="text-xl">G</span>
                  <span>Google</span>
                </span>
              </button>
              <button
                type="button"
                className="py-3 bg-gray-800/50 border-2 border-gray-700 rounded-xl text-white font-semibold hover:border-purple-400 hover:bg-gray-800/70 transition-all hover:scale-105"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span className="text-xl">f</span>
                  <span>Facebook</span>
                </span>
              </button>
            </div>

            {/* Toggle Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                {isLogin ? "New user? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={handleToggle}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors hover:underline"
                >
                  {isLogin ? 'Sign Up' : 'Login'}
                </button>
              </p>
            </div>
          </div>

          {/* Bottom Glow Effect */}
          <div className="h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-pulse"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        @keyframes modal-appear {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-modal-appear {
          animation: modal-appear 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AuthPage;