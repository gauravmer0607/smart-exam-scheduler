import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/5 py-14 mt-auto">
      <div className="container mx-auto px-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          
          {/* Left Side: Brand & Mission */}
          <div className="space-y-4">
            <h3 className="text-2xl font-black tracking-tighter text-white">
              TIMECODES
            </h3>
            <p className="text-zinc-500 text-sm font-medium max-w-sm leading-relaxed">
              An advanced greedy engine for academic scheduling. 
              Designed to eliminate conflicts and maximize efficiency.
            </p>
          </div>

          {/* Right Side: Text-based Social Links & Copyright */}
          <div className="flex flex-col items-end gap-6">
            <div className="flex space-x-8">
              <a href="#" className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-blue-400 transition-all cursor-pointer">
                Github
              </a>
              <a href="#" className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-blue-400 transition-all cursor-pointer">
                LinkedIn
              </a>
              <a href="#" className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-blue-400 transition-all cursor-pointer">
                Contact
              </a>
            </div>
            
            <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-[0.3em]">
              © 2026 TIMECODES. ALL RIGHTS RESERVED.
            </p>
          </div>

        </div>

        {/* Bottom Decorative Element */}
        <div className="mt-12 flex items-center gap-4">
          <div className="h-[1px] flex-grow bg-white/5"></div>
          <div className="w-2 h-2 rounded-full bg-blue-600/40 blur-[2px]"></div>
          <div className="h-[1px] w-12 bg-white/5"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;