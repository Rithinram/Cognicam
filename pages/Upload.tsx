
import React, { useState, useEffect } from 'react';
import {
  Upload as UploadIcon, ChevronRight, CheckCircle, AlertCircle, X,
  TrafficCone, Users, Eye, Zap, Cpu, History, FileVideo,
  Timer, BarChart3, Database, Shield, Activity, Fingerprint
} from 'lucide-react';

const ANALYSIS_STEPS = [
  {
    title: 'Traffic Monitoring',
    icon: <TrafficCone className="text-electricTeal" />,
    content: 'Scanning flow density. Current count: 42 vehicles/min. Flow state: Nominal.',
    meta: {
      fps: '24.2',
      model: 'YOLOv11x-TensorRT',
      confidence: '0.94',
      objects: ['Sedan', 'SUV', 'Truck', 'Motorcycle'],
      stats: { total: 1240, peak: '82/min', resolution: '4K', duration: '12:45', vram: '4.2GB', audit: 'AUD-9912' }
    },
    color: 'border-electricTeal',
    glow: 'shadow-[0_0_40px_rgba(0,232,255,0.5),0_0_80px_rgba(0,232,255,0.3)]'
  },
  {
    title: 'Violation Detection',
    icon: <AlertCircle className="text-red-500" />,
    content: 'Checking red-light patterns. Detected 2 stop-line crossings in CAM-001.',
    meta: {
      fps: '18.5',
      model: 'TrafficNet-v4',
      confidence: '0.98',
      objects: ['License Plate', 'Signal State', 'Collision Path'],
      stats: { total: 12, peak: '3/hour', resolution: '1080p', duration: '05:20', vram: '2.8GB', audit: 'AUD-9913' }
    },
    color: 'border-red-500',
    glow: 'shadow-[0_0_40px_rgba(239,68,68,0.5),0_0_80px_rgba(239,68,68,0.3)]'
  },
  {
    title: 'Public Crowd',
    icon: <Users className="text-biolumeGreen" />,
    content: 'Loitering analysis: 3 people stationary for >120s near Hub A entrance.',
    meta: {
      fps: '30.0',
      model: 'HumanPose-AI-v2',
      confidence: '0.82',
      objects: ['Pedestrian', 'Stationary Group', 'Posture'],
      stats: { total: 450, peak: '120 persons', resolution: '2K', duration: '22:10', vram: '3.1GB', audit: 'AUD-9914' }
    },
    color: 'border-biolumeGreen',
    glow: 'shadow-[0_0_40px_rgba(34,197,94,0.5),0_0_80px_rgba(34,197,94,0.3)]'
  },
  {
    title: 'Anomaly Detection',
    icon: <Zap className="text-amberEmber" />,
    content: 'Sudden velocity change detected at frame 1202. Likely heavy braking event.',
    meta: {
      fps: '22.1',
      model: 'Kinetic-Flow-3D',
      confidence: '0.91',
      objects: ['Velocity Vector', 'Sudden Stop', 'Collision Frame'],
      stats: { total: 4, peak: 'N/A', resolution: '4K', duration: '02:00', vram: '5.4GB', audit: 'AUD-9915' }
    },
    color: 'border-amberEmber',
    glow: 'shadow-[0_0_40px_rgba(245,158,11,0.5),0_0_80px_rgba(245,158,11,0.3)]'
  }
];

