
import React from 'react';
import { Settings, Cpu, Shield, Globe, Bell, Database, Save } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-3xl font-bold">System Settings</h2>
          <p className="text-gray-500">Global configuration for AI models and agency protocols</p>
        </div>
        <button className="flex items-center gap-2 px-8 py-3 bg-electricTeal text-obsidian font-bold rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,232,255,0.3)]">
          <Save size={20} /> Deploy Changes
        </button>
      </div>

      <div className="space-y-8">
        {/* AI Model Config */}
        <section className="bg-charcoal p-8 rounded-3xl border border-white/5">
           <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-electricTeal"><Cpu size={24} /> AI Perception Engine</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                 <label className="text-xs uppercase font-bold text-gray-500 tracking-widest">Confidence Threshold (0.1 - 1.0)</label>
                 <input type="range" className="w-full accent-electricTeal h-1.5 bg-obsidian rounded-lg appearance-none cursor-pointer" />
                 <div className="flex justify-between text-[10px] font-mono text-gray-500"><span>AGGRESSIVE (0.2)</span><span>STRICT (0.85)</span></div>
              </div>
              <div className="space-y-2">
                 <label className="text-xs uppercase font-bold text-gray-500 tracking-widest">Inference Device</label>
                 <select className="w-full bg-obsidian border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-electricTeal text-sm font-bold">
                    <option>GPU: NVIDIA RTX 4090 v1</option>
                    <option>NPU: Edge Core A-Series</option>
                 </select>
              </div>
           </div>
        </section>

        {/* Agency Protocols */}
        <section className="bg-charcoal p-8 rounded-3xl border border-white/5">
           <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-neonCrimson"><Shield size={24} /> Security Protocols</h3>
           <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-obsidian/50 rounded-2xl border border-white/5">
                 <div>
                    <div className="font-bold">Automated Dispatch</div>
                    <div className="text-xs text-gray-500">Trigger police response autonomously for Critical events</div>
                 </div>
                 <div className="w-12 h-6 bg-electricTeal rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                 </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-obsidian/50 rounded-2xl border border-white/5">
                 <div>
                    <div className="font-bold">Biometric Masking</div>
                    <div className="text-xs text-gray-500">Apply real-time PII anonymization to public feeds</div>
                 </div>
                 <div className="w-12 h-6 bg-white/10 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-gray-500 rounded-full" />
                 </div>
              </div>
           </div>
        </section>

        {/* Global Connection */}
        <section className="bg-charcoal p-8 rounded-3xl border border-white/5">
           <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-biolumeGreen"><Globe size={24} /> Infrastructure Link</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                 <label className="text-xs uppercase font-bold text-gray-500 tracking-widest">Mainframe Endpoint</label>
                 <input type="text" placeholder="https://api.city-logic.gov/v1" className="w-full bg-obsidian border border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:border-electricTeal outline-none" />
              </div>
              <div className="space-y-2">
                 <label className="text-xs uppercase font-bold text-gray-500 tracking-widest">Encryption Key ID</label>
                 <input type="password" value="XXXXXXXXXXXXXXX" readOnly className="w-full bg-obsidian border border-white/10 rounded-xl px-4 py-3 text-sm font-mono" />
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
