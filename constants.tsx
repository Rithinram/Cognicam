
import React from 'react';
import {
  ShieldAlert, Video, LayoutDashboard, Activity, Send,
  FileBarChart, Lock, Settings, BookOpen, TrendingUp
} from 'lucide-react';

export const COLORS = {
  obsidian: '#0D1117',
  charcoal: '#161B22',
  electricTeal: '#00E8FF',
  biolumeGreen: '#00FF85',
  amberEmber: '#FFB800',
  neonCrimson: '#FF1F8A',
};

export const NAVIGATION_ITEMS = [
  { name: 'Home', path: '/', icon: <Activity size={20} /> },
  { name: 'Video Upload', path: '/upload', icon: <Video size={20} /> },
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { name: 'Camera Health', path: '/health', icon: <Activity size={20} /> },
  { name: 'Incidents', path: '/incidents', icon: <ShieldAlert size={20} /> },
  { name: 'Incident Forecasting', path: '/forecasting', icon: <TrendingUp size={20} /> },
  { name: 'Emergency Dispatch', path: '/dispatch', icon: <Send size={20} /> },
  { name: 'Analytics', path: '/analytics', icon: <FileBarChart size={20} /> },
  { name: 'Evidence Vault', path: '/vault', icon: <Lock size={20} /> },
  { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
];

export const OFFICIAL_NAVIGATION_ITEMS = [
  { name: 'Requests', path: '/official/requests', icon: <Activity size={20} /> },
  { name: 'Service Metrics', path: '/official/analytics', icon: <FileBarChart size={20} /> },
  { name: 'Evidence Vault', path: '/official/vault', icon: <Lock size={20} /> },
  { name: 'Resource Management', path: '/official/resources', icon: <LayoutDashboard size={20} /> },
  { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
];

// India States with center coordinates
export const INDIA_STATES = [
  { name: 'Karnataka', lat: 15.3173, lng: 75.7139 },
  { name: 'Maharashtra', lat: 19.7515, lng: 75.7139 },
  { name: 'Tamil Nadu', lat: 11.1271, lng: 78.6569 },
  { name: 'Kerala', lat: 10.8505, lng: 76.2711 },
  { name: 'Telangana', lat: 18.1124, lng: 79.0193 },
  { name: 'Andhra Pradesh', lat: 15.9129, lng: 79.7400 },
  { name: 'Gujarat', lat: 22.2587, lng: 71.1924 },
  { name: 'Rajasthan', lat: 27.0238, lng: 74.2179 },
  { name: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { name: 'Delhi', lat: 28.7041, lng: 77.1025 },
];

// Districts by state with coordinates
export const DISTRICTS_BY_STATE: { [key: string]: { name: string; lat: number; lng: number }[] } = {
  'Karnataka': [
    { name: 'Bengaluru Urban', lat: 12.9716, lng: 77.5946 },
    { name: 'Mysuru', lat: 12.2958, lng: 76.6394 },
    { name: 'Mangaluru', lat: 12.9141, lng: 74.8560 },
    { name: 'Hubli-Dharwad', lat: 15.3647, lng: 75.1240 },
    { name: 'Belagavi', lat: 15.8497, lng: 74.4977 },
  ],
  'Maharashtra': [
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Pune', lat: 18.5204, lng: 73.8567 },
    { name: 'Nagpur', lat: 21.1458, lng: 79.0882 },
    { name: 'Nashik', lat: 19.9975, lng: 73.7898 },
    { name: 'Thane', lat: 19.2183, lng: 72.9781 },
  ],
  'Tamil Nadu': [
    { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
    { name: 'Coimbatore', lat: 11.0168, lng: 76.9558 },
    { name: 'Madurai', lat: 9.9252, lng: 78.1198 },
    { name: 'Tiruchirappalli', lat: 10.7905, lng: 78.7047 },
    { name: 'Salem', lat: 11.6643, lng: 78.1460 },
  ],
  'Kerala': [
    { name: 'Thiruvananthapuram', lat: 8.5241, lng: 76.9366 },
    { name: 'Kochi', lat: 9.9312, lng: 76.2673 },
    { name: 'Kozhikode', lat: 11.2588, lng: 75.7804 },
    { name: 'Thrissur', lat: 10.5276, lng: 76.2144 },
    { name: 'Kannur', lat: 11.8745, lng: 75.3704 },
  ],
  'Telangana': [
    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
    { name: 'Warangal', lat: 17.9784, lng: 79.5941 },
    { name: 'Nizamabad', lat: 18.6725, lng: 78.0941 },
    { name: 'Karimnagar', lat: 18.4386, lng: 79.1288 },
    { name: 'Khammam', lat: 17.2473, lng: 80.1514 },
  ],
  'Andhra Pradesh': [
    { name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185 },
    { name: 'Vijayawada', lat: 16.5062, lng: 80.6480 },
    { name: 'Guntur', lat: 16.3067, lng: 80.4365 },
    { name: 'Tirupati', lat: 13.6288, lng: 79.4192 },
    { name: 'Nellore', lat: 14.4426, lng: 79.9865 },
  ],
  'Gujarat': [
    { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
    { name: 'Surat', lat: 21.1702, lng: 72.8311 },
    { name: 'Vadodara', lat: 22.3072, lng: 73.1812 },
    { name: 'Rajkot', lat: 22.3039, lng: 70.8022 },
    { name: 'Gandhinagar', lat: 23.2156, lng: 72.6369 },
  ],
  'Rajasthan': [
    { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
    { name: 'Jodhpur', lat: 26.2389, lng: 73.0243 },
    { name: 'Udaipur', lat: 24.5854, lng: 73.7125 },
    { name: 'Kota', lat: 25.2138, lng: 75.8648 },
    { name: 'Ajmer', lat: 26.4499, lng: 74.6399 },
  ],
  'Uttar Pradesh': [
    { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
    { name: 'Kanpur', lat: 26.4499, lng: 80.3319 },
    { name: 'Varanasi', lat: 25.3176, lng: 82.9739 },
    { name: 'Agra', lat: 27.1767, lng: 78.0081 },
    { name: 'Noida', lat: 28.5355, lng: 77.3910 },
  ],
  'Delhi': [
    { name: 'Central Delhi', lat: 28.6448, lng: 77.2167 },
    { name: 'South Delhi', lat: 28.5244, lng: 77.2090 },
    { name: 'North Delhi', lat: 28.7325, lng: 77.1994 },
    { name: 'East Delhi', lat: 28.6280, lng: 77.2950 },
    { name: 'West Delhi', lat: 28.6517, lng: 77.0568 },
  ],
};

export const MOCK_CAMERAS = [
  { id: 'CAM-001', name: 'MG Road Junction', status: 'active', uptime: '99.9%', signal: 94, lat: 12.9750, lng: 77.6060, temp: '32°C', health: 'A+', firmware: 'v2.4.1' },
  { id: 'CAM-002', name: 'Koramangala Signal', status: 'warning', uptime: '85.2%', signal: 42, lat: 12.9352, lng: 77.6245, temp: '48°C', health: 'C-', firmware: 'v2.3.8' },
  { id: 'CAM-003', name: 'Indiranagar Metro', status: 'active', uptime: '99.7%', signal: 98, lat: 12.9784, lng: 77.6408, temp: '29°C', health: 'A', firmware: 'v2.4.1' },
  { id: 'CAM-004', name: 'Whitefield Tech Park', status: 'active', uptime: '97.5%', signal: 88, lat: 12.9698, lng: 77.7500, temp: '35°C', health: 'A-', firmware: 'v2.4.0' },
  { id: 'CAM-005', name: 'Electronic City Gate', status: 'active', uptime: '98.8%', signal: 91, lat: 12.8459, lng: 77.6602, temp: '31°C', health: 'A', firmware: 'v2.4.1' },
  { id: 'CAM-006', name: 'Majestic Bus Stand', status: 'warning', uptime: '92.1%', signal: 67, lat: 12.9767, lng: 77.5713, temp: '42°C', health: 'B', firmware: 'v2.3.9' },
];
