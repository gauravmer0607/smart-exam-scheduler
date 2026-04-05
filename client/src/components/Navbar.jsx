import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home as HomeIcon, User, LogOut, ChevronDown, RefreshCw } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // --- CONFIGURATION ---
  const BACKEND_URL = "https://smart-exam-scheduler-jwva.onrender.com";

  // 1. Fetch User Data from Backend
  const fetchUserProfile = async () => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      setIsLoggedIn(false);
      return;
    }

    try {
      setLoading(true);
      // Backend request to get latest profile
      const response = await axios.get(`${BACKEND_URL}/api/users/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setUserName(response.data.user.name);
        setIsLoggedIn(true);
        // Sync local storage in case name was updated
        localStorage.setItem('user', response.data.user.name);
      }
    } catch (err) {
      console.error("Navbar Auth Error:", err);
      // If token is invalid/expired
      if (err.response?.status === 401 || err.response?.status === 404) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    // Listen for login events from other components
    window.addEventListener('storage', fetchUserProfile);
    return () => window.removeEventListener('storage', fetchUserProfile);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setShowDropdown(false);
    navigate('/auth');
  };

  const initials = useMemo(() => {
    if (!userName) return "U";
    return userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }, [userName]);

  return (
    <nav className="flex justify-between items-center px-10 md:px-16 py-6 bg-[#0a192f] border-b border-white/10 sticky top-0 z-50 backdrop-blur-md">
      <div className="text-2xl font-black tracking-tighter text-white hover:text-blue-400 transition-all">
        <Link to="/">TIMECODES</Link>
      </div>

      <div className="flex items-center space-x-8">
        <Link to="/" className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition-colors group">
          <HomeIcon size={18} className="group-hover:scale-110 transition-transform text-blue-400" />
          Home
        </Link>

        {!isLoggedIn ? (
          <Link to="/auth" className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
            <User size={16} /> Login / Signup
          </Link>
        ) : (
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="group flex items-center gap-3 bg-white/5 border border-white/10 p-1.5 pl-4 rounded-2xl hover:bg-white/10 transition-all"
            >
              <span className="text-sm font-bold text-white uppercase truncate max-w-[100px]">
                {loading ? <RefreshCw size={14} className="animate-spin text-blue-400" /> : userName}
              </span>
              
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center relative">
                <span className="font-black text-white text-xs">{initials}</span>
                <div className="absolute -bottom-1 -right-1 bg-[#0a192f] p-0.5 rounded-md border border-white/10">
                  <ChevronDown size={10} className={`text-white transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </button>

            <AnimatePresence>
              {showDropdown && (
                <>
                  <div className="fixed inset-0 z-[-1]" onClick={() => setShowDropdown(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-48 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 px-5 py-4 text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all">
                      <LogOut size={18} /> Logout
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;