
import React, { useEffect } from 'react';
import { useAppStore } from '../store';
import { CloudOff, CloudLightning, CheckCircle2 } from 'lucide-react';

export const SyncManager: React.FC = () => {
  const { isOnline, setOnlineStatus, syncQueue, processSync } = useAppStore();

  useEffect(() => {
    const handleOnline = () => {
      setOnlineStatus(true);
      processSync();
    };
    const handleOffline = () => setOnlineStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
        <CloudOff size={16} />
        <span className="text-[10px] font-black uppercase tracking-widest">Modo Offline Ativo</span>
      </div>
    );
  }

  if (syncQueue.length > 0) {
    return (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
        <CloudLightning size={16} className="animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest">Sincronizando Dados ({syncQueue.length})</span>
      </div>
    );
  }

  return null;
};
