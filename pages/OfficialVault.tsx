import React, { useState } from 'react';
import { Search, Filter, Lock, Eye, Download, Calendar, Shield, FileText, Video as VideoIcon, Image as ImageIcon, Link as LinkIcon, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface EvidenceConfig {
    id: string;
    caseId?: string;
    type: 'snapshot' | 'video';
    thumbnail: string;
    timestamp: string;
    location: string;
    tags: string[];
    status: 'secure' | 'processing' | 'archived';
}

interface CustodyLog {
    id: string;
    action: string;
    user: string;
    role: string;
    timestamp: string;
    verified: boolean;
}

const MOCK_EVIDENCE: EvidenceConfig[] = [
    {
        id: 'EVD-LIVE-001',
        caseId: 'CASE-9003',
        type: 'snapshot',
        thumbnail: '/evidence/wrong_way_driving.jpg',
        timestamp: new Date().toLocaleTimeString(), // Real-time feel
        location: 'Highway 44 - North Ramp',
        tags: ['Wrong Way', 'Traffic Violation', 'High Speed'],
        status: 'secure'
    },
    {
        id: 'EVD-LIVE-002',
        caseId: 'CASE-9002',
        type: 'video',
        thumbnail: '/evidence/crash_top_view.png',
        timestamp: new Date(Date.now() - 1000 * 60 * 12).toLocaleTimeString(),
        location: 'Central Avenue & 5th St',
        tags: ['Collision', 'Vehicle Damage', 'Accident'],
        status: 'secure'
    },
    {
        id: 'EVD-LIVE-003',
        type: 'snapshot',
        thumbnail: '/evidence/robbery_cash.png',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toLocaleTimeString(),
        location: 'SuperMart - Downtown Branch',
        tags: ['Robbery', 'Theft', 'Suspect Identified'],
        status: 'processing'
    }
];

const MOCK_CUSTODY_LOG: CustodyLog[] = [
    {
        id: 'LOG-001',
        action: 'Evidence Created',
        user: 'AI Node 42',
        role: 'System',
        timestamp: new Date().toLocaleTimeString(),
        verified: true
    },
    {
        id: 'LOG-002',
        action: 'Encrypted & Stored',
        user: 'Vault Keeper v2',
        role: 'System',
        timestamp: new Date(Date.now() + 1000 * 2).toLocaleTimeString(),
        verified: true
    },
    {
        id: 'LOG-003',
        action: 'Viewed Evidence',
        user: 'Officer R. Singh',
        role: 'Official',
        timestamp: 'Just now',
        verified: true
    }
];

const OfficialVault: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'all' | 'snapshots' | 'videos'>('all');
    const [selectedEvidence, setSelectedEvidence] = useState<EvidenceConfig | null>(null);

    const filteredEvidence = activeTab === 'all'
        ? MOCK_EVIDENCE
        : MOCK_EVIDENCE.filter(e => e.type === activeTab.slice(0, -1)); // remote 's' from tab name

    const handleExport = async () => {
        if (!selectedEvidence) return;
        const input = document.getElementById('evidence-details');
        if (!input) return;

        try {
            const canvas = await html2canvas(input, {
                backgroundColor: '#0D1117', // Match obsidian theme
                scale: 2
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`evidence_${selectedEvidence.id}.pdf`);
        } catch (err) {
            console.error('Export failed:', err);
        }
    };

    return (
        <div className="space-y-8 pb-12">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black tracking-tight uppercase italic text-white">Evidence <span className="text-biolumeGreen">Vault</span></h2>
                    <p className="text-gray-500 font-medium mt-1 flex items-center gap-2 uppercase tracking-widest text-xs">
                        <Shield size={14} className="text-biolumeGreen" /> Digital Evidence Management System
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-charcoal px-4 py-2 rounded-xl border border-white/5 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-biolumeGreen animate-pulse" />
                        <span className="text-[10px] font-black uppercase text-gray-400">Secure Connection</span>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-12 gap-8">
                {/* Main Vault Grid */}
                <div className="col-span-8 space-y-6">
                    {/* Controls */}
                    <div className="flex items-center justify-between gap-4 bg-charcoal p-2 rounded-2xl border border-white/5">
                        <div className="flex bg-obsidian/50 rounded-xl p-1">
                            {['all', 'snapshots', 'videos'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab as any)}
                                    className={`px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab
                                        ? 'bg-biolumeGreen text-obsidian shadow-lg'
                                        : 'text-gray-500 hover:text-white'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2 px-4 border-l border-white/5">
                            <Filter size={16} className="text-gray-500" />
                            <span className="text-[10px] font-black uppercase text-gray-500">Filter</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {filteredEvidence.map((evidence) => (
                            <button
                                key={evidence.id}
                                onClick={() => setSelectedEvidence(evidence)}
                                className={`group relative aspect-video rounded-3xl overflow-hidden border-2 transition-all text-left ${selectedEvidence?.id === evidence.id
                                    ? 'border-biolumeGreen shadow-[0_0_30px_rgba(0,255,133,0.2)]'
                                    : 'border-transparent hover:border-white/20'
                                    }`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                                <img
                                    src={evidence.thumbnail}
                                    alt="Evidence Thumbnail"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                <div className="absolute top-4 left-4 z-20 flex gap-2">
                                    <div className={`px-2 py-1 rounded bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-wider text-white flex items-center gap-1`}>
                                        {evidence.type === 'video' ? <VideoIcon size={10} /> : <ImageIcon size={10} />}
                                        {evidence.type}
                                    </div>
                                    {evidence.caseId && (
                                        <div className="px-2 py-1 rounded bg-biolumeGreen text-obsidian text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                            <LinkIcon size={10} /> {evidence.caseId}
                                        </div>
                                    )}
                                </div>

                                <div className="absolute bottom-4 left-4 right-4 z-20">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h4 className="text-white font-bold text-lg leading-none mb-1">{evidence.location}</h4>
                                            <div className="flex items-center gap-2 text-gray-400 text-[10px] font-mono uppercase">
                                                <Clock size={10} /> {evidence.timestamp}
                                            </div>
                                        </div>
                                        {evidence.status === 'secure' && (
                                            <Lock size={16} className="text-biolumeGreen" />
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sidebar Details */}
                <div className="col-span-4 space-y-6">
                    {selectedEvidence ? (
                        <div id="evidence-details" className="bg-charcoal rounded-[2.5rem] border border-white/5 p-6 min-h-[600px] flex flex-col animate-in slide-in-from-right-4">
                            <div className="mb-6 pb-6 border-b border-white/5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{selectedEvidence.id}</div>
                                    <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${selectedEvidence.status === 'secure' ? 'bg-biolumeGreen/10 text-biolumeGreen' : 'bg-yellow-500/10 text-yellow-500'
                                        }`}>
                                        {selectedEvidence.status}
                                    </div>
                                </div>
                                <div className="mb-4 rounded-xl overflow-hidden aspect-video border border-white/10">
                                    <img src={selectedEvidence.thumbnail} className="w-full h-full object-cover" alt="Evidence" />
                                </div>
                                <h3 className="text-2xl font-black text-white italic uppercase">{selectedEvidence.location}</h3>
                                <div className="flex gap-2 mt-3 flex-wrap">
                                    {selectedEvidence.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-gray-300 font-bold uppercase tracking-wide">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Chain of Custody */}
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-4">
                                    <Shield size={16} className="text-biolumeGreen" />
                                    <h4 className="text-xs font-black uppercase tracking-widest text-white">Chain of Custody</h4>
                                </div>

                                <div className="space-y-6 pl-2 relative">
                                    <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-white/10" />
                                    {MOCK_CUSTODY_LOG.map((log) => (
                                        <div key={log.id} className="relative pl-6">
                                            <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-charcoal border-2 border-biolumeGreen z-10" />
                                            <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5 hover:bg-white/[0.05] transition-colors">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="text-[11px] font-bold text-white">{log.action}</span>
                                                    {log.verified && <CheckCircle size={12} className="text-biolumeGreen" />}
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <div>
                                                        <div className="text-[10px] text-gray-500 uppercase font-black">{log.user}</div>
                                                        <div className="text-[9px] text-gray-600 font-mono">{log.role}</div>
                                                    </div>
                                                    <div className="text-[9px] text-gray-600 font-mono">{log.timestamp.split(' ')[1] || log.timestamp}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 gap-3" data-html2canvas-ignore>
                                <button className="py-3 rounded-xl bg-white/5 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                                    <Eye size={14} /> View Full
                                </button>
                                <button
                                    onClick={handleExport}
                                    className="py-3 rounded-xl bg-biolumeGreen text-obsidian text-xs font-black uppercase tracking-widest hover:bg-biolumeGreen/90 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Download size={14} /> Export PDF
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-charcoal/30 rounded-[2.5rem] border border-white/5 border-dashed h-full flex flex-col items-center justify-center p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                <FileText size={24} className="text-gray-600" />
                            </div>
                            <h3 className="text-gray-500 font-black uppercase tracking-widest text-xs">Select evidence to view details</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OfficialVault;
