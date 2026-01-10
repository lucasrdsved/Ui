
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, User, BarChart2 } from 'lucide-react';
import clsx from 'clsx';
import { useAppStore } from '../store';
import { SyncManager } from './SyncManager';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { currentUser } = useAppStore();
  const isPlayer = location.pathname.includes('/play');
  const isChat = location.pathname.includes('/chat');

  if (isPlayer) {
    return (
      <div className="min-h-screen bg-white">
        <SyncManager />
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F2F4F8] font-inter">
      <SyncManager />
      <main className="flex-1 overflow-y-auto no-scrollbar">
        <div className="max-w-md mx-auto w-full min-h-screen pb-40">
          {children}
        </div>
      </main>

      {!isChat && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-sm z-50">
          <nav className="bg-black/95 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] px-6 py-3 flex items-center justify-between gap-1 border border-white/10 backdrop-blur-xl">
            <NavLink
              to="/"
              className={({ isActive }) =>
                clsx(
                  "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500",
                  isActive ? "bg-white text-black shadow-lg" : "text-gray-500"
                )
              }
            >
              <Home className="w-5 h-5" strokeWidth={3} />
            </NavLink>
            <NavLink
              to="/workouts"
              className={({ isActive }) =>
                clsx(
                  "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500",
                  isActive ? "bg-white text-black shadow-lg" : "text-gray-500"
                )
              }
            >
              <LayoutGrid className="w-5 h-5" strokeWidth={3} />
            </NavLink>
            <NavLink
              to="/assessment"
              className={({ isActive }) =>
                clsx(
                  "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500",
                  isActive ? "bg-white text-black shadow-lg" : "text-gray-500"
                )
              }
            >
              <BarChart2 className="w-5 h-5" strokeWidth={3} />
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                clsx(
                  "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-500 overflow-hidden border-2",
                  isActive ? "border-white" : "border-transparent"
                )
              }
            >
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img src={currentUser?.avatarUrl || "https://i.pravatar.cc/100?u=sandra"} className="w-full h-full object-cover" alt="perfil" />
              </div>
            </NavLink>
          </nav>
        </div>
      )}
    </div>
  );
};
