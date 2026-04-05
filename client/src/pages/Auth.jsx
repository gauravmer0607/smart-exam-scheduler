import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  // Yahan tera Render Backend URL hai
  const BACKEND_URL = "https://smart-exam-scheduler-jwva.onrender.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Endpoint logic: /api/auth/login ya /api/auth/signup
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const response = await axios.post(`${BACKEND_URL}${endpoint}`, formData);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', response.data.user.name);
        localStorage.setItem('userId', response.data.user.id || response.data.user._id);
        
        navigate('/');
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Authentication Failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-blue-600/10 blur-[180px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/5 blur-[150px] rounded-full"></div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full h-screen flex flex-col md:flex-row z-10"
      >
        {/* Left Side: Branding Section */}
        <div className="hidden md:flex md:w-7/12 h-full relative flex-col justify-center p-20 bg-slate-950/40">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/40">
                  <ShieldCheck className="text-white" size={24} />
               </div>
               <span className="text-white font-black tracking-widest text-2xl uppercase">Timecodes</span>
            </div>
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-8xl font-black text-white leading-[0.85] tracking-tighter"
            >
              EXAMS <br /> <span className="text-blue-500">SIMPLIFIED.</span>
            </motion.h1>
            
            <p className="text-slate-400 max-w-sm text-lg font-medium leading-relaxed">
              Automated conflict-free scheduling engine. Skip the manual work, focus on the results.
            </p>
          </div>
        </div>

        {/* Right Side: Form Section */}
        <div className="w-full md:w-5/12 h-full bg-[#030712]/90 backdrop-blur-2xl p-8 md:p-24 flex flex-col justify-center border-l border-white/5">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'signup'}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-10"
            >
              <div className="space-y-3">
                <h3 className="text-4xl font-black text-white tracking-tight">
                  {isLogin ? 'Welcome Back.' : 'Get Started.'}
                </h3>
                <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                  {isLogin ? 'Login to your dashboard' : 'Create your administration account'}
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-5">
                {!isLogin && (
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                    <input 
                      name="name"
                      type="text" 
                      placeholder="Admin Name" 
                      onChange={handleChange}
                      className="w-full bg-slate-900/80 border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-700" 
                      required 
                    />
                  </div>
                )}
                
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input 
                    name="email"
                    type="email" 
                    placeholder="Email Address" 
                    onChange={handleChange}
                    className="w-full bg-slate-900/80 border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-700" 
                    required 
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                  <input 
                    name="password"
                    type="password" 
                    placeholder="Password" 
                    onChange={handleChange}
                    className="w-full bg-slate-900/80 border border-white/10 p-4 pl-12 rounded-2xl text-white outline-none focus:border-blue-500 transition-all placeholder:text-slate-700" 
                    required 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-blue-600 py-5 rounded-2xl font-black text-white hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'SIGN IN' : 'CREATE ACCOUNT')} 
                  {!loading && <ArrowRight size={20} />}
                </button>
              </form>

              <div className="text-center">
                <button 
                  type="button" 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-slate-500 text-xs font-black hover:text-white transition-all uppercase tracking-widest"
                >
                  {isLogin ? "New to Timecodes?" : "Already have an account?"} 
                  <span className="text-blue-500 ml-2 border-b-2 border-blue-500/20 pb-1">
                    {isLogin ? 'Register' : 'Login'}
                  </span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-8 left-0 right-0 text-center opacity-20">
             <p className="text-[10px] text-white font-bold uppercase tracking-[0.5em]">System Secure 256-Bit</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;