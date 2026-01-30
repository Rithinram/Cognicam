
export type AppMode = 'archive' | 'live';

export interface Camera {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'warning';
  uptime: string;
  signal: number;
  lat: number;
  lng: number;
}

export interface Incident {
  id: string;
  type: string;
  timestamp: string;
  severity: 'Safe' | 'Warning' | 'Danger';
  location: string;
  evidenceUrl: string;
}

export interface DispatchLog {
  id: string;
  timestamp: string;
  status: string;
  recipient: string;
  eta?: string;
}
