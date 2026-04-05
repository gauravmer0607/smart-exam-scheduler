import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home as HomeIcon, User, LogOut, ChevronDown } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  // Handle Initial Auth State & Sync across tabs
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('user');
      if (user) {
        setIsLoggedIn(true);
        setUserName(user);
      } else {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setShowDropdown(false);
    navigate('/');
  };

  // Memoized initials calculation
  const initials = useMemo(() => {
    if (!userName) return "U";
    return userName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [userName]);

  return (
    <nav className="flex justify-between items-center px-10 md:px-16 py-6 bg-[#0a192f] border-b border-white/10 sticky top-0 z-50 backdrop-blur-md">
      {/* Brand Logo */}
      <div className="text-2xl font-black tracking-tighter text-white hover:text-blue-400 transition-all">
        <Link to="/">TIMECODES</Link>
      </div>

      <div className="flex items-center space-x-8">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition-colors group"
        >
          <HomeIcon size={18} className="group-hover:scale-110 transition-transform text-blue-400" />
          Home
        </Link>

        {!isLoggedIn ? (
          <Link 
            to="/auth" 
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
          >
            <User size={16} /> Login / Signup
          </Link>
        ) : (
          <div className="relative">
            {/* User Profile Trigger */}
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="group flex items-center gap-3 bg-white/5 border border-white/10 p-1.5 pl-4 rounded-2xl hover:bg-white/10 hover:border-blue-500/30 transition-all active:scale-95"
            >
              <span className="text-sm font-bold text-white uppercase truncate max-w-[100px]">
                {userName}
              </span>
              
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center relative shadow-lg shadow-blue-500/20">
                <span className="font-black text-white text-xs">{initials}</span>
                <div className="absolute -bottom-1 -right-1 bg-[#0a192f] p-0.5 rounded-md border border-white/10 group-hover:border-blue-400 transition-colors">
                  <ChevronDown 
                    size={10} 
                    className={`text-white transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} 
                  />
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
                    className="absolute right-0 mt-3 w-48 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 origin-top-right"
                  >
                    <button 
                      onClick={handleLogout} 
                      className="w-full flex items-center gap-3 px-5 py-4 text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all"
                    >
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