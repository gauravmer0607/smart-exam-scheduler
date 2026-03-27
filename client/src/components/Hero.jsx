import React from 'react';
import { useNavigate } from 'react-router-dom';
// 🔥 Ensure kar tera import path sahi hai
import heroBg from '../assets/bg.png'; 

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative h-[85vh] w-full flex items-center overflow-hidden bg-[#0a192f]">
      
      {/* 1. Full-Screen Background Image (Stronger, More Solid) */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="Academic Background" 
          /* 🔥 Changes: opacity-25 ko opacity-70 kar diya, aur grayscale hata di */
          className="w-full h-full object-cover opacity-70"
        />
        {/* 🔥 Change: Gradient Overlay ko bahut subtle (Halka) kar diya */}
        <div className="absolute inset-0 bg-[#0a192f]/50"></div>
      </div>

      {/* 2. Content Over Image (Left Aligned) */}
      <div className="container mx-auto px-20 relative z-10">
        <div className="max-w-3xl space-y-8">
          
          {/* 🔥 Change: Text par shadow aur background diya taaki read-able rahe */}
          <div className="space-y-6 bg-[#0a192f]/80 p-6 rounded-2xl w-fit border border-blue-500/10">
            <h1 className="text-7xl font-black text-white leading-[1.1] tracking-tight text-shadow-lg">
              Schedule Exams <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Without Chaos.
              </span>
            </h1>

            <div className="space-y-3">
              <p className="text-2xl text-slate-100 font-extrabold tracking-wide">
                Smart allotment for Mid-Sem & End-Sem.
              </p>
              <p className="text-xl text-slate-300 leading-relaxed font-semibold max-w-xl">
                100% conflict-free. Automatically handles slot mapping and skips academic holidays.
              </p>
            </div>
          </div>

          <div className="pt-6">
            <button 
              onClick={() => navigate('/generate')}
              className="group relative bg-blue-600 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all shadow-2xl shadow-blue-900/40 active:scale-95 overflow-hidden border border-blue-400/20"
            >
              <span className="relative z-10 font-black uppercase tracking-wider">Generate Timetable</span>
              {/* Button Shine on Hover */}
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          </div>

        </div>
      </div>

      {/* 🔥 Change: Bottom Glow ko bahut subtle (Halka) kar diya */}
      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#0a192f] to-transparent z-10"></div>
    </section>
  );
};

export default Hero;