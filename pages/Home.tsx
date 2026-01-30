
import React from 'react';
import { AppMode } from '../types';
// Added missing 'Activity' import
import { Play, Layers, Globe, Cpu, Activity } from 'lucide-react';

interface HomeProps {
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
}

const Home: React.FC<HomeProps> = ({ appMode, setAppMode }) => {
  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-4rem)]">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-electricTeal/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-neonCrimson/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10 py-12 px-4 max-w-6xl mx-auto">
        <header className="mb-16 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-electricTeal/10 border border-electricTeal/20 text-electricTeal text-xs font-bold uppercase tracking-widest mb-6">
            <Cpu size={14} /> AI Powered Surveillance
          </div>
          <h2 className="text-5xl lg:text-7xl font-extrabold mb-6 leading-tight">
            Seeing Smarter: <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-electricTeal to-biolumeGreen">
              Intelligence from Data
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl">
            Revolutionizing urban infrastructure with real-time video perception and rule-based autonomous reasoning. Secure, reliable, and high-performance.
          </p>
        </header>

        <section className="glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4">Command Module</h3>
              <p className="text-gray-400 mb-8">Select your operational environment to begin processing assets.</p>
              
              <div className="flex items-center p-2 bg-obsidian rounded-2xl w-fit border border-white/10">
                <button
                  onClick={() => setAppMode('archive')}
                  className={`px-8 py-3 rounded-xl transition-all font-bold ${
                    appMode === 'archive' 
                    ? 'bg-electricTeal text-obsidian shadow-[0_0_20px_rgba(0,232,255,0.4)]' 
                    : 'text-gray-500 hover:text-white'
                  }`}
                >
                  Archive Upload
                </button>
                <button
                  onClick={() => setAppMode('live')}
                  className={`px-8 py-3 rounded-xl transition-all font-bold ${
                    appMode === 'live' 
                    ? 'bg-neonCrimson text-white shadow-[0_0_20px_rgba(255,31,138,0.4)]' 
                    : 'text-gray-500 hover:text-white'
                  }`}
                >
                  Live Feed
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1 w-full">
              {[
                { icon: <Layers />, label: 'Data Layers', val: '12 Active' },
                { icon: <Globe />, label: 'Network', val: 'Global' },
                { icon: <Play />, label: 'Latent Delay', val: '< 50ms' },
                { icon: <Activity />, label: 'Compute', val: 'Edge-AI' },
              ].map((stat, i) => (
                <div key={i} className="bg-charcoal/50 p-6 rounded-2xl border border-white/5 hover:border-electricTeal/30 transition-colors group">
                  <div className="text-electricTeal mb-4 group-hover:scale-110 transition-transform">{stat.icon}</div>
                  <div className="text-xs text-gray-500 uppercase tracking-widest">{stat.label}</div>
                  <div className="text-xl font-bold">{stat.val}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
