import React, { useState } from 'react';
import { Lock, ShieldCheck, CheckCircle, FileText, Download, Fingerprint, Eye, AlertTriangle, Database, Globe, X } from 'lucide-react';

const ASSETS = [
    {
        id: 'AUTH-9921',
        file: 'CAM_01_Violation_Clip.mp4',
        hash: '8f2b3e1c9d4a5f6e7b8c9d0a1b2c3d4e',
        timestamp: '2023-11-20 12:44:00',
        notary: 'Blockchain Ver. #4412',
        claimStatus: 'Verified',
        videoUrl: '/videos/When_My_City_s_Traffic_Lights_Turn_Off_ViralHog_1080p.mp4',
        incidentDetails: {
            type: 'Red Light Violation',
            location: 'MG Road Junction, Sector 4',
            date: '2023-11-20',
            time: '12:44:00',
            vehicles: [
                { plate: 'KA-01-AB-1234', make: 'Maruti Swift', color: 'White', owner: 'Rajesh Kumar' },
            ],
            confidence: '98.2%'
        }
    },
    {
        id: 'AUTH-9922',
        file: 'Hub_Entrance_Collision.mp4',
        hash: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p',
        timestamp: '2023-11-20 13:12:05',
        notary: 'Blockchain Ver. #4413',
        claimStatus: 'Pending',
        videoUrl: '/videos/accident_CCTV_camera_capture_solapur_480p.mp4',
        incidentDetails: {
            type: 'Minor Collision',
            location: 'Central Hub Entrance, Gate B',
            date: '2023-11-20',
            time: '13:12:05',
            vehicles: [
                { plate: 'KA-05-CD-5678', make: 'Honda City', color: 'Silver', owner: 'Priya Sharma' },
                { plate: 'KA-09-EF-9012', make: 'Hyundai i20', color: 'Red', owner: 'Amit Patel' },
            ],
            confidence: '94.5%'
        }
    },
    {
        id: 'AUTH-9923',
        file: 'Night_Patrol_Incident.mp4',
        hash: 'q1w2e3r4t5y6u7i8o9p0a1s2d3f4g5h6',
        timestamp: '2023-11-21 02:00:12',
        notary: 'Local Notary Node-A',
        claimStatus: 'Verified',
        videoUrl: '/videos/Sakri_Dengarours_Road_Accident_Live_CCTV_Footage_360P.mp4',
        incidentDetails: {
            type: 'Speeding Violation',
            location: 'Outer Ring Road, Km 45',
            date: '2023-11-21',
            time: '02:00:12',
            vehicles: [
                { plate: 'KA-03-GH-3456', make: 'BMW 3 Series', color: 'Black', owner: 'Vikram Singh' },
            ],
            confidence: '96.8%'
        }
    },
    {
        id: 'AUTH-9924',
        file: 'Highway_Collision_Evidence.mp4',
        hash: 'z9x8c7v6b5n4m3l2k1j0h9g8f7d6s5a4',
        timestamp: '2023-11-21 08:30:45',
        notary: 'Blockchain Ver. #4414',
        claimStatus: 'Verified',
        videoUrl: '/videos/The_Shocking_Reality_Behind_Unimaginable_Car_Accidents_Exposed_shorts_caraccident_720p.mp4',
        incidentDetails: {
            type: 'Major Collision',
            location: 'National Highway 44, Exit 23',
            date: '2023-11-21',
            time: '08:30:45',
            vehicles: [
                { plate: 'KA-02-JK-7890', make: 'Tata Nexon', color: 'Blue', owner: 'Suresh Reddy' },
                { plate: 'TN-01-LM-4567', make: 'Ford Ecosport', color: 'Grey', owner: 'Kavitha Nair' },
                { plate: 'KA-04-NO-8901', make: 'Mahindra XUV500', color: 'White', owner: 'Mohammed Ali' },
            ],
            confidence: '99.1%'
        }
    },
];

const generatePDFContent = (asset: typeof ASSETS[0]) => {
    const details = asset.incidentDetails;
    const vehicleList = details.vehicles.map((v, i) =>
        `Vehicle ${i + 1}: ${v.plate} | ${v.make} | ${v.color} | Owner: ${v.owner}`
    ).join('\n');

    return `INCIDENT EVIDENCE REPORT
========================
Document ID: ${asset.id}
Generated: ${new Date().toLocaleString()}
Status: ${asset.claimStatus}

INCIDENT DETAILS
----------------
Type: ${details.type}
Location: ${details.location}
Date: ${details.date}
Time: ${details.time}
Confidence: ${details.confidence}

VEHICLES INVOLVED
-----------------
${vehicleList}

VERIFICATION
------------
File: ${asset.file}
Hash: ${asset.hash}
Notary: ${asset.notary}
`;
};

