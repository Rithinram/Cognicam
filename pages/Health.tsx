import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Wifi, AlertTriangle, MapPin, Thermometer, Cpu, Activity, CheckCircle, XCircle, RefreshCw, Navigation, Phone } from 'lucide-react';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Indian States and Districts with coordinates
const LOCATIONS: { [state: string]: { [district: string]: { lat: number; lng: number } } } = {
  'Karnataka': {
    'Bangalore Urban': { lat: 12.9716, lng: 77.5946 },
    'Mysuru': { lat: 12.2958, lng: 76.6394 },
    'Mangalore': { lat: 12.9141, lng: 74.8560 },
    'Hubli': { lat: 15.3647, lng: 75.1240 },
    'Belgaum': { lat: 15.8497, lng: 74.4977 },
  },
  'Tamil Nadu': {
    'Chennai': { lat: 13.0827, lng: 80.2707 },
    'Coimbatore': { lat: 11.0168, lng: 76.9558 },
    'Madurai': { lat: 9.9252, lng: 78.1198 },
    'Salem': { lat: 11.6643, lng: 78.1460 },
    'Tiruchirappalli': { lat: 10.7905, lng: 78.7047 },
  },
  'Maharashtra': {
    'Mumbai': { lat: 19.0760, lng: 72.8777 },
    'Pune': { lat: 18.5204, lng: 73.8567 },
    'Nagpur': { lat: 21.1458, lng: 79.0882 },
    'Nashik': { lat: 19.9975, lng: 73.7898 },
    'Aurangabad': { lat: 19.8762, lng: 75.3433 },
  },
  'Kerala': {
    'Thiruvananthapuram': { lat: 8.5241, lng: 76.9366 },
    'Kochi': { lat: 9.9312, lng: 76.2673 },
    'Kozhikode': { lat: 11.2588, lng: 75.7804 },
    'Thrissur': { lat: 10.5276, lng: 76.2144 },
    'Kannur': { lat: 11.8745, lng: 75.3704 },
  },
  'Andhra Pradesh': {
    'Visakhapatnam': { lat: 17.6868, lng: 83.2185 },
    'Vijayawada': { lat: 16.5062, lng: 80.6480 },
    'Guntur': { lat: 16.3067, lng: 80.4365 },
    'Tirupati': { lat: 13.6288, lng: 79.4192 },
    'Nellore': { lat: 14.4426, lng: 79.9865 },
  },
};

// Camera Status types
type CameraStatus = 'active' | 'partially-damaged' | 'defected';

