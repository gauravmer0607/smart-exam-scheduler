import React from 'react';
import { useNavigate } from 'react-router-dom';
import heroBg from '../assets/bg.png'; 

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative h-[85vh] w-full flex items-center overflow-hidden bg-[#0a192f]">
      
      {/* Background Layer with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="Academic schedule background" 
          className="w-full h-full object-cover opacity-60"
          loading="eager"
        />
        {/* Subtle dark gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a192f] via-[#0a192f]/60 to-transparent"></div>
      </div>

      {/* Main Hero Content */}
      <div className="container mx-auto px-10 md:px-20 relative z-10">
        <div className="max-w-3xl space-y-8">
          
          {/* Text Content Wrapper */}
          <div className="space-y-6 bg-[#0a192f]/40 backdrop-blur-sm p-8 rounded-3xl border border-white/5 shadow-2xl">
            <h1 className="text-6xl md:text-7xl font-black text-white leading-[1.1] tracking-tight">
              Schedule Exams <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Without Chaos.
              </span>
            </h1>

            <div className="space-y-4">
              <p className="text-2xl text-slate-100 font-bold tracking-wide">
                Smart allotment for Mid-Sem & End-Sem.
              </p>
              <p className="text-lg text-slate-300 leading-relaxed font-medium max-w-xl">
                100% conflict-free. Automatically handles slot mapping, 
                alternate day rotations, and skips academic holidays.
              </p>
            </div>
          </div>

          {/* Call to Action Button */}
          <div className="pt-4">
            <button 
              onClick={() => navigate('/generate')}
              className="group relative overflow-hidden bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-blue-500 transition-all active:scale-95 shadow-[0_20px_50px_rgba(37,99,235,0.3)]"
            >
              <span className="relative z-10">Generate Timetable</span>
              {/* Hover highlight effect */}
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>

        </div>
      </div>

      {/* Bottom fade transition */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#0a192f] to-transparent z-10"></div>
    </section>
  );
};

export default Hero;