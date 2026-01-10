
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { Search, ChevronLeft, Filter, Dumbbell, Play } from 'lucide-react';
import clsx from 'clsx';

export const ExerciseLibrary: React.FC = () => {
  const navigate = useNavigate();
  const { exercises } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('Todos');

  const groups = ['Todos', 'Peitoral', 'Costas', 'Pernas', 'Ombros', 'Braços'];

  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroup === 'Todos' || ex.muscleGroup === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="min-h-screen bg-[#F2F4F8] pb-32 font-inter">
      <header className="bg-white p-6 pb-8 rounded-b-[2.5rem] shadow-sm mb-6 sticky top-0 z-20">
        <div className="flex items-center gap-4 mb-6">
           <button onClick={() => navigate(-1)} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
             <ChevronLeft size={20} />
           </button>
           <h1 className="text-xl font-black uppercase tracking-widest">Biblioteca</h1>
        </div>

        <div className="relative mb-6">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
           <input 
             type="text"
             placeholder="Buscar exercício ou máquina..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full bg-gray-100 rounded-2xl py-4 pl-12 pr-4 font-bold text-sm outline-none focus:ring-2 ring-black/5"
           />
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
           {groups.map(group => (
             <button
               key={group}
               onClick={() => setSelectedGroup(group)}
               className={clsx(
                 "px-5 py-2 rounded-full text-xs font-black whitespace-nowrap transition-all",
                 selectedGroup === group ? "bg-black text-white shadow-lg" : "bg-gray-100 text-gray-400"
               )}
             >
               {group}
             </button>
           ))}
        </div>
      </header>

      <div className="px-6 space-y-4">
        <div className="flex items-center justify-between px-2">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{filteredExercises.length} Exercícios encontrados</p>
           <Filter size={16} className="text-gray-400" />
        </div>

        <div className="grid grid-cols-1 gap-4">
           {filteredExercises.map(exercise => (
             <div 
               key={exercise.id}
               onClick={() => navigate(`/exercise/${exercise.id}`)}
               className="bg-white p-4 rounded-[2rem] flex items-center gap-4 shadow-sm border border-transparent hover:border-black/10 transition-all cursor-pointer group active:scale-[0.98]"
             >
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-inner">
                   <img src={exercise.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={exercise.name} />
                </div>
                <div className="flex-1">
                   <span className="text-[9px] font-black text-blue-500 uppercase mb-1 block tracking-wider">{exercise.muscleGroup}</span>
                   <h3 className="font-black text-gray-900 leading-tight mb-1">{exercise.name}</h3>
                   <div className="flex items-center gap-1">
                      <Dumbbell size={12} className="text-gray-300" />
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Equipamento Profissional</span>
                   </div>
                </div>
                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                   <Play size={14} fill="currentColor" className="ml-0.5" />
                </div>
             </div>
           ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="py-20 text-center space-y-4">
             <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Search size={32} className="text-gray-300" />
             </div>
             <p className="text-gray-400 font-bold">Nenhum exercício encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
};
