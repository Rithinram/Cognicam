import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker, Circle } from 'react-leaflet';
import L from 'leaflet';
import { ResolvedIncident } from '../App';
import {
    Shield, Flame, Activity, Truck, Radio, MapPin,
    AlertTriangle, MessageSquare, CheckCircle2, Navigation, Zap, CheckCircle
} from 'lucide-react';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const UNIT_TYPES = {
    POLICE: { name: 'Police', color: '#00E8FF', icon: Shield },
    FIRE: { name: 'Fire Rescue', color: '#DC2626', icon: Flame },
    AMBULANCE: { name: 'Ambulance', color: '#00FF85', icon: Activity },
    ROAD: { name: 'Road Support', color: '#FFB800', icon: Truck },
};

interface EmergencyIncident {
    id: string;
    lat: number;
    lng: number;
    zone: string;
    type: string;
    intensity: string;
    confidence: number;
    time: string;
}

const INITIAL_INCIDENTS: EmergencyIncident[] = [
    { id: 'INC-001', lat: 12.9750, lng: 77.6100, zone: 'MG Road Junction', type: 'Vehicle Collision', intensity: 'CRITICAL', confidence: 98.2, time: '14:24:00' },
    { id: 'INC-002', lat: 12.9350, lng: 77.6240, zone: 'Koramangala 5th Block', type: 'Fire Outbreak', intensity: 'HIGH', confidence: 94.5, time: '14:18:32' },
    { id: 'INC-003', lat: 12.9560, lng: 77.5890, zone: 'Jayanagar 4th Block', type: 'Road Blockage', intensity: 'MEDIUM', confidence: 87.3, time: '14:32:15' },
    { id: 'INC-004', lat: 12.9920, lng: 77.5950, zone: 'Malleshwaram Circle', type: 'Medical Emergency', intensity: 'HIGH', confidence: 91.8, time: '14:28:44' },
];

const AVAILABLE_UNITS = [
    { id: 'POL-401', type: 'POLICE', name: 'Police Unit 401', lat: 12.9780, lng: 77.6050, status: 'available', eta: '3 min' },
    { id: 'POL-402', type: 'POLICE', name: 'Police Unit 402', lat: 12.9700, lng: 77.6200, status: 'available', eta: '5 min' },
    { id: 'FIRE-01', type: 'FIRE', name: 'Fire Rescue-1', lat: 12.9690, lng: 77.6180, status: 'available', eta: '4 min' },
    { id: 'AMB-01', type: 'AMBULANCE', name: 'Ambulance Alpha', lat: 12.9720, lng: 77.6250, status: 'available', eta: '4 min' },
    { id: 'ROAD-01', type: 'ROAD', name: 'Road Support-1', lat: 12.9580, lng: 77.5850, status: 'available', eta: '4 min' },
];

const getIntensityColor = (intensity: string) => {
    switch (intensity) {
        case 'CRITICAL': return '#DC2626';
        case 'HIGH': return '#FF6B00';
        case 'MEDIUM': return '#FFB800';
        default: return '#6B7280';
    }
};

