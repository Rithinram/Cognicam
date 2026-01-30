
import React from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
// Added missing 'Activity' import
import { TrendingUp, Users, AlertCircle, Car, Activity } from 'lucide-react';

const flowData = [
  { time: '08:00', value: 400 },
  { time: '09:00', value: 600 },
  { time: '10:00', value: 550 },
  { time: '11:00', value: 700 },
  { time: '12:00', value: 900 },
  { time: '13:00', value: 850 },
  { time: '14:00', value: 800 },
];

const violationData = [
  { type: 'Speeding', count: 120 },
  { type: 'Red Light', count: 80 },
  { type: 'Lane Exit', count: 45 },
  { type: 'Illegal Turn', count: 30 },
];

const crowdData = Array.from({ length: 20 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  z: Math.random() * 100,
}));

const anomalyData = [
  { frame: 0, stability: 98 },
  { frame: 20, stability: 97 },
  { frame: 40, stability: 99 },
  { frame: 60, stability: 40 }, // Spike
  { frame: 80, stability: 95 },
  { frame: 100, stability: 98 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold">Urban Intelligence Dashboard</h2>
          <p className="text-gray-500">Real-time holistic city perception metrics</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Update Pulse</div>
          <div className="text-electricTeal font-mono font-bold">12.5ms latency</div>
        </div>
      </header>

      {/* KPI Counters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Vehicles Detected', val: '28,401', icon: <Car />, color: 'text-electricTeal', trend: '+12%' },
          { label: 'Active Pedestrians', val: '14,220', icon: <Users />, color: 'text-biolumeGreen', trend: '+5%' },
          { label: 'Violation Alerts', val: '275', icon: <AlertCircle />, color: 'text-neonCrimson', trend: '-2%' },
          { label: 'Safety Index', val: '98.4%', icon: <TrendingUp />, color: 'text-amberEmber', trend: '+0.4%' },
        ].map((kpi, i) => (
          <div key={i} className="bg-charcoal p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-white/5 ${kpi.color}`}>{kpi.icon}</div>
              <span className={`text-xs font-bold px-2 py-1 rounded-md bg-white/5 ${kpi.trend.startsWith('+') ? 'text-biolumeGreen' : 'text-neonCrimson'}`}>
                {kpi.trend}
              </span>
            </div>
            <div className="text-2xl font-bold mb-1">{kpi.val}</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Traffic Flow Area Chart */}
        <div className="bg-charcoal p-8 rounded-3xl border border-white/5">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-electricTeal" /> Traffic Monitoring (Flow Trends)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={flowData}>
                <defs>
                  <linearGradient id="colorFlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E8FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00E8FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="time" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161B22', border: '1px solid #ffffff10', borderRadius: '12px' }}
                  itemStyle={{ color: '#00E8FF' }}
                />
                <Area type="monotone" dataKey="value" stroke="#00E8FF" fillOpacity={1} fill="url(#colorFlow)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Violations Bar Chart */}
        <div className="bg-charcoal p-8 rounded-3xl border border-white/5">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <AlertCircle size={20} className="text-neonCrimson" /> Violations (Categorical Infractions)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={violationData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="type" type="category" stroke="#9ca3af" fontSize={12} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{ backgroundColor: '#161B22', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
                  {violationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#FF1F8A' : '#FF1F8A80'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crowd Density Scatter */}
        <div className="bg-charcoal p-8 rounded-3xl border border-white/5">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Users size={20} className="text-biolumeGreen" /> People Crowd (Hotspot Mapping)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid stroke="#ffffff10" />
                <XAxis type="number" dataKey="x" hide />
                <YAxis type="number" dataKey="y" hide />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Hotspots" data={crowdData} fill="#00FF85" fillOpacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Anomaly Detection Line Chart */}
        <div className="bg-charcoal p-8 rounded-3xl border border-white/5">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Activity size={20} className="text-amberEmber" /> Anomaly Detection (Stability vs Spikes)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={anomalyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="frame" stroke="#4b5563" fontSize={12} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#4b5563" fontSize={12} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#161B22', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                <Line 
                  type="step" 
                  dataKey="stability" 
                  stroke="#FFB800" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#FFB800', strokeWidth: 0 }} 
                  activeDot={{ r: 8, fill: '#FF1F8A' }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
