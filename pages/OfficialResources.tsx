import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Users, Truck, Navigation, Locate, Map as MapIcon, Radio, Smartphone, Send, Shield, Zap, Target, Flame, Crosshair, Plane, Triangle, AlertTriangle, ArrowUpRight } from 'lucide-react';

interface Unit {
    id: string;
    name: string;
    type: 'patrol' | 'ambulance' | 'fire' | 'utility';
    status: 'available' | 'on-route' | 'on-site';
    location: { lat: number; lng: number };
    battery: number;
}

interface Message {
    id: number;
    direction: 'sent' | 'received';
    text: string;
    time: string;
}

const MOCK_UNITS: Unit[] = [
    { id: 'P-101', name: 'Police Patrol 1', type: 'patrol', status: 'available', location: { lat: 12.9720, lng: 77.5950 }, battery: 85 },
    { id: 'A-201', name: 'Ambulance Unit 2', type: 'ambulance', status: 'on-site', location: { lat: 12.9800, lng: 77.6000 }, battery: 94 },
    { id: 'R-301', name: 'Road Support', type: 'utility', status: 'on-route', location: { lat: 12.9600, lng: 77.6400 }, battery: 78 },
    { id: 'F-401', name: 'Fire Engine 4', type: 'fire', status: 'available', location: { lat: 12.9500, lng: 77.5800 }, battery: 100 },
];

const UNIT_COLORS = {
    patrol: '#00E8FF',    // Electric Teal
    ambulance: '#FF1F8A', // Neon Crimson
    utility: '#FFB800',   // Amber
    fire: '#FF5722'       // Fire Orange
};

