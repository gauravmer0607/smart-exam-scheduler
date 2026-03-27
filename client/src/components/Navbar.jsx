import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home as HomeIcon, User, X, History, LogOut, Menu, ChevronDown } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  // Check login status on load
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
      setUserName(user);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setShowDropdown(false);
    setIsHistoryOpen(false);
    navigate('/');
  };

  // Get Initials (Aditya -> AD)
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <nav className="flex justify-between items-center px-16 py-6 bg-[#0a192f] border-b border-white/10 sticky top-0 z-50 backdrop-blur-md">
        
        {/* Brand */}
        <div className="text-2xl font-black tracking-tighter text-white pl-8 hover:text-blue-400 transition-all cursor-pointer">
          <Link to="/">TIMECODES</Link>
        </div>

        {/* Right Side Nav Links */}
        <div className="flex items-center space-x-10 pr-8">
          <Link to="/" className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition-colors group">
            <HomeIcon size={18} className="group-hover:scale-110 transition-transform text-blue-400" />
            Home
          </Link>

          {!isLoggedIn ? (
            <Link 
              to="/auth" 
              className="group relative flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
            >
              <User size={16} /> Login / Signup
            </Link>
          ) : (
            /* --- User Profile with Dropdown --- */
            <div className="relative">
              <div 
                onClick={() => setShowDropdown(!showDropdown)}
                className="group flex items-center gap-3 bg-white/5 border border-white/10 p-1.5 pl-4 rounded-2xl cursor-pointer hover:bg-white/10 hover:border-blue-500/30 transition-all active:scale-95 shadow-lg shadow-black/20"
              >
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none">Account</span>
                  <span className="text-[11px] font-bold text-white uppercase truncate max-w-[80px]">{userName}</span>
                </div>

                <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center relative shadow-lg shadow-blue-500/20">
                  <span className="font-black text-white text-xs">{getInitials(userName)}</span>
                  <div className="absolute -bottom-1 -right-1 bg-[#0a192f] p-0.5 rounded-md border border-white/10 group-hover:border-blue-400 transition-colors">
                    <ChevronDown size={10} className={`text-white transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </div>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-3 w-48 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    <button 
                      onClick={() => { setIsHistoryOpen(true); setShowDropdown(false); }}
                      className="w-full flex items-center gap-3 px-5 py-4 text-sm font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-all border-b border-white/5"
                    >
                      <History size={18} className="text-blue-400" /> View History
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-5 py-4 text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </nav>

      {/* --- History Drawer --- */}
      <AnimatePresence>
        {isHistoryOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
              onClick={() => setIsHistoryOpen(false)} 
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
            />

            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
              className="fixed right-0 top-0 h-full w-full max-w-[350px] bg-[#0a192f] border-l border-white/10 z-[70] p-8 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600/10 rounded-lg"><History className="text-blue-400" size={20} /></div>
                  <h3 className="text-xl font-black text-white uppercase tracking-widest">History</h3>
                </div>
                <button onClick={() => setIsHistoryOpen(false)} className="text-slate-500 hover:text-white transition-colors p-1"><X size={24} /></button>
              </div>

              <div className="flex-grow space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
                  <p className="text-slate-600 text-sm italic">No history found.</p>
                  <p className="text-[10px] text-slate-700 font-bold mt-2 uppercase tracking-widest">Your generated schedules appear here</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;