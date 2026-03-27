import React from 'react';
import { Brain, Calendar, ShieldCheck, Zap } from 'lucide-react';

const Features = () => {
  const featureData = [
    {
      icon: <Brain className="w-8 h-8 text-blue-400" />,
      title: "Greedy Logic Engine",
      desc: "Optimized DAA algorithms that ensure 100% conflict-free subject mapping across all years."
    },
    {
      icon: <Calendar className="w-8 h-8 text-cyan-400" />,
      title: "Holiday Simulation",
      desc: "Automatically detects Sundays and maps academic holidays to ensure a realistic schedule."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-indigo-400" />,
      title: "Slot Constraints",
      desc: "Handles complex Mid-Sem and End-Sem patterns with alternating classroom logic."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "Instant Export",
      desc: "Generate and download your complete timetable in CSV or PDF format in under 5 seconds."
    }
  ];

  return (
    <section className="py-24 bg-[#070e1b] relative overflow-hidden">
      {/* Background Subtle Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-16 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
            Built for <span className="text-blue-500">Academic Precision.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
            Everything you need to manage complex university exam schedules without the manual headache.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featureData.map((f, i) => (
            <div 
              key={i} 
              className="group p-8 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-blue-500/50 transition-all duration-500 shadow-2xl hover:-translate-y-2"
            >
              {/* Icon Container */}
              <div className="mb-6 w-16 h-16 rounded-2xl bg-[#0a192f] flex items-center justify-center border border-white/5 group-hover:scale-110 group-hover:border-blue-500/30 transition-all duration-500 shadow-inner">
                {f.icon}
              </div>

              {/* Text */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                {f.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed font-medium">
                {f.desc}
              </p>

              {/* Subtle Decorative Line */}
              <div className="mt-6 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-blue-600 to-transparent transition-all duration-700"></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;