const Vault: React.FC = () => {
    const [selectedAsset, setSelectedAsset] = useState<typeof ASSETS[0] | null>(null);

    const handleView = (asset: typeof ASSETS[0]) => setSelectedAsset(asset);
    const handleDownload = (asset: typeof ASSETS[0]) => {
        const pdfContent = generatePDFContent(asset);
        const blob = new Blob([pdfContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${asset.id}_Report.txt`;
        link.click();
        URL.revokeObjectURL(url);
    };
    const closeModal = () => setSelectedAsset(null);

    return (
        <div className="space-y-8 pb-12">
            {selectedAsset && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-obsidian/90 backdrop-blur-md p-6" onClick={closeModal}>
                    <div className="w-full max-w-4xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
                        <div className="bg-charcoal rounded-2xl border-2 border-electricTeal shadow-[0_0_60px_rgba(0,232,255,0.4)] overflow-hidden">
                            <div className="px-5 py-3 border-b border-white/10 flex justify-between items-center bg-obsidian/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-electricTeal/20 rounded-lg flex items-center justify-center">
                                        <FileText size={16} className="text-electricTeal" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm text-white">{selectedAsset.file}</h3>
                                        <p className="text-[9px] text-gray-500">{selectedAsset.id} • {selectedAsset.timestamp}</p>
                                    </div>
                                </div>
                                <button onClick={closeModal} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="bg-black">
                                <video src={selectedAsset.videoUrl} className="w-full h-[45vh] object-contain" controls />
                            </div>

                            <div className="bg-obsidian/40 p-4">
                                <div className="flex gap-6 items-center">
                                    <div className="flex-1">
                                        <h4 className="text-[9px] font-bold uppercase tracking-widest text-electricTeal mb-2">Incident Details</h4>
                                        <div className="grid grid-cols-4 gap-3 text-[11px]">
                                            <div>
                                                <div className="text-gray-500 text-[9px]">Type</div>
                                                <div className="font-bold">{selectedAsset.incidentDetails.type}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500 text-[9px]">Confidence</div>
                                                <div className="font-bold text-biolumeGreen">{selectedAsset.incidentDetails.confidence}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500 text-[9px]">Date</div>
                                                <div className="font-bold">{selectedAsset.incidentDetails.date}</div>
                                            </div>
                                            <div>
                                                <div className="text-gray-500 text-[9px]">Time</div>
                                                <div className="font-bold">{selectedAsset.incidentDetails.time}</div>
                                            </div>
                                        </div>
                                        <div className="mt-2">
                                            <div className="text-gray-500 text-[9px]">Location</div>
                                            <div className="font-bold text-[11px]">{selectedAsset.incidentDetails.location}</div>
                                        </div>
                                    </div>

                                    <div className="w-64">
                                        <h4 className="text-[9px] font-bold uppercase tracking-widest text-amberEmber mb-2">Vehicles ({selectedAsset.incidentDetails.vehicles.length})</h4>
                                        <div className="flex gap-2 flex-wrap">
                                            {selectedAsset.incidentDetails.vehicles.map((v, i) => (
                                                <div key={i} className="bg-obsidian/60 rounded-lg px-3 py-1.5 border border-white/5 text-[10px]">
                                                    <div className="font-mono font-bold text-electricTeal">{v.plate}</div>
                                                    <div className="text-gray-400">{v.make}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <button onClick={() => handleDownload(selectedAsset)} className="px-5 py-2.5 bg-electricTeal text-obsidian font-bold rounded-xl hover:scale-105 transition-all flex items-center gap-2 text-sm shrink-0">
                                        <Download size={16} /> Download
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <header className="text-center">
                <div className="w-20 h-20 bg-electricTeal/10 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-electricTeal shadow-[0_0_30px_rgba(0,232,255,0.3)]">
                    <Fingerprint className="text-electricTeal" size={32} />
                </div>
                <h2 className="text-4xl font-extrabold mb-4">Evidence Vault</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">Digital chain of custody powered by multi-node distributed ledger technology.</p>
                <div className="flex justify-center gap-4 mt-8">
                    <div className="bg-charcoal px-4 py-2 rounded-xl border border-white/5 flex items-center gap-3 text-xs font-bold">
                        <Database size={16} className="text-electricTeal" /> Ledger: ACTIVE
                    </div>
                    <div className="bg-charcoal px-4 py-2 rounded-xl border border-white/5 flex items-center gap-3 text-xs font-bold">
                        <Globe size={16} className="text-biolumeGreen" /> SYNC: GLOBAL
                    </div>
                    <div className="bg-charcoal px-4 py-2 rounded-xl border border-white/5 flex items-center gap-3 text-xs font-bold">
                        <ShieldCheck size={16} className="text-amberEmber" /> INTEGRITY: 100%
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-4 gap-4">
                <div className="bg-charcoal rounded-2xl border border-white/5 p-6 text-center">
                    <div className="text-3xl font-black text-electricTeal mb-1">{ASSETS.length}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Total Records</div>
                </div>
                <div className="bg-charcoal rounded-2xl border border-white/5 p-6 text-center">
                    <div className="text-3xl font-black text-biolumeGreen mb-1">{ASSETS.filter(a => a.claimStatus === 'Verified').length}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Verified</div>
                </div>
                <div className="bg-charcoal rounded-2xl border border-white/5 p-6 text-center">
                    <div className="text-3xl font-black text-amberEmber mb-1">{ASSETS.filter(a => a.claimStatus === 'Pending').length}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Pending</div>
                </div>
                <div className="bg-charcoal rounded-2xl border border-white/5 p-6 text-center">
                    <div className="text-3xl font-black text-white mb-1">256</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Bit Encryption</div>
                </div>
            </div>

            <div className="bg-charcoal rounded-3xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-obsidian/30 flex justify-between items-center">
                    <h3 className="font-bold text-lg flex items-center gap-2"><Lock className="text-biolumeGreen" size={20} /> Vault Inventory</h3>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{ASSETS.length} Active Records</div>
                </div>

                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-obsidian/50 border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                    <div className="col-span-4">Asset Details</div>
                    <div className="col-span-4">Hash & Notary</div>
                    <div className="col-span-2 text-center">Status</div>
                    <div className="col-span-2 text-right">Actions</div>
                </div>

                <div className="divide-y divide-white/5">
                    {ASSETS.map((asset) => (
                        <div key={asset.id} className="grid grid-cols-12 gap-4 px-6 py-5 hover:bg-white/5 transition-colors items-center group">
                            <div className="col-span-4 flex items-center gap-4">
                                <div className="w-12 h-12 bg-obsidian rounded-xl flex items-center justify-center border border-white/10 group-hover:border-electricTeal transition-colors shrink-0">
                                    <FileText className="text-gray-500 group-hover:text-electricTeal" size={20} />
                                </div>
                                <div className="min-w-0">
                                    <h4 className="font-bold text-sm mb-1 truncate">{asset.file}</h4>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500">
                                        <span className="text-electricTeal">{asset.id}</span>
                                        <span>•</span>
                                        <span>{asset.timestamp}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-4">
                                <div className="bg-obsidian/50 p-3 rounded-xl border border-white/5 font-mono text-[10px]">
                                    <div className="text-electricTeal mb-1 truncate">NOTARY: {asset.notary}</div>
                                    <div className="text-gray-600 truncate">HASH: {asset.hash}</div>
                                </div>
                            </div>

                            <div className="col-span-2 flex justify-center">
                                <div className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5 ${asset.claimStatus === 'Verified' ? 'bg-biolumeGreen/10 text-biolumeGreen' : 'bg-amberEmber/10 text-amberEmber'}`}>
                                    {asset.claimStatus === 'Verified' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                                    {asset.claimStatus}
                                </div>
                            </div>

                            <div className="col-span-2 flex justify-end gap-2">
                                <button onClick={() => handleView(asset)} className="p-2.5 bg-white/5 hover:bg-electricTeal/20 rounded-xl transition-all" title="Preview">
                                    <Eye size={16} className="text-gray-400" />
                                </button>
                                <button onClick={() => handleDownload(asset)} className="p-2.5 bg-electricTeal text-obsidian rounded-xl hover:scale-105 transition-all" title="Download">
                                    <Download size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Vault;
