
import React from 'react';
import { BookOpen, Terminal, Shield, FileCode, Users, HelpCircle, ChevronRight } from 'lucide-react';

const Documentation: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="flex gap-12 flex-col lg:flex-row">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-72 space-y-2">
           <h2 className="text-xl font-bold mb-6 px-4">Knowledge Base</h2>
           {[
             { label: 'Introduction', icon: <BookOpen size={16}/> },
             { label: 'API Reference', icon: <Terminal size={16}/> },
             { label: 'Security SOPs', icon: <Shield size={16}/> },
             { label: 'Model Training', icon: <FileCode size={16}/> },
             { label: 'User Management', icon: <Users size={16}/> },
             { label: 'Troubleshooting', icon: <HelpCircle size={16}/> },
           ].map((item, i) => (
             <button key={i} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${i === 0 ? 'bg-electricTeal/10 text-electricTeal' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
               {item.icon} {item.label}
             </button>
           ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-12">
          <section>
            <h1 className="text-4xl font-extrabold mb-6">Introduction to CivicLogic</h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              CivicLogic is a next-generation Smart City Infrastructure that bridges raw video perception with logic-based autonomous reasoning. 
              By leveraging edge-computing and high-fidelity neural networks, we provide city officials with actionable intelligence in sub-millisecond windows.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="p-6 bg-charcoal rounded-2xl border border-white/5 hover:border-electricTeal transition-all cursor-pointer group">
                  <h4 className="font-bold mb-2 flex justify-between items-center">System Architecture <ChevronRight size={16} className="text-gray-600 group-hover:text-electricTeal" /></h4>
                  <p className="text-xs text-gray-500">Learn how we process 1,000+ camera streams using distributed inference nodes.</p>
               </div>
               <div className="p-6 bg-charcoal rounded-2xl border border-white/5 hover:border-neonCrimson transition-all cursor-pointer group">
                  <h4 className="font-bold mb-2 flex justify-between items-center">Standard Operating Procedures <ChevronRight size={16} className="text-gray-600 group-hover:text-neonCrimson" /></h4>
                  <p className="text-xs text-gray-500">Legal requirements and response protocols for emergency dispatch events.</p>
               </div>
            </div>
          </section>

          <section className="bg-charcoal p-8 rounded-3xl border border-white/5">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Terminal size={20} className="text-electricTeal" /> API Example (Inference Stream)</h3>
             <div className="bg-obsidian rounded-2xl p-6 font-mono text-sm border border-white/5">
                <div className="text-biolumeGreen mb-2">// GET /api/v1/nodes/active/detections</div>
                <div className="text-gray-400">
                   {`{`} <br/>
                   &nbsp;&nbsp;<span className="text-electricTeal">"node_id"</span>: <span className="text-amberEmber">"CAM-001"</span>, <br/>
                   &nbsp;&nbsp;<span className="text-electricTeal">"objects"</span>: [<br/>
                   &nbsp;&nbsp;&nbsp;&nbsp;{`{ "type": "vehicle", "confidence": 0.98, "velocity": "42km/h" }`},<br/>
                   &nbsp;&nbsp;&nbsp;&nbsp;{`{ "type": "pedestrian", "confidence": 0.92, "state": "stationary" }`}<br/>
                   &nbsp;&nbsp;],<br/>
                   &nbsp;&nbsp;<span className="text-electricTeal">"timestamp"</span>: <span className="text-amberEmber">"2023-11-20T14:22:01Z"</span><br/>
                   {`}`}
                </div>
             </div>
          </section>

          <section className="space-y-4">
             <h3 className="text-xl font-bold">Frequently Asked Questions</h3>
             <div className="space-y-2">
                {[
                  "How is data privacy handled?",
                  "What happens during a complete signal blackout?",
                  "Can the system distinguish between emergency and civil vehicles?",
                  "How are digital evidence hashes verified in court?"
                ].map((q, i) => (
                  <div key={i} className="p-4 bg-charcoal rounded-xl border border-white/5 hover:border-white/10 cursor-pointer flex justify-between items-center group">
                    <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">{q}</span>
                    <ChevronRight size={16} className="text-gray-600" />
                  </div>
                ))}
             </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