// Generate random cameras for a location
const generateCamerasForLocation = (state: string, district: string) => {
  const baseCoords = LOCATIONS[state]?.[district] || { lat: 12.9716, lng: 77.5946 };
  const healths = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C'];

  const cameras = Array.from({ length: 8 }, (_, i) => {
    // Demo logic: 1 defected, 1 partially damaged, rest active
    let status: CameraStatus = 'active';
    if (i === 0) status = 'defected';
    else if (i === 1) status = 'partially-damaged';

    return {
      id: `CAM-${String(i + 1).padStart(3, '0')}`,
      name: `${district} Junction ${i + 1}`,
      lat: baseCoords.lat + (Math.random() - 0.5) * 0.06,
      lng: baseCoords.lng + (Math.random() - 0.5) * 0.06,
      status,
      health: status === 'active' ? healths[Math.floor(Math.random() * 3)] : (status === 'partially-damaged' ? 'C' : 'F'),
      uptime: status === 'defected' ? '0%' : (status === 'partially-damaged' ? '65%' : `${(95 + Math.random() * 4.9).toFixed(1)}%`),
      signal: status === 'defected' ? 0 : (status === 'partially-damaged' ? 45 : Math.floor(85 + Math.random() * 15)),
      temp: status === 'defected' ? 'CRITICAL' : (status === 'partially-damaged' ? '48°C' : `${(35 + Math.random() * 8).toFixed(0)}°C`),
      firmware: status === 'defected' ? 'OFFLINE' : `v${Math.floor(Math.random() * 3) + 2}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
    };
  });

  return cameras;
};

// Create custom camera icon with strict color mapping
const createCameraIcon = (status: CameraStatus, isSelected: boolean) => {
  let color = '#00FF85'; // active - Green
  if (status === 'partially-damaged') color = '#FFB800'; // partially damaged - Orange
  if (status === 'defected') color = '#DC2626'; // defected - Red

  if (isSelected) {
    // Keep base color but add stronger glow and size
    const size = 36;
    return L.divIcon({
      className: 'custom-camera-marker-selected',
      html: `<div style="
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border: 4px solid #000;
        border-radius: 50%;
        box-shadow: 0 0 20px rgba(0,0,0,0.5), inset 0 0 10px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        transform: scale(1.1);
        transition: all 0.3s ease;
      ">
        <svg width="${size * 0.55}" height="${size * 0.55}" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      </div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2],
    });
  }

  const size = 28;
  return L.divIcon({
    className: 'custom-camera-marker',
    html: `<div style="
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border: 3px solid #000;
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    ">
      <svg width="${size * 0.5}" height="${size * 0.5}" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

// Map controller
const MapController: React.FC<{ center: [number, number]; zoom: number; triggerKey: number }> = ({ center, zoom, triggerKey }) => {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
      map.setView(center, zoom, { animate: true, duration: 0.5 });
    }, 100);
    return () => clearTimeout(timer);
  }, [center, zoom, map, triggerKey]);
  return null;
};

const Health: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('Karnataka');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Bangalore Urban');
  const [cameras, setCameras] = useState(generateCamerasForLocation('Karnataka', 'Bangalore Urban'));
  const [selectedCam, setSelectedCam] = useState(cameras[0]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([12.9716, 77.5946]);
  const [mapZoom, setMapZoom] = useState(13);
  const [mapTriggerKey, setMapTriggerKey] = useState(0);
  const [notification, setNotification] = useState<{ show: boolean; cameraId: string }>({ show: false, cameraId: '' });

  const districts = Object.keys(LOCATIONS[selectedState] || {});

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    const firstDistrict = Object.keys(LOCATIONS[state])[0];
    setSelectedDistrict(firstDistrict);
    const newCameras = generateCamerasForLocation(state, firstDistrict);
    setCameras(newCameras);
    setSelectedCam(newCameras[0]);
    const coords = LOCATIONS[state][firstDistrict];
    setMapCenter([coords.lat, coords.lng]);
    setMapZoom(13);
    setMapTriggerKey(prev => prev + 1);
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    const newCameras = generateCamerasForLocation(selectedState, district);
    setCameras(newCameras);
    setSelectedCam(newCameras[0]);
    const coords = LOCATIONS[selectedState][district];
    setMapCenter([coords.lat, coords.lng]);
    setMapZoom(13);
    setMapTriggerKey(prev => prev + 1);
  };

  const handleCameraSelect = (cam: typeof cameras[0]) => {
    setSelectedCam(cam);
    setMapCenter([cam.lat, cam.lng]);
    setMapZoom(15);
    setMapTriggerKey(prev => prev + 1);
  };

  const handleInformPolice = (cameraId: string) => {
    setNotification({ show: true, cameraId });
    setCameras(prev => {
      const remaining = prev.filter(c => c.id !== cameraId);
      if (selectedCam.id === cameraId && remaining.length > 0) {
        setSelectedCam(remaining[0]);
      }
      return remaining;
    });
    setTimeout(() => {
      setNotification({ show: false, cameraId: '' });
    }, 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {notification.show && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-obsidian/80 backdrop-blur-sm">
          <div className="bg-charcoal p-8 rounded-3xl border-2 border-biolumeGreen shadow-[0_0_60px_rgba(0,255,133,0.3)] text-center max-w-md animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-biolumeGreen/20 flex items-center justify-center">
              <CheckCircle size={48} className="text-biolumeGreen" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-biolumeGreen text-center">Police Informed!</h3>
            <p className="text-gray-400 text-center">Camera <span className="text-white font-bold">{notification.cameraId}</span> reported.</p>
            <p className="text-[10px] text-gray-500 mt-4 tracking-widest font-black uppercase text-center">NODE REMOVED FROM TRACKING GRID</p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black tracking-tight uppercase">Camera Health <span className="text-electricTeal">Hub</span></h2>
          <p className="text-gray-500 font-medium mt-1 flex items-center gap-2">
            <Activity size={16} className="text-electricTeal animate-pulse" /> Advanced Surveillance Diagnostic Network
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] text-gray-500 uppercase font-bold">Current Sector</div>
            <div className="text-sm font-black text-electricTeal tracking-wide uppercase">{selectedDistrict}, {selectedState}</div>
          </div>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-4 space-y-4">
          <div className="bg-charcoal rounded-3xl border border-white/5 h-[400px] flex flex-col overflow-hidden shadow-xl">
            <div className="p-5 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <MapPin size={16} className="text-electricTeal" /> Camera Nodes
              </h3>
              <span className="text-[10px] bg-white/5 px-2 py-1 rounded font-black text-gray-400">{cameras.length} NODES</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              {cameras.map((cam) => (
                <button
                  key={cam.id}
                  onClick={() => handleCameraSelect(cam)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${selectedCam.id === cam.id
                    ? 'bg-electricTeal/10 border-electricTeal shadow-[0_0_20px_rgba(0,232,255,0.1)]'
                    : 'bg-obsidian/50 border-white/5 hover:bg-obsidian/80'
                    }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-bold text-sm">{cam.id}</div>
                    <div className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-widest ${cam.status === 'active' ? 'text-biolumeGreen' : (cam.status === 'partially-damaged' ? 'text-amber-500' : 'text-red-500')
                      }`}>
                      {cam.status === 'active' ? <CheckCircle size={10} /> : (cam.status === 'partially-damaged' ? <AlertTriangle size={10} /> : <XCircle size={10} />)}
                      {cam.status.replace('-', ' ')}
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-500 truncate">{cam.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Location Selector */}
          <div className="bg-charcoal rounded-3xl border border-white/5 p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-5">
              <Navigation size={16} className="text-electricTeal" />
              <h3 className="font-bold text-sm uppercase tracking-tight">Geo-Sector Selection</h3>
            </div>
            <div className="space-y-4">
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full bg-obsidian border border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-electricTeal outline-none"
              >
                {Object.keys(LOCATIONS).map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full bg-obsidian border border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:border-electricTeal outline-none"
              >
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
              <button
                onClick={() => {
                  const coords = LOCATIONS[selectedState][selectedDistrict];
                  setMapCenter([coords.lat, coords.lng]);
                  setMapZoom(13);
                  setMapTriggerKey(prev => prev + 1);
                }}
                className="w-full py-4 bg-electricTeal text-obsidian font-black rounded-xl hover:shadow-[0_0_20px_rgba(0,232,255,0.4)] transition-all uppercase text-xs tracking-widest"
              >
                Update Sector
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Map */}
        <div className="col-span-8">
          <div className="h-[600px] bg-charcoal rounded-[2.5rem] border border-white/10 overflow-hidden relative shadow-2xl">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: '100%', width: '100%' }}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />
              <MapController center={mapCenter} zoom={mapZoom} triggerKey={mapTriggerKey} />

              {cameras.map(cam => (
                <Marker
                  key={cam.id}
                  position={[cam.lat, cam.lng]}
                  icon={createCameraIcon(cam.status, selectedCam.id === cam.id)}
                  eventHandlers={{
                    click: () => handleCameraSelect(cam),
                  }}
                >
                  <Popup>
                    <div className="p-3 min-w-[200px] font-sans">
                      <div className="font-black text-sm text-gray-900 border-b pb-2 mb-2 uppercase tracking-wide">{cam.id}</div>
                      <div className="text-xs text-gray-600 font-bold mb-3">{cam.name}</div>
                      <div className="flex items-center gap-2 mb-4">
                        <div className={`w-2 h-2 rounded-full ${cam.status === 'active' ? 'bg-green-500 animate-pulse' : (cam.status === 'partially-damaged' ? 'bg-amber-500' : 'bg-red-500')
                          }`} />
                        <span className={`text-[10px] font-black tracking-widest uppercase ${cam.status === 'active' ? 'text-green-600' : (cam.status === 'partially-damaged' ? 'text-amber-600' : 'text-red-600')
                          }`}>
                          {cam.status.replace('-', ' ')}
                        </span>
                      </div>

                      {cam.status === 'defected' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleInformPolice(cam.id);
                          }}
                          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg"
                        >
                          <Phone size={14} /> Inform Police
                        </button>
                      )}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Legend Overlay */}
            <div className="absolute top-4 right-4 z-[1000]">
              <div className="p-4 bg-obsidian/90 backdrop-blur-xl rounded-2xl border border-white/10 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-biolumeGreen shadow-[0_0_10px_#00FF85]" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_#F59E0B]" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Partially Damaged</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_#EF4444]" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Defected</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnostics */}
      <div className="bg-charcoal p-8 rounded-[2.5rem] border border-white/5 bg-gradient-to-r from-charcoal to-obsidian shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedCam.status === 'active' ? 'bg-biolumeGreen/10 text-biolumeGreen' : (selectedCam.status === 'partially-damaged' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500')
              }`}>
              <Cpu size={24} />
            </div>
            <div>
              <h3 className="font-black text-xl tracking-tight uppercase">{selectedCam.id} Diagnostics</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">{selectedCam.name}</p>
            </div>
          </div>
          <div className={`px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase border ${selectedCam.status === 'active' ? 'bg-biolumeGreen/10 border-biolumeGreen text-biolumeGreen' : (selectedCam.status === 'partially-damaged' ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-red-500/10 border-red-500 text-red-500')
            }`}>
            {selectedCam.status === 'active' ? 'OPERATIONAL' : (selectedCam.status === 'partially-damaged' ? 'DEGRADED' : 'SYSTEM FAILURE')}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white/[0.02] p-5 rounded-3xl border border-white/[0.03]">
            <div className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-2 flex items-center gap-2">
              <Thermometer size={14} className="text-amberEmber" /> Core Health
            </div>
            <div className="text-3xl font-black">{selectedCam.temp}</div>
          </div>
          <div className="bg-white/[0.02] p-5 rounded-3xl border border-white/[0.03]">
            <div className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-2 flex items-center gap-2">
              <Wifi size={14} className="text-electricTeal" /> Signal
            </div>
            <div className="text-3xl font-black">{selectedCam.signal}%</div>
          </div>
          <div className="bg-white/[0.02] p-5 rounded-3xl border border-white/[0.03]">
            <div className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-2 flex items-center gap-2">
              <Activity size={14} className="text-biolumeGreen" /> Uptime
            </div>
            <div className="text-3xl font-black">{selectedCam.uptime}</div>
          </div>
          <div className="bg-white/[0.02] p-5 rounded-3xl border border-white/[0.03]">
            <div className="text-[9px] text-gray-500 uppercase font-black tracking-widest mb-2 flex items-center gap-2">
              <Cpu size={14} className="text-electricTeal" /> Logic Unit
            </div>
            <div className="text-3xl font-black text-ellipsis overflow-hidden">{selectedCam.firmware}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Health;
