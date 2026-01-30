
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../constants';

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-charcoal border-r border-electricTeal/10 flex flex-col z-50">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-electricTeal rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,232,255,0.4)]">
            <span className="text-obsidian font-bold text-xl">C</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Civic<span className="text-electricTeal">Logic</span></h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em]">Smart City Intelligence</p>
          </div>
        </div>

        <nav className="space-y-1">
          {NAVIGATION_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive 
                  ? 'bg-electricTeal/10 text-electricTeal border border-electricTeal/20' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className={`${isActive ? 'text-electricTeal' : 'text-gray-500 group-hover:text-electricTeal'} transition-colors`}>
                  {item.icon}
                </span>
                <span className="font-medium text-sm">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-electricTeal shadow-[0_0_8px_rgba(0,232,255,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8">
        <div className="p-4 bg-obsidian rounded-xl border border-white/5">
          <p className="text-xs text-gray-500 mb-1">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-biolumeGreen animate-pulse" />
            <span className="text-xs font-semibold text-biolumeGreen">Operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