// Custom Icons
const createUnitIcon = (type: Unit['type']) => {
    const color = UNIT_COLORS[type];
    const rotation = Math.floor(Math.random() * 360); // Simulate heading

    return L.divIcon({
        className: 'custom-unit-marker',
        html: `<div style="
      width: 40px;
      height: 40px;
      background: ${color}20;
      border: 2px solid ${color};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 15px ${color}60;
    ">
      <div style="background: ${color}; width: 8px; height: 8px; border-radius: 50%;"></div>
    </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
    });
};

const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom, { animate: true });
    }, [center, zoom, map]);
    return null;
};

const OfficialResources: React.FC = () => {
    const [units, setUnits] = useState<Unit[]>(MOCK_UNITS);
    const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
    const [showHeatmap, setShowHeatmap] = useState(false);
    const [mapCenter, setMapCenter] = useState<[number, number]>([12.9716, 77.5946]);
    const [showCommModal, setShowCommModal] = useState(false);
    const [messageInput, setMessageInput] = useState('');

    // Mock Message History
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, direction: 'sent', text: 'Report status immediately.', time: '10:30 AM' },
        { id: 2, direction: 'received', text: 'Status Green. En route to Sector 4.', time: '10:32 AM' },
    ]);

    const handleSendMessage = () => {
        if (!messageInput.trim()) return;

        const newMessage: Message = {
            id: Date.now(),
            direction: 'sent',
            text: messageInput,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, newMessage]);
        setMessageInput('');

        // Simulate "Received" confirmation or reply
        setTimeout(() => {
            const reply: Message = {
                id: Date.now() + 1,
                direction: 'received',
                text: 'Copy that. Instructions received.',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, reply]);
        }, 2000);
    };

    const getUnitIcon = (type: Unit['type']) => {
        switch (type) {
            case 'patrol': return <Shield size={14} />;
            case 'ambulance': return <Truck size={14} />;
            case 'fire': return <Flame size={14} />;
            case 'utility': return <AlertTriangle size={14} />;
        }
    };

    return (
        <div className="space-y-6 pb-12 h-[calc(100vh-100px)] flex flex-col">
            <header className="flex justify-between items-end flex-shrink-0">
                <div>
                    <h2 className="text-4xl font-black tracking-tight uppercase italic text-white">Resource <span className="text-electricTeal">Grid</span></h2>
                    <p className="text-gray-500 font-medium mt-1 flex items-center gap-2 uppercase tracking-widest text-xs">
                        <Target size={14} className="text-electricTeal" /> Command & Control Interface
                    </p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => setShowHeatmap(!showHeatmap)}
                        className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all border flex items-center gap-2 ${showHeatmap
                            ? 'bg-red-500 text-white border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                            : 'bg-charcoal text-gray-500 border-white/10 hover:text-white hover:border-white/30'
                            }`}
                    >
                        <Zap size={14} /> Heatmap Overlay
                    </button>
                </div>
            </header>

            <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
                {/* Unit List Sidebar */}
                <div className="col-span-3 bg-charcoal rounded-[2.5rem] border border-white/5 flex flex-col overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                        <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2 text-white">
                            <Users size={16} className="text-electricTeal" /> Active Units
                        </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {units.map(unit => (
                            <button
                                key={unit.id}
                                onClick={() => {
                                    setSelectedUnit(unit);
                                    setMapCenter([unit.location.lat, unit.location.lng]);
                                }}
                                className={`w-full text-left p-4 rounded-[1.5rem] border transition-all ${selectedUnit?.id === unit.id
                                    ? 'bg-electricTeal/10 border-electricTeal shadow-lg'
                                    : 'bg-obsidian/40 border-white/5 hover:bg-obsidian/60'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full animate-pulse`} style={{ backgroundColor: UNIT_COLORS[unit.type] }} />
                                        <span className="font-black text-white text-xs uppercase tracking-tight">{unit.id}</span>
                                    </div>
                                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${unit.status === 'available' ? 'bg-biolumeGreen/10 text-biolumeGreen' :
                                        unit.status === 'on-route' ? 'bg-amberEmber/10 text-amberEmber' : 'bg-neonCrimson/10 text-neonCrimson'
                                        }`}>{unit.status}</span>
                                </div>
                                <div className="text-sm font-bold text-gray-300 uppercase tracking-wide mb-1 flex items-center gap-2">
                                    <span className="text-xs" style={{ color: UNIT_COLORS[unit.type] }}>{getUnitIcon(unit.type)}</span>
                                    {unit.name}
                                </div>
                                <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono">
                                    <span className="flex items-center gap-1"><Navigation size={10} /> {unit.location.lat.toFixed(4)}, {unit.location.lng.toFixed(4)}</span>
                                    <span className="flex items-center gap-1"><Zap size={10} /> {unit.battery}%</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Map View */}
                <div className="col-span-9 bg-charcoal rounded-[2.5rem] border border-white/5 overflow-hidden relative shadow-2xl">
                    <MapContainer
                        center={mapCenter}
                        zoom={14}
                        style={{ height: '100%', width: '100%' }}
                        zoomControl={false}
                    >
                        <TileLayer
                            attribution='&copy; OpenStreetMap'
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />
                        <MapController center={mapCenter} zoom={14} />

                        {/* Heatmap Simulation */}
                        {showHeatmap && (
                            <>
                                <div className="leaflet-overlay-pane opacity-30 pointer-events-none">
                                    <div className="absolute top-[30%] left-[40%] w-64 h-64 bg-red-500 blur-[80px] rounded-full z-[400]" />
                                    <div className="absolute top-[50%] left-[60%] w-48 h-48 bg-orange-500 blur-[60px] rounded-full z-[400]" />
                                </div>
                            </>
                        )}

                        {units.map(unit => (
                            <Marker
                                key={unit.id}
                                position={[unit.location.lat, unit.location.lng]}
                                icon={createUnitIcon(unit.type)}
                                eventHandlers={{
                                    click: () => {
                                        setSelectedUnit(unit);
                                        setMapCenter([unit.location.lat, unit.location.lng]);
                                    }
                                }}
                            >
                                <Popup offset={[0, -10]}>
                                    <div className="font-sans min-w-[200px]">
                                        <div className="font-black text-xs uppercase tracking-wide border-b pb-2 mb-2 flex items-center gap-2">
                                            <span style={{ color: UNIT_COLORS[unit.type] }}>{getUnitIcon(unit.type)}</span>
                                            {unit.name}
                                        </div>
                                        <div className="space-y-1 mb-3">
                                            <div className="flex justify-between text-[10px] font-bold text-gray-700">
                                                <span>STATUS:</span>
                                                <span className="uppercase">{unit.status}</span>
                                            </div>
                                            <div className="flex justify-between text-[10px] font-bold text-gray-700">
                                                <span>LOC:</span>
                                                <span className="font-mono">{unit.location.lat.toFixed(4)}, {unit.location.lng.toFixed(4)}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setShowCommModal(true)}
                                            className="w-full bg-electricTeal text-obsidian text-[10px] font-black uppercase py-2 rounded flex items-center justify-center gap-1 hover:brightness-110 shadow-lg"
                                        >
                                            <Smartphone size={10} /> Message
                                        </button>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>

                    {/* Float Controls */}
                    <div className="absolute top-6 right-6 z-[1000] flex flex-col gap-2">
                        <div className="bg-obsidian/80 backdrop-blur text-white p-4 rounded-2xl border border-white/10 shadow-xl max-w-xs">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Instructions</h4>
                            {selectedUnit?.status === 'available' ? (
                                <p className="text-xs font-medium text-electricTeal animate-pulse">Select target location on map to deploy unit.</p>
                            ) : (
                                <p className="text-xs font-medium text-gray-400">Select an AVAILABLE unit to re-deploy.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Communication Modal */}
            {showCommModal && selectedUnit && (
                <div className="fixed inset-0 z-[2000] bg-obsidian/80 backdrop-blur flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-charcoal w-full max-w-md p-8 rounded-[2rem] border border-white/10 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-electricTeal/20 rounded-xl flex items-center justify-center text-electricTeal">
                                    <Radio size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black uppercase italic text-white">Comms Bridge</h3>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">To: {selectedUnit.name}</p>
                                </div>
                            </div>
                            <button onClick={() => setShowCommModal(false)} className="text-gray-500 hover:text-white transition-colors">
                                Close
                            </button>
                        </div>

                        {/* Message History */}
                        <div className="flex-1 bg-obsidian/50 p-4 rounded-xl mb-4 overflow-y-auto max-h-[250px] min-h-[200px] space-y-3 custom-scrollbar">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.direction === 'sent' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-xl ${msg.direction === 'sent'
                                            ? 'bg-electricTeal/10 border border-electricTeal/30 rounded-br-none'
                                            : 'bg-white/5 border border-white/10 rounded-bl-none'
                                        }`}>
                                        <div className="flex items-center justify-between gap-4 mb-1">
                                            <span className={`text-[9px] font-black uppercase tracking-widest ${msg.direction === 'sent' ? 'text-electricTeal' : 'text-gray-400'}`}>
                                                {msg.direction === 'sent' ? 'HQ Command' : selectedUnit.id}
                                            </span>
                                            <span className="text-[9px] text-gray-600 font-mono">{msg.time}</span>
                                        </div>
                                        <p className="text-xs text-gray-200 font-medium leading-relaxed">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                placeholder={`Message ${selectedUnit.name}...`}
                                className="flex-1 bg-obsidian border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-electricTeal transition-colors"
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button
                                onClick={handleSendMessage}
                                className="px-6 bg-electricTeal text-obsidian rounded-xl font-black uppercase tracking-widest text-xs hover:bg-electricTeal/90 transition-colors flex items-center gap-2"
                            >
                                <Send size={14} /> Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OfficialResources;