const Upload: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setProgress(0);
    setLogs(["Initializing Neural Engine...", "Loading TensorRT Weights...", "Stream Buffering..."]);
  };

  useEffect(() => {
    if (isAnalyzing && progress < 100) {
      const timer = setTimeout(() => {
        setProgress(prev => prev + 2);
        if (progress % 10 === 0) {
          setLogs(prev => [`Frame ${progress * 15}: Detected Object - ${ANALYSIS_STEPS[Math.floor(Math.random() * 4)].title}`, ...prev].slice(0, 5));
        }
      }, 50);
      return () => clearTimeout(timer);
    } else if (isAnalyzing && progress >= 100) {
      setIsAnalyzing(false);
      setShowModal(true);
    }
  }, [isAnalyzing, progress]);

  return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Municipal Video Ingestion</h2>
          <p className="text-gray-500 text-sm mt-1">Deep neural inspection for archived municipal records</p>
        </div>
        <div className="bg-charcoal px-4 py-2 rounded-xl border border-white/5 flex items-center gap-2">
          <Cpu size={16} className="text-electricTeal" />
          <span className="text-xs font-mono font-bold">RTX 4090 v2 • 88% LOAD</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-charcoal p-10 rounded-[2.5rem] border border-white/5 shadow-xl">
            <div className="border-2 border-dashed border-white/10 rounded-3xl p-12 text-center hover:border-electricTeal/40 transition-colors cursor-pointer group bg-obsidian/20" onClick={openFilePicker}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".mp4,.mkv,.ts,.avi,.mov"
                className="hidden"
              />
              <UploadIcon className="mx-auto text-gray-500 group-hover:text-electricTeal mb-6" size={56} />
              <h4 className="text-xl font-bold mb-2">{selectedFile ? selectedFile.name : 'Upload Surveillance Master Feed'}</h4>
              <p className="text-sm text-gray-500 mb-8">{selectedFile ? `File size: ${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : 'Supports RAW .mp4, .mkv, .ts (Government Encrypted)'}</p>
              <button className="px-10 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-black uppercase tracking-widest border border-white/10 transition-all">Select System Source</button>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-10">
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-gray-500 font-black tracking-widest">Metadata Origin</label>
                <select className="w-full bg-obsidian border border-white/10 rounded-xl px-4 py-4 text-sm font-bold focus:border-electricTeal outline-none transition-all">
                  <option>CAM-001 (Downtown - Intersection A)</option>
                  <option>CAM-002 (Expressway Zone B)</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={startAnalysis}
                  disabled={isAnalyzing}
                  className="w-full h-[58px] bg-electricTeal text-obsidian font-black uppercase tracking-widest rounded-xl shadow-[0_0_30px_rgba(0,232,255,0.3)] disabled:opacity-50 transition-all hover:scale-[1.02]"
                >
                  {isAnalyzing ? 'Processing Buffers...' : 'Initiate Intel Probe'}
                </button>
              </div>
            </div>
          </div>

          {isAnalyzing && (
            <div className="bg-charcoal p-8 rounded-[2rem] border border-electricTeal/20 shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black text-electricTeal uppercase tracking-widest flex items-center gap-2">
                  <Activity className="animate-pulse" size={14} /> Neural Inference Stream
                </span>
                <span className="text-sm font-mono font-bold text-white">{progress}% Complete</span>
              </div>
              <div className="w-full h-2.5 bg-obsidian rounded-full overflow-hidden mb-8 border border-white/5">
                <div className="h-full bg-electricTeal transition-all duration-300 shadow-[0_0_15px_#00E8FF]" style={{ width: `${progress}%` }} />
              </div>
              <div className="space-y-2 font-mono text-[10px] bg-obsidian/60 p-5 rounded-2xl border border-white/5">
                {logs.map((log, i) => <div key={i} className="flex gap-4 items-center">
                  <span className="text-gray-600">[{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                  <span className={`${i === 0 ? 'text-electricTeal font-bold' : 'text-white/60'}`}>{log}</span>
                </div>)}
              </div>
            </div>
          )}
        </div>

        <div className="bg-charcoal p-8 rounded-[2.5rem] border border-white/5 h-fit shadow-xl">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><Fingerprint size={20} className="text-electricTeal" /> Chain of Custody</h3>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-4 bg-obsidian/40 rounded-2xl border border-white/5 flex gap-4 items-center hover:bg-obsidian/80 transition-all cursor-pointer group">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[10px] font-black text-gray-500 border border-white/5 group-hover:text-electricTeal group-hover:border-electricTeal transition-all">#{102 + i}</div>
                <div>
                  <div className="text-sm font-bold group-hover:text-white transition-colors">Node Archive {4210 + i}</div>
                  <div className="text-[9px] text-biolumeGreen uppercase font-black tracking-widest flex items-center gap-1">
                    {/* Fixed reference to non-existent icon CheckCircle2 by using imported CheckCircle. */}
                    <CheckCircle size={10} /> Authenticated Hash
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 border border-white/10 rounded-xl hover:bg-white/5 hover:text-white transition-all">Historical Audits</button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-obsidian/95 backdrop-blur-md p-8 animate-in fade-in duration-300">
          <div className={`relative max-w-5xl w-full bg-charcoal rounded-3xl border-2 ${ANALYSIS_STEPS[activeStep].color} ${ANALYSIS_STEPS[activeStep].glow} transition-all duration-500 ease-out`}>
            <button onClick={() => setShowModal(false)} className="absolute top-5 right-5 text-gray-500 hover:text-white transition-all duration-300 p-2 bg-white/5 hover:bg-white/10 rounded-full z-10"><X size={20} /></button>
            <div className="px-12 py-8">
              <div key={activeStep} className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex gap-8 items-center mb-8">
                  <div className={`w-24 h-24 bg-obsidian rounded-2xl flex items-center justify-center border-2 ${ANALYSIS_STEPS[activeStep].color} shrink-0 transition-all duration-500`}>
                    {React.cloneElement(ANALYSIS_STEPS[activeStep].icon as React.ReactElement<any>, { size: 42 })}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-3xl font-black uppercase tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">{ANALYSIS_STEPS[activeStep].title}</h3>
                      <span className="text-xs font-mono font-bold bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 text-gray-500">{ANALYSIS_STEPS[activeStep].meta.stats.audit}</span>
                    </div>
                    <p className="text-gray-400 text-base leading-relaxed">{ANALYSIS_STEPS[activeStep].content}</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-obsidian/60 p-5 rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300">
                    <div className="text-xs text-gray-500 uppercase font-black mb-1 flex items-center gap-1.5"><Cpu size={14} /> AI Engine</div>
                    <div className="text-base font-bold text-electricTeal truncate">{ANALYSIS_STEPS[activeStep].meta.model}</div>
                  </div>
                  <div className="bg-obsidian/60 p-5 rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300">
                    <div className="text-xs text-gray-500 uppercase font-black mb-1 flex items-center gap-1.5"><Shield size={14} /> Confidence</div>
                    <div className="text-base font-bold text-biolumeGreen">{(parseFloat(ANALYSIS_STEPS[activeStep].meta.confidence) * 100).toFixed(1)}%</div>
                  </div>
                  <div className="bg-obsidian/60 p-5 rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300">
                    <div className="text-xs text-gray-500 uppercase font-black mb-1 flex items-center gap-1.5"><Database size={14} /> VRAM Load</div>
                    <div className="text-base font-bold text-amberEmber">{ANALYSIS_STEPS[activeStep].meta.stats.vram}</div>
                  </div>
                  <div className="bg-obsidian/60 p-5 rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300">
                    <div className="text-xs text-gray-500 uppercase font-black mb-1 flex items-center gap-1.5"><FileVideo size={14} /> Res. Source</div>
                    <div className="text-base font-bold text-white">{ANALYSIS_STEPS[activeStep].meta.stats.resolution}</div>
                  </div>
                </div>

                <div className="bg-obsidian/60 rounded-2xl p-6 border border-white/5 mb-6">
                  <h4 className="text-xs font-black uppercase text-gray-500 tracking-[0.15em] mb-4">Aggregated Temporal Data</h4>
                  <div className="grid grid-cols-3 gap-8 mb-5">
                    <div>
                      <div className="text-4xl font-black text-white">{ANALYSIS_STEPS[activeStep].meta.stats.total}</div>
                      <div className="text-xs text-gray-500 uppercase font-bold mt-1">Detections</div>
                    </div>
                    <div>
                      <div className="text-4xl font-black text-neonCrimson">{ANALYSIS_STEPS[activeStep].meta.stats.peak}</div>
                      <div className="text-xs text-gray-500 uppercase font-bold mt-1">Peak Rate</div>
                    </div>
                    <div>
                      <div className="text-4xl font-black text-electricTeal">{ANALYSIS_STEPS[activeStep].meta.fps}</div>
                      <div className="text-xs text-gray-500 uppercase font-bold mt-1">Process FPS</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                    {ANALYSIS_STEPS[activeStep].meta.objects.map(obj => (
                      <span key={obj} className="px-4 py-1.5 bg-white/5 rounded-lg text-sm font-bold text-gray-400 border border-white/5 flex items-center gap-2 hover:bg-white/10 transition-all duration-300">
                        <div className="w-2 h-2 rounded-full bg-electricTeal" /> {obj}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <div className="flex gap-2">
                  {ANALYSIS_STEPS.map((step, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveStep(i)}
                      className={`h-2.5 rounded-full transition-all duration-300 ${i === activeStep ? `w-12 bg-gradient-to-r from-white to-gray-400 ${step.glow}` : 'w-5 bg-white/10 hover:bg-white/20'}`}
                    />
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowModal(false)} className="px-6 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-black uppercase tracking-wider transition-all duration-300">Exit</button>
                  <button onClick={() => setActiveStep(prev => (prev + 1) % ANALYSIS_STEPS.length)} className="px-6 py-2.5 bg-gradient-to-r from-electricTeal to-cyan-400 text-obsidian rounded-xl text-sm font-black uppercase tracking-wider flex items-center gap-2 hover:scale-105 transition-all duration-300 shadow-lg shadow-electricTeal/30">Next <ChevronRight size={18} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
