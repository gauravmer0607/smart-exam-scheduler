import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      // Make sure your backend is running on port 5000
      const response = await axios.post(`http://localhost:5000${endpoint}`, formData);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', response.data.user.name);
        
        navigate('/');
        window.location.reload(); 
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Authentication Failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-0 relative overflow-hidden font-sans">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-600/20 blur-[180px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full h-screen flex flex-col md:flex-row z-10"
      >
        
        {/* Left Side: Brand Visual Section */}
        <div className="hidden md:flex md:w-7/12 h-full relative flex-col justify-start p-16 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2032&auto=format&fit=crop" 
              alt="Cyber Grid"
              className="w-full h-full object-cover opacity-40 scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-transparent"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-8">
               <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
                  <span className="font-black text-white">TC</span>
               </div>
               <span className="text-white font-black tracking-widest text-xl uppercase">Timecodes</span>
            </div>
            
            <motion.h1 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-7xl font-black text-white leading-[0.9] tracking-tighter"
            >
              CRAFTING <br /> <span className="text-blue-500">EFFICIENCY.</span>
            </motion.h1>
            <p className="mt-6 text-slate-400 max-w-md font-medium">
              The ultimate exam scheduling engine for modern universities. Zero conflicts, maximum productivity.
            </p>
          </div>
        </div>

        {/* Right Side: Form Section */}
        <div className="w-full md:w-5/12 h-full bg-[#030712]/80 backdrop-blur-xl p-8 md:p-20 flex flex-col justify-center border-l border-white/5 relative">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'signup'}
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h3 className="text-4xl font-black text-white tracking-tight">
                  {isLogin ? 'Hello Again.' : 'Create Account.'}
                </h3>
                <p className="text-slate-500 text-sm font-medium">
                  {isLogin ? 'Enter your credentials to manage your schedules.' : 'Start your journey with precision scheduling.'}
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                {!isLogin && (
                  <div className="group relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                    <input 
                      name="name"
                      type="text" 
                      placeholder="Full Name" 
                      onChange={handleChange}
                      className="w-full bg-slate-900/50 border border-white/5 p-4 pl-12 rounded-xl text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-600" 
                      required 
                    />
                  </div>
                )}
                
                <div className="group relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                  <input 
                    name="email"
                    type="email" 
                    placeholder="Email Address" 
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-white/5 p-4 pl-12 rounded-xl text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-600" 
                    required 
                  />
                </div>

                <div className="group relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                  <input 
                    name="password"
                    type="password" 
                    placeholder="Password" 
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-white/5 p-4 pl-12 rounded-xl text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-600" 
                    required 
                  />
                </div>

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-blue-600 py-4 rounded-xl font-black text-white hover:bg-blue-500 transition-all flex items-center justify-center gap-3 group shadow-2xl shadow-blue-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'SIGN IN' : 'GET STARTED')} 
                    {!loading && <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />}
                  </button>
                </div>
              </form>

              <div className="text-center pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-slate-500 text-sm font-bold hover:text-white transition-all uppercase tracking-tighter"
                >
                  {isLogin ? "Need an account? " : "Already registered? "} 
                  <span className="text-blue-400 ml-1 underline decoration-blue-400/30 underline-offset-8">
                    {isLogin ? 'Create one now' : 'Sign in here'}
                  </span>
                </button>
              </div>

            </motion.div>
          </AnimatePresence>

          {/* Bottom Footer Info */}
          <div className="absolute bottom-8 left-0 right-0 text-center">
             <p className="text-[10px] text-slate-800 font-bold uppercase tracking-[0.4em]">© 2026 Timecodes Intelligence</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;