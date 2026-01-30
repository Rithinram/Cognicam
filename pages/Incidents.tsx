
import React from 'react';
import { ResolvedIncident } from '../App';
import { Search, Download, ExternalLink, User, Clock, Eye, CheckCircle, AlertTriangle } from 'lucide-react';

// Static incidents data
const STATIC_INCIDENTS = [
  { id: 'INC-782', type: 'Red Light Violation', timestamp: '2023-11-20 14:23:01', severity: 'Warning', status: 'Dispatched', officer: 'Sgt. Baker', duration: '0:15s', location: 'CAM-001 - Intersection A', image: 'https://picsum.photos/id/10/200/120' },
  { id: 'INC-783', type: 'Possible Collision', timestamp: '2023-11-20 14:45:12', severity: 'Danger', status: 'Open', officer: 'None', duration: '1:02s', location: 'CAM-002 - Expressway', image: 'https://picsum.photos/id/11/200/120' },
  { id: 'INC-784', type: 'Illegal Parking', timestamp: '2023-11-20 15:10:05', severity: 'Safe', status: 'Resolved', officer: 'Unit-42', duration: '5:00s', location: 'CAM-003 - Main Street', image: 'https://picsum.photos/id/12/200/120' },
  { id: 'INC-785', type: 'Crowd Gathering', timestamp: '2023-11-20 15:30:44', severity: 'Warning', status: 'Dispatched', officer: 'Cpl. Lee', duration: '3:20s', location: 'CAM-001 - Hub Area', image: 'https://picsum.photos/id/13/200/120' },
  { id: 'INC-786', type: 'Speeding Violation', timestamp: '2023-11-20 16:02:19', severity: 'Warning', status: 'Open', officer: 'None', duration: '0:08s', location: 'CAM-002 - North Gate', image: 'https://picsum.photos/id/14/200/120' },
];

interface IncidentsProps {
  resolvedIncidents: ResolvedIncident[];
}

const Incidents: React.FC<IncidentsProps> = ({ resolvedIncidents }) => {
  // Convert resolved incidents to table format
  const resolvedRows = resolvedIncidents.map(inc => ({
    id: inc.id,
    type: inc.type,
    timestamp: `Today ${inc.resolvedAt}`,
    severity: inc.intensity === 'CRITICAL' ? 'Danger' : inc.intensity === 'HIGH' ? 'Warning' : 'Safe',
    status: 'Resolved',
    officer: inc.resolvedBy,
    duration: inc.duration,
    location: inc.zone,
    image: `https://picsum.photos/id/${Math.floor(Math.random() * 20 + 20)}/200/120`,
    isNew: true,
  }));

  // Combine resolved incidents (new ones first) with static incidents
  const allIncidents = [...resolvedRows, ...STATIC_INCIDENTS];

  const criticalCount = allIncidents.filter(i => i.severity === 'Danger').length;
  const pendingCount = allIncidents.filter(i => i.status === 'Open' || i.status === 'Dispatched').length;

  return (
    <div className="space-y-8">
      <header className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold">Incidents Command Center</h2>
          <div className="flex gap-4 mt-2">
            <span className="flex items-center gap-1 text-xs text-neonCrimson font-bold bg-neonCrimson/10 px-2 py-1 rounded">{criticalCount} CRITICAL</span>
            <span className="flex items-center gap-1 text-xs text-amberEmber font-bold bg-amberEmber/10 px-2 py-1 rounded">{pendingCount} PENDING</span>
            {resolvedIncidents.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-biolumeGreen font-bold bg-biolumeGreen/10 px-2 py-1 rounded">
                <CheckCircle size={12} /> {resolvedIncidents.length} RESOLVED TODAY
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="relative flex-1 lg:flex-initial">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input type="text" placeholder="Filter by ID, Officer..." className="pl-12 pr-4 py-3 bg-charcoal border border-white/5 rounded-xl outline-none focus:border-electricTeal w-full lg:w-64" />
          </div>
          <button className="px-6 py-3 bg-electricTeal text-obsidian font-bold rounded-xl flex items-center gap-2 hover:scale-105 transition-all"><Download size={18} /> Export Intel</button>
        </div>
      </header>

      <div className="bg-charcoal rounded-3xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-obsidian/50 border-b border-white/5">
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Node ID</th>
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Triage Type</th>
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Status</th>
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Assigned</th>
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Severity</th>
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Evidence Preview</th>
                <th className="px-6 py-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Intel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {allIncidents.map((inc) => (
                <tr
                  key={inc.id}
                  className={`hover:bg-white/5 transition-colors group ${(inc as any).isNew ? 'bg-biolumeGreen/5' : ''}`}
                >
                  <td className="px-6 py-6 font-mono text-sm">
                    <div className="flex items-center gap-2">
                      {(inc as any).isNew && (
                        <span className="w-2 h-2 bg-biolumeGreen rounded-full animate-pulse" />
                      )}
                      {inc.id}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="font-bold text-sm mb-1">{inc.type}</div>
                    <div className="text-[10px] text-gray-500 flex items-center gap-1"><Clock size={10} /> {inc.timestamp}</div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${inc.status === 'Resolved' ? 'bg-biolumeGreen/10 text-biolumeGreen' :
                        inc.status === 'Dispatched' ? 'bg-electricTeal/10 text-electricTeal' : 'bg-white/5 text-gray-400'
                      }`}>
                      {inc.status}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <User size={12} /> {inc.officer}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className={`w-3 h-3 rounded-full ${inc.severity === 'Danger' ? 'bg-neonCrimson shadow-[0_0_10px_#FF1F8A]' : inc.severity === 'Warning' ? 'bg-amberEmber' : 'bg-biolumeGreen'}`} />
                  </td>
                  <td className="px-6 py-6">
                    <div className="relative group/img overflow-hidden rounded-lg border border-white/10 w-24 h-12">
                      <img src={inc.image} className="w-full h-full object-cover transition-transform group-hover/img:scale-125" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"><Eye size={16} /></div>
                    </div>
                  </td>
                  <td className="px-6 py-6"><button className="p-2 bg-white/5 rounded-lg hover:bg-electricTeal hover:text-obsidian transition-colors"><ExternalLink size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Incidents;
