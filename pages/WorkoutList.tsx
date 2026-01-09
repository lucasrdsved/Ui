import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { Play, Clock, ChevronRight, Zap } from 'lucide-react';
import clsx from 'clsx';

export const WorkoutList: React.FC = () => {
  const { workouts } = useAppStore();
  const navigate = useNavigate();

  return (
    <div className="px-6 pt-12 pb-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">All Programs</h2>
      </div>

      <div className="space-y-4">
        {workouts.map(workout => (
          <div 
            key={workout.id}
            onClick={() => navigate(`/play/${workout.id}`)}
            className="bg-white rounded-[2rem] p-4 flex items-center gap-4 shadow-sm border border-gray-100 cursor-pointer active:scale-[0.98] transition-all"
          >
             <div className={clsx(
               "w-20 h-20 rounded-2xl flex items-center justify-center shrink-0",
               workout.category === 'yoga' ? "bg-orange-100 text-orange-500" :
               workout.category === 'balance' ? "bg-blue-100 text-blue-500" :
               "bg-pink-100 text-pink-500"
             )}>
                <Zap size={28} fill="currentColor" />
             </div>

             <div className="flex-1">
               <div className="flex justify-between items-start">
                 <h3 className="font-bold text-gray-900 text-lg mb-1">{workout.name}</h3>
               </div>
               <p className="text-gray-400 text-xs mb-2 line-clamp-1">{workout.description}</p>
               <div className="flex items-center gap-3 text-xs font-medium text-gray-500">
                  <span className="flex items-center gap-1"><Clock size={12} /> {workout.estimatedDurationMin} min</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>{workout.difficulty}</span>
               </div>
             </div>

             <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-900">
               <Play size={16} fill="currentColor" />
             </button>
          </div>
        ))}
      </div>
    </div>
  );
};