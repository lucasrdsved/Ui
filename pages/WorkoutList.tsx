
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { Play, Clock, Zap, Target } from 'lucide-react';
import clsx from 'clsx';

export const WorkoutList: React.FC = () => {
  const { workouts } = useAppStore();
  const navigate = useNavigate();

  return (
    <div className="px-6 pt-16 pb-32 space-y-6 animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex flex-col gap-1 mb-8">
        <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Programas</h2>
        <p className="text-sm font-bold text-gray-400">Escolha seu objetivo para hoje</p>
      </div>

      <div className="space-y-4">
        {workouts.map(workout => (
          <div 
            key={workout.id}
            onClick={() => navigate(`/play/${workout.id}`)}
            className="group bg-white rounded-[2.5rem] p-4 flex items-center gap-5 shadow-sm border border-transparent hover:border-gray-100 hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-500 cursor-pointer active:scale-[0.98]"
          >
             <div className={clsx(
               "w-24 h-24 rounded-3xl flex items-center justify-center shrink-0 shadow-inner relative overflow-hidden transition-transform group-hover:scale-105",
               workout.category === 'yoga' ? "bg-orange-50 text-orange-400" :
               workout.category === 'balance' ? "bg-blue-50 text-blue-400" :
               "bg-purple-50 text-purple-400"
             )}>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <Target size={36} className="relative z-10" />
             </div>

             <div className="flex-1">
               <div className="flex flex-col mb-3">
                 <h3 className="font-black text-gray-900 text-xl leading-none mb-1">{workout.name}</h3>
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tiffany Way</span>
               </div>
               
               <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full">
                    <Clock size={12} className="text-gray-400" />
                    <span className="text-[10px] font-black text-gray-600">{workout.estimatedDurationMin}m</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-full">
                    <Zap size={12} className="text-orange-400" />
                    <span className="text-[10px] font-black text-gray-600">{workout.difficulty === 'Hard' ? 'Intenso' : 'Moderado'}</span>
                  </div>
               </div>
             </div>

             <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center shadow-lg shadow-black/20 group-hover:rotate-12 transition-all">
               <Play size={18} fill="white" className="ml-1" />
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
