import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, BarChart2, User, PlayCircle } from 'lucide-react';
import clsx from 'clsx';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isPlayer = location.pathname.includes('/play');

  if (isPlayer) {
    return <div className="min-h-screen bg-white">{children}</div>;
  }

  const NavItem = ({ to, icon: Icon }: { to: string, icon: any }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300",
          isActive ? "bg-black text-white shadow-lg shadow-black/20" : "text-gray-400 hover:text-gray-600"
        )
      }
    >
      <Icon className="w-6 h-6" strokeWidth={2.5} />
    </NavLink>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F2F4F8]">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-32 no-scrollbar">
        <div className="max-w-md mx-auto w-full">
          {children}
        </div>
      </main>

      {/* Floating Bottom Navigation */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 px-6 py-3 z-50 flex items-center justify-between gap-6 w-[90%] max-w-sm border border-white/50 backdrop-blur-sm">
        <NavItem to="/" icon={Home} />
        <NavItem to="/workouts" icon={LayoutGrid} />
        <div className="w-px h-6 bg-gray-100 mx-1"></div>
        <NavItem to="/stats" icon={BarChart2} />
        <NavItem to="/profile" icon={User} />
      </nav>
    </div>
  );
};