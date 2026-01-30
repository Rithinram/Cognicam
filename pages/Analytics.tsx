
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Cell } from 'recharts';
import { FileDown, ShieldCheck, Download, Users, AlertTriangle, TrendingUp, Clock, Zap } from 'lucide-react';

const complianceData = [
  { name: 'Mon', people: 4000, accidents: 2, violations: 24, noise: 42 },
  { name: 'Tue', people: 3000, accidents: 0, violations: 13, noise: 38 },
  { name: 'Wed', people: 2000, accidents: 5, violations: 98, noise: 65 },
  { name: 'Thu', people: 2780, accidents: 1, violations: 39, noise: 50 },
  { name: 'Fri', people: 1890, accidents: 0, violations: 48, noise: 44 },
  { name: 'Sat', people: 2390, accidents: 3, violations: 38, noise: 55 },
  { name: 'Sun', people: 3490, accidents: 0, violations: 43, noise: 40 },
];

const Analytics: React.FC = () => {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Legislative & Macro Analytics</h2>
          <p className="text-gray-500">City health index and automated compliance reporting</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-electricTeal text-obsidian font-bold rounded-xl hover:scale-105 transition-all">
          <FileDown size={20} /> Generate Global Audit
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-charcoal p-8 rounded-3xl border border-white/5 text-center">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">City Safety Score</h3>
            <div className="text-6xl font-extrabold text-biolumeGreen mb-2">94.2</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Grade: OPTIMAL</div>
            <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 uppercase">Detection Accuracy</span>
                <span className="text-white font-bold">99.1%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500 uppercase">False Positives</span>
                <span className="text-neonCrimson font-bold">0.4%</span>
              </div>
            </div>
          </div>
          <div className="bg-charcoal p-6 rounded-3xl border border-white/5">
             <h4 className="text-xs font-bold uppercase mb-4 flex items-center gap-2"><Clock size={14} className="text-electricTeal" /> Peak Density Hours</h4>
             <div className="h-4 bg-obsidian rounded-full overflow-hidden flex">
                <div className="h-full bg-white/10 w-1/4" />
                <div className="h-full bg-amberEmber w-1/4" />
                <div className="h-full bg-neonCrimson w-1/4 shadow-[0_0_10px_#FF1F8A]" />
                <div className="h-full bg-white/10 w-1/4" />
             </div>
             <div className="flex justify-between mt-2 text-[10px] text-gray-500 font-bold">
                <span>00:00</span><span>08:00</span><span>16:00</span><span>23:59</span>
             </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div className="bg-charcoal p-8 rounded-3xl border border-white/5">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-lg font-bold">Temporal City Flux (People vs Violations)</h3>
               <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-1 text-electricTeal"> <div className="w-2 h-2 rounded-full bg-electricTeal" /> Density </div>
                  <div className="flex items-center gap-1 text-neonCrimson"> <div className="w-2 h-2 rounded-full bg-neonCrimson" /> Violations </div>
               </div>
            </div>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={complianceData}>
                  <defs>
                    <linearGradient id="colorP" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00E8FF" stopOpacity={0.3}/><stop offset="95%" stopColor="#00E8FF" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="name" stroke="#4b5563" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#4b5563" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#161B22', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="people" stroke="#00E8FF" fillOpacity={1} fill="url(#colorP)" strokeWidth={3} />
                  <Area type="monotone" dataKey="violations" stroke="#FF1F8A" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="p-6 bg-charcoal rounded-2xl border border-white/5 flex items-center gap-4">
               <div className="p-4 rounded-xl bg-white/5 text-amberEmber"><Zap /></div>
               <div><div className="text-xl font-bold">12.2kW</div><div className="text-[10px] text-gray-500 uppercase font-bold">City Energy Flux</div></div>
            </div>
            <div className="p-6 bg-charcoal rounded-2xl border border-white/5 flex items-center gap-4">
               <div className="p-4 rounded-xl bg-white/5 text-electricTeal"><Users /></div>
               <div><div className="text-xl font-bold">4.2m</div><div className="text-[10px] text-gray-500 uppercase font-bold">Total Interactions</div></div>
            </div>
            <div className="p-6 bg-charcoal rounded-2xl border border-white/5 flex items-center gap-4">
               <div className="p-4 rounded-xl bg-white/5 text-biolumeGreen"><TrendingUp /></div>
               <div><div className="text-xl font-bold">+12%</div><div className="text-[10px] text-gray-500 uppercase font-bold">Efficiency Growth</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
