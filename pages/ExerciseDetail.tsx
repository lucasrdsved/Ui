import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { ChevronLeft, PlayCircle, Info } from 'lucide-react';
import clsx from 'clsx';

export const ExerciseDetail: React.FC = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const { exercises } = useAppStore();
  
  const exercise = exercises.find(e => e.id === exerciseId);

  if (!exercise) return <div className="p-8">Exercise not found</div>;

  return (
    <div className="min-h-screen bg-white pb-safe">
      {/* Header Image/Video Area */}
      <div className="relative h-72 w-full bg-gray-100">
        <img 
          src={exercise.imageUrl} 
          alt={exercise.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20"></div>
        
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-12 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
             <PlayCircle size={40} className="text-white fill-white/20" />
          </div>
        </div>
      </div>

      <div className="p-6 -mt-6 bg-white rounded-t-[2rem] relative z-10 min-h-[calc(100vh-16rem)]">
        <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-6"></div>
        
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
          {exercise.muscleGroup}
        </span>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{exercise.name}</h1>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-8 border-b border-gray-100 pb-6">
           <span className="flex items-center gap-1"><Info size={16} /> Detail View</span>
           <span>•</span>
           <span>Video Demonstration</span>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Instructions</h3>
            <p className="text-gray-600 leading-relaxed">
              {exercise.description}
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Keep your back straight and core engaged throughout the movement. Breathe in as you lower/relax, and breathe out as you exert force.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Target Muscles</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium text-gray-700">{exercise.muscleGroup}</span>
              <span className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium text-gray-700">Core Stabilizers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};