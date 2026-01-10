
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { Award, Activity, Calendar, RefreshCw, LogOut, ShieldCheck, ChevronRight, Edit3, Share2, Settings } from 'lucide-react';
import { triggerHaptic } from '../utils/haptics';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, toggleUserRole } = useAppStore();

  const handleToggle = () => {
    triggerHaptic('medium');
    toggleUserRole();
  };

  return (
    <div className="px-6 pt-16 pb-32 space-y-8 animate-in slide-in-from-right-8 duration-500">
      <div className="flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
           <ChevronRight size={20} className="rotate-180" />
        </button>
        <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest">Meu Perfil</h2>
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
           <Settings size={20} />
        </button>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-2xl">
              <img src={currentUser?.avatarUrl} alt="Perfil" className="w-full h-full object-cover" />
          </div>
          <button className="absolute -right-2 bottom-0 w-8 h-8 bg-black text-white rounded-full border-4 border-[#F2F4F8] flex items-center justify-center">
            <Edit3 size={12} />
          </button>
        </div>
        <h3 className="text-2xl font-black text-gray-900 mb-1 leading-none">{currentUser?.name}</h3>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">{currentUser?.location}</p>
        
        <div className="flex gap-6 mt-8">
           <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Seguindo</span>
              <span className="text-lg font-black text-gray-900">72</span>
           </div>
           <div className="w-px h-8 bg-gray-200 mt-2"></div>
           <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-gray-400 uppercase mb-1 tracking-widest">Seguidores</span>
              <span className="text-lg font-black text-gray-900">162</span>
           </div>
           <div className="flex items-center gap-2 ml-2">
              <button className="w-9 h-9 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-900"><Share2 size={16} /></button>
              <button className="w-9 h-9 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-900"><Edit3 size={16} /></button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
         <div className="bg-[#E7FFEF] p-4 rounded-[2rem] flex flex-col justify-between min-h-[110px] border border-white">
            <span className="text-[8px] font-black text-green-600 uppercase tracking-tight">Peso Inicial</span>
            <p className="text-lg font-black text-gray-900">53.3 <span className="text-[9px] font-bold text-gray-400">kg</span></p>
         </div>
         <div className="bg-[#E7F8FF] p-4 rounded-[2rem] flex flex-col justify-between min-h-[110px] border border-white">
            <span className="text-[8px] font-black text-blue-600 uppercase tracking-tight">Objetivo</span>
            <p className="text-lg font-black text-gray-900">50.0 <span className="text-[9px] font-bold text-gray-400">kg</span></p>
         </div>
         <div className="bg-[#FFF4E7] p-4 rounded-[2rem] flex flex-col justify-between min-h-[110px] border border-white">
            <span className="text-[8px] font-black text-orange-600 uppercase tracking-tight">Kcal Diárias</span>
            <p className="text-lg font-black text-gray-900">740 <span className="text-[9px] font-bold text-gray-400">kcal</span></p>
         </div>
      </div>

      <div className="space-y-3">
        {[
          { icon: Activity, label: 'Atividade física', desc: 'Há 2 dias' },
          { icon: Award, label: 'Estatísticas', desc: 'Ano: 109 km percorridos' },
          { icon: ShieldCheck, label: 'Rotas salvas', desc: '7 rotas disponíveis' },
          { icon: Calendar, label: 'Melhor tempo', desc: 'Ver histórico' },
        ].map((item, idx) => (
          <button 
            key={idx}
            className="w-full bg-white p-5 rounded-[2.2rem] flex items-center justify-between shadow-sm active:scale-[0.98] transition-all border border-gray-50"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-gray-50 flex items-center justify-center text-gray-900">
                <item.icon size={20} />
              </div>
              <div className="text-left">
                <p className="font-black text-sm text-gray-900">{item.label}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{item.desc}</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-200" />
          </button>
        ))}
      </div>

      <div className="pt-4 flex flex-col gap-4">
        <button 
          onClick={handleToggle}
          className="w-full bg-black text-white py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-black/20"
        >
          <RefreshCw size={18} /> Mudar para {currentUser?.type === 'student' ? 'Trainer' : 'Aluno'}
        </button>
        <button className="w-full bg-red-50 text-red-600 py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3">
          <LogOut size={18} /> Sair da Conta
        </button>
      </div>
    </div>
  );
};
