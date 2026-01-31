
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Dashboard from './pages/Dashboard';
import Health from './pages/Health';
import Incidents from './pages/Incidents';
import Dispatch from './pages/Dispatch';
import Analytics from './pages/Analytics';
import Vault from './pages/Vault';
import SettingsPage from './pages/Settings';
import Documentation from './pages/Documentation';
import Login from './pages/Login';
import OfficialRequests from './pages/OfficialRequests';
import OfficialAnalytics from './pages/OfficialAnalytics';
import OfficialVault from './pages/OfficialVault';
import OfficialResources from './pages/OfficialResources';
import IncidentForecasting from './pages/IncidentForecasting';
import { AppMode, UserRole, OfficialTask } from './types';
import { AlertTriangle, X } from 'lucide-react';

// Resolved incident type
export interface ResolvedIncident {
  id: string;
  type: string;
  zone: string;
  intensity: string;
  resolvedAt: string;
  resolvedBy: string;
  duration: string;
}

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<AppMode>('archive');
  const [userRole, setUserRole] = useState<UserRole>(() => {
    return (localStorage.getItem('pegasus_role') as UserRole) || null;
  });

  const [officialTasks, setOfficialTasks] = useState<OfficialTask[]>(() => {
    const saved = localStorage.getItem('pegasus_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [globalAlerts, setGlobalAlerts] = useState<{ id: string, message: string, node: string }[]>([
    { id: 'AL-102', message: 'CRITICAL: High-Impact Collision Detected - Expressway Zone', node: 'CAM-002' }
  ]);
  const [resolvedIncidents, setResolvedIncidents] = useState<ResolvedIncident[]>([]);

  useEffect(() => {
    if (userRole) {
      localStorage.setItem('pegasus_role', userRole);
    } else {
      localStorage.removeItem('pegasus_role');
    }
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem('pegasus_tasks', JSON.stringify(officialTasks));
  }, [officialTasks]);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(null);
  };

  const dismissAlert = (id: string) => {
    setGlobalAlerts(prev => prev.filter(a => a.id !== id));
  };

  const addResolvedIncident = (incident: ResolvedIncident) => {
    setResolvedIncidents(prev => [incident, ...prev]);
  };

  const addTaskForOfficial = (task: Omit<OfficialTask, 'status' | 'assignedAt'>) => {
    const newTask: OfficialTask = {
      ...task,
      status: 'pending',
      assignedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setOfficialTasks(prev => [newTask, ...prev]);
  };

  const completeOfficialTask = (taskId: string) => {
    setOfficialTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: 'completed', completedAt: new Date().toLocaleTimeString() } : t
    ));
    // Also remove from pending view eventually or keep for history
  };

  if (!userRole) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-obsidian text-white font-sans selection:bg-electricTeal/30">
        <Sidebar userRole={userRole} onLogout={handleLogout} />

        {/* Global High-Visibility Red Notification Layer */}
        {globalAlerts.length > 0 && userRole === 'admin' && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-3xl px-4 animate-in slide-in-from-top-10 duration-500">
            {globalAlerts.map(alert => (
              <div key={alert.id} className="bg-red-600 border-2 border-white/30 p-5 rounded-2xl shadow-[0_0_60px_rgba(220,38,38,0.6)] flex items-center justify-between gap-6 mb-4">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center animate-pulse shrink-0 border border-white/30">
                    <AlertTriangle className="text-white" size={32} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-black bg-white text-red-600 px-2 py-0.5 rounded tracking-widest">SYSTEM ALERT</span>
                      <span className="text-xs font-mono font-bold text-white/90">{alert.id}</span>
                    </div>
                    <p className="text-base font-black text-white leading-tight uppercase tracking-tight">{alert.message}</p>
                    <p className="text-[10px] text-white/70 font-mono mt-1 uppercase tracking-widest">Inference Node: {alert.node} • Priority: 0 (Immediate)</p>
                  </div>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="p-3 hover:bg-white/20 rounded-xl transition-all border border-transparent hover:border-white/20"
                >
                  <X className="text-white" size={24} />
                </button>
              </div>
            ))}
          </div>
        )}

        <main className="flex-1 ml-64 p-8 transition-all duration-300">
          <Routes>
            {userRole === 'admin' ? (
              <>
                <Route path="/" element={<Home appMode={appMode} setAppMode={setAppMode} />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/health" element={<Health onSendToOfficial={addTaskForOfficial} />} />
                <Route path="/incidents" element={<Incidents resolvedIncidents={resolvedIncidents} />} />
                <Route path="/forecasting" element={<IncidentForecasting />} />
                <Route path="/dispatch" element={<Dispatch setGlobalAlerts={setGlobalAlerts} addResolvedIncident={addResolvedIncident} />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/vault" element={<Vault />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              <>
                <Route path="/official/requests" element={<OfficialRequests tasks={officialTasks.filter(t => t.status === 'pending')} onComplete={completeOfficialTask} />} />
                <Route path="/official/analytics" element={<OfficialAnalytics />} />
                <Route path="/official/vault" element={<OfficialVault />} />
                <Route path="/official/resources" element={<OfficialResources />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/official/requests" replace />} />
              </>
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