const createUnitIcon = (type: string, isAvailable: boolean) => {
    const color = UNIT_TYPES[type as keyof typeof UNIT_TYPES]?.color || '#fff';
    return L.divIcon({
        className: 'custom-unit-marker',
        html: `<div style="width:28px;height:28px;background:${color};opacity:${isAvailable ? 1 : 0.5};border:2px solid #fff;border-radius:50%;box-shadow:0 0 15px ${color};"></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
    });
};

const RadiatingCircles: React.FC<{ center: [number, number]; color: string; isSelected: boolean }> = ({ center, color, isSelected }) => {
    const [radiuses, setRadiuses] = useState([100, 300, 500]);
    useEffect(() => {
        if (!isSelected) return;
        const interval = setInterval(() => {
            setRadiuses(prev => prev.map(r => r >= 800 ? 100 : r + 50));
        }, 200);
        return () => clearInterval(interval);
    }, [isSelected]);

    return (
        <>
            {isSelected && radiuses.map((radius, i) => (
                <Circle key={i} center={center} radius={radius} pathOptions={{ color, fillColor: color, fillOpacity: Math.max(0, 0.3 - radius / 3000), weight: 1 }} />
            ))}
            <CircleMarker center={center} radius={isSelected ? 14 : 10} pathOptions={{ color: '#fff', fillColor: color, fillOpacity: 1, weight: isSelected ? 3 : 2 }} />
        </>
    );
};

const MapController: React.FC<{ center: [number, number]; zoom: number; updateKey: number }> = ({ center, zoom, updateKey }) => {
    const map = useMap();
    useEffect(() => {
        map.invalidateSize();
        map.setView(center, zoom, { animate: true, duration: 0.5 });
    }, [center, zoom, map, updateKey]);
    return null;
};

interface DispatchProps {
    setGlobalAlerts: React.Dispatch<React.SetStateAction<{ id: string, message: string, node: string }[]>>;
    addResolvedIncident: (incident: ResolvedIncident) => void;
}

const Dispatch: React.FC<DispatchProps> = ({ setGlobalAlerts, addResolvedIncident }) => {
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [activeIncidents, setActiveIncidents] = useState<EmergencyIncident[]>(INITIAL_INCIDENTS);
    const [selectedIncident, setSelectedIncident] = useState<EmergencyIncident | null>(activeIncidents[0]);
    const [mapCenter, setMapCenter] = useState<[number, number]>([activeIncidents[0].lat, activeIncidents[0].lng]);
    const [mapZoom, setMapZoom] = useState(14);
    const [mapUpdateKey, setMapUpdateKey] = useState(0);
    const [dispatchedUnits, setDispatchedUnits] = useState<{ [incidentId: string]: string }>({});
    const [resolvedNotification, setResolvedNotification] = useState<{ show: boolean; incident: EmergencyIncident | null; unit: string }>({ show: false, incident: null, unit: '' });

    const filteredUnits = selectedType ? AVAILABLE_UNITS.filter(u => u.type === selectedType) : [];

    const [outboundOrders, setOutboundOrders] = useState([
        { id: 'ORD-101', time: '14:24:00', unit: 'Fire Rescue-1', message: 'Proceed to MG Road Junction.', status: 'Sent' },
    ]);

    const [unitResponses, setUnitResponses] = useState([
        { id: 'RES-501', time: '14:25:30', unit: 'Fire Rescue-1', response: 'Acknowledged. ETA 4 mins.', type: 'Ack' },
    ]);

    const handleIncidentSelect = (incident: EmergencyIncident) => {
        setSelectedIncident(incident);
        setMapCenter([incident.lat, incident.lng]);
        setMapZoom(15);
        setMapUpdateKey(prev => prev + 1);
    };

    const autoResolveIncident = (incident: EmergencyIncident, unitName: string) => {
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const startParts = incident.time.split(':').map(Number);
        const endParts = timestamp.split(':').map(Number);
        const durationMins = Math.abs((endParts[0] * 60 + endParts[1]) - (startParts[0] * 60 + startParts[1])) || 1;

        addResolvedIncident({
            id: incident.id,
            type: incident.type,
            zone: incident.zone,
            intensity: incident.intensity,
            resolvedAt: timestamp,
            resolvedBy: unitName,
            duration: `${durationMins} min`
        });

        setUnitResponses(prev => [{
            id: `RES-${Math.floor(Math.random() * 900 + 100)}`,
            time: timestamp,
            unit: unitName,
            response: `Scene secured at ${incident.zone}. Incident ${incident.id} resolved.`,
            type: 'Done'
        }, ...prev]);

        setResolvedNotification({ show: true, incident, unit: unitName });

        setActiveIncidents(prev => {
            const remaining = prev.filter(i => i.id !== incident.id);
            if (remaining.length > 0) {
                setSelectedIncident(remaining[0]);
                setMapCenter([remaining[0].lat, remaining[0].lng]);
                setMapZoom(15);
                setMapUpdateKey(k => k + 1);
            } else {
                setSelectedIncident(null);
            }
            return remaining;
        });

        setTimeout(() => setResolvedNotification({ show: false, incident: null, unit: '' }), 4000);
    };

    const handleDispatch = (unit: typeof AVAILABLE_UNITS[0]) => {
        if (!selectedIncident) return;
        const currentIncident = selectedIncident;
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        setOutboundOrders(prev => [{
            id: `ORD-${Math.floor(Math.random() * 900 + 100)}`,
            time: timestamp,
            unit: unit.name,
            message: `Dispatched to ${currentIncident.zone}. ETA: ${unit.eta}`,
            status: 'Sent'
        }, ...prev]);

        setDispatchedUnits(prev => ({ ...prev, [currentIncident.id]: unit.name }));

        setTimeout(() => {
            setUnitResponses(prev => [{
                id: `RES-${Math.floor(Math.random() * 900 + 100)}`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                unit: unit.name,
                response: 'Acknowledged. En route.',
                type: 'Ack'
            }, ...prev]);
        }, 2000);

        setTimeout(() => autoResolveIncident(currentIncident, unit.name), 8000);
    };

    return (
        <div className="space-y-6 pb-12">
            {resolvedNotification.show && resolvedNotification.incident && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-obsidian/80 backdrop-blur-sm">
                    <div className="bg-charcoal p-8 rounded-3xl border-2 border-biolumeGreen shadow-[0_0_60px_rgba(0,255,133,0.3)] text-center max-w-md">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-biolumeGreen/20 flex items-center justify-center">
                            <CheckCircle size={48} className="text-biolumeGreen" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2 text-biolumeGreen">Incident Resolved!</h3>
                        <p className="text-gray-400 mb-4"><span className="text-white font-bold">{resolvedNotification.unit}</span> secured the scene.</p>
                        <p className="text-xs text-gray-500">Moving to next incident...</p>
                    </div>
                </div>
            )}

            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black tracking-tight">Intelligence Dispatch Hub</h2>
                    <p className="text-gray-500 font-medium mt-1 flex items-center gap-2">
                        <Radio size={16} className="text-electricTeal animate-pulse" /> Multi-Agency Coordination
                    </p>
                </div>
                <span className="px-3 py-1 bg-red-600/20 text-red-500 rounded-lg font-bold text-sm">{activeIncidents.length} ACTIVE</span>
            </header>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8 space-y-6">
                    <div className="grid grid-cols-4 gap-3">
                        {Object.entries(UNIT_TYPES).map(([key, value]) => {
                            const Icon = value.icon;
                            const count = AVAILABLE_UNITS.filter(u => u.type === key && u.status === 'available').length;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setSelectedType(selectedType === key ? null : key)}
                                    className={`p-4 rounded-2xl border transition-all flex flex-col items-center ${selectedType === key ? 'bg-white/10 border-2' : 'bg-charcoal border-white/5'}`}
                                    style={{ borderColor: selectedType === key ? value.color : undefined }}
                                >
                                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: `${value.color}20` }}>
                                        <Icon size={20} style={{ color: value.color }} />
                                    </div>
                                    <div className="font-bold text-sm">{value.name}</div>
                                    <div className="text-[10px] text-gray-500">{count} Available</div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="h-[400px] bg-charcoal rounded-3xl border border-white/10 relative overflow-hidden">
                        {activeIncidents.length > 0 ? (
                            <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%', borderRadius: '1.5rem' }} zoomControl={false}>
                                <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
                                <MapController center={mapCenter} zoom={mapZoom} updateKey={mapUpdateKey} />
                                {activeIncidents.map(incident => (
                                    <RadiatingCircles key={incident.id} center={[incident.lat, incident.lng]} color={getIntensityColor(incident.intensity)} isSelected={selectedIncident?.id === incident.id} />
                                ))}
                                {filteredUnits.map(unit => (
                                    <Marker key={unit.id} position={[unit.lat, unit.lng]} icon={createUnitIcon(unit.type, unit.status === 'available')}>
                                        <Popup>
                                            <div className="p-2 min-w-[160px]">
                                                <div className="font-bold text-sm text-gray-900">{unit.name}</div>
                                                <div className="text-xs">ETA: {unit.eta}</div>
                                                {selectedIncident && !dispatchedUnits[selectedIncident.id] && (
                                                    <button onClick={() => handleDispatch(unit)} className="mt-2 w-full py-1.5 bg-blue-500 text-white text-xs font-bold rounded">DISPATCH</button>
                                                )}
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center">
                                <CheckCircle size={48} className="text-biolumeGreen mx-auto mb-4" />
                                <div className="text-xl font-bold text-biolumeGreen">All Incidents Resolved</div>
                            </div>
                        )}

                        {selectedIncident && (
                            <div className="absolute top-4 left-4 p-4 bg-obsidian/95 rounded-xl border border-white/10 min-w-[200px] z-[1000]">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: getIntensityColor(selectedIncident.intensity) }} />
                                    <span className="text-sm font-black" style={{ color: getIntensityColor(selectedIncident.intensity) }}>{selectedIncident.intensity}</span>
                                </div>
                                <div className="text-xs space-y-1">
                                    <div><span className="text-gray-500">Zone:</span> <span className="font-bold">{selectedIncident.zone}</span></div>
                                    <div><span className="text-gray-500">Type:</span> <span className="font-bold">{selectedIncident.type}</span></div>
                                    {dispatchedUnits[selectedIncident.id] && <div><span className="text-gray-500">Unit:</span> <span className="font-bold text-electricTeal">{dispatchedUnits[selectedIncident.id]}</span></div>}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-charcoal rounded-2xl border border-white/5 p-4">
                        <h3 className="text-sm font-black uppercase text-gray-400 mb-4 flex items-center gap-2"><Zap size={14} className="text-amberEmber" /> Active Incidents</h3>
                        {activeIncidents.length > 0 ? (
                            <div className="grid grid-cols-4 gap-3">
                                {activeIncidents.map(incident => (
                                    <button key={incident.id} onClick={() => handleIncidentSelect(incident)} className={`p-4 rounded-xl border-2 text-left ${selectedIncident?.id === incident.id ? 'bg-white/10' : 'bg-obsidian/50'}`} style={{ borderColor: selectedIncident?.id === incident.id ? getIntensityColor(incident.intensity) : 'rgba(255,255,255,0.05)' }}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: getIntensityColor(incident.intensity) }} />
                                            <span className="text-[10px] font-black" style={{ color: getIntensityColor(incident.intensity) }}>{incident.intensity}</span>
                                        </div>
                                        <div className="font-bold text-sm truncate">{incident.type}</div>
                                        <div className="text-[10px] text-gray-500 truncate"><MapPin size={10} className="inline" /> {incident.zone}</div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500"><CheckCircle size={32} className="mx-auto mb-2 text-biolumeGreen" />All resolved</div>
                        )}
                    </div>
                </div>

                <div className="col-span-4 space-y-4">
                    <div className="bg-charcoal rounded-2xl border border-white/5 h-[280px] flex flex-col">
                        <div className="p-3 border-b border-white/5 bg-red-600/10 flex justify-between items-center rounded-t-2xl">
                            <h3 className="text-[10px] font-black uppercase flex items-center gap-2"><Radio size={12} className="text-red-600" /> Intelligence Feed</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            {activeIncidents.map(incident => (
                                <div key={incident.id} className="p-3 bg-obsidian/40 rounded-xl border border-red-600/10 cursor-pointer" onClick={() => handleIncidentSelect(incident)}>
                                    <div className="text-[9px] font-mono text-gray-500">{incident.time} • {incident.id}</div>
                                    <div className="text-[11px] font-bold uppercase">{incident.type}</div>
                                    <div className="text-[9px] mt-1" style={{ color: getIntensityColor(incident.intensity) }}><AlertTriangle size={9} className="inline" /> {incident.zone}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-charcoal rounded-2xl border border-white/5 h-[280px] flex flex-col">
                        <div className="p-3 border-b border-white/5 bg-electricTeal/10 flex justify-between items-center rounded-t-2xl">
                            <h3 className="text-[10px] font-black uppercase flex items-center gap-2"><MessageSquare size={12} className="text-electricTeal" /> Messages Sent</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            {outboundOrders.map(order => (
                                <div key={order.id} className="p-3 bg-obsidian/40 rounded-xl border border-electricTeal/10">
                                    <div className="text-[9px] font-mono text-gray-500">{order.time} • {order.unit}</div>
                                    <div className="text-[10px] text-gray-400 italic">"{order.message}"</div>
                                    <div className="text-[9px] text-electricTeal mt-1"><CheckCircle2 size={9} className="inline" /> DISPATCHED</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-charcoal rounded-2xl border border-white/5 h-[280px] flex flex-col">
                        <div className="p-3 border-b border-white/5 bg-biolumeGreen/10 flex justify-between items-center rounded-t-2xl">
                            <h3 className="text-[10px] font-black uppercase flex items-center gap-2"><Truck size={12} className="text-biolumeGreen" /> Inbound Status</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-2">
                            {unitResponses.map(res => (
                                <div key={res.id} className={`p-3 bg-obsidian/40 rounded-xl border ${res.type === 'Done' ? 'border-biolumeGreen/20' : 'border-white/5'}`}>
                                    <div className="text-[9px] font-mono text-gray-500">{res.time} • {res.unit}</div>
                                    <div className={`text-[11px] font-bold ${res.type === 'Done' ? 'text-biolumeGreen' : 'text-white'}`}>{res.response}</div>
                                    {res.type === 'Done' && <div className="text-[8px] text-biolumeGreen/50 mt-1">MISSION_COMPLETE</div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dispatch;
