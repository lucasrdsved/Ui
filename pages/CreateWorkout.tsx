
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { ChevronLeft, Plus, Trash2, Dumbbell, Save } from 'lucide-react';
import clsx from 'clsx';
import { Workout, WorkoutExercise } from '../types';

export const CreateWorkout: React.FC = () => {
  const navigate = useNavigate();
  const { createWorkout, currentUser, exercises } = useAppStore();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<Workout['difficulty']>('Medium');
  const [category, setCategory] = useState<Workout['category']>('strength');
  const [duration, setDuration] = useState(45);
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleSave = () => {
    if (!currentUser || !name) return;
    
    const newWorkout: Workout = {
      id: Math.random().toString(36).substr(2, 9),
      trainerId: currentUser.id,
      name,
      description,
      exercises: selectedExercises,
      estimatedDurationMin: duration,
      category,
      difficulty,
      calories: duration * 6,
      startTime: 'Livre',
      location: 'Academia'
    };

    createWorkout(newWorkout);
    navigate('/');
  };

  const addExercise = (exerciseId: string) => {
    const newExercise: WorkoutExercise = {
      id: Math.random().toString(36).substr(2, 9),
      exerciseId,
      sets: 3,
      reps: 12,
      restSeconds: 60,
      weightKg: 0,
      order: selectedExercises.length + 1
    };
    setSelectedExercises([...selectedExercises, newExercise]);
    setIsSelecting(false);
  };

  if (isSelecting) {
    return (
      <div className="min-h-screen bg-white p-6 pb-safe font-inter">
        <div className="flex items-center gap-4 mb-8">
           <button onClick={() => setIsSelecting(false)} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
             <ChevronLeft size={20} />
           </button>
           <h2 className="text-xl font-black uppercase tracking-tighter">Escolher Exercício</h2>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {exercises.map(ex => (
            <div key={ex.id} onClick={() => addExercise(ex.id)} className="p-4 rounded-[2rem] border border-gray-100 flex items-center gap-4 active:bg-gray-50 cursor-pointer transition-all">
               <img src={ex.imageUrl} className="w-16 h-16 object-cover rounded-2xl shadow-sm" alt={ex.name} />
               <div>
                  <p className="font-black text-gray-900 leading-tight mb-1">{ex.name}</p>
                  <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{ex.muscleGroup}</p>
               </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F4F8] pb-32 font-inter">
      <header className="bg-white p-6 pb-10 rounded-b-[2.5rem] shadow-sm mb-6">
        <div className="flex items-center justify-between mb-8">
           <button onClick={() => navigate(-1)} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
             <ChevronLeft size={20} />
           </button>
           <h1 className="text-[11px] font-black uppercase tracking-widest text-gray-900">Novo Programa</h1>
           <button onClick={handleSave} disabled={!name} className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center disabled:opacity-50 shadow-lg">
             <Save size={20} />
           </button>
        </div>
        
        <div className="space-y-4 px-2">
          <input 
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nome do Treino"
            className="w-full text-3xl font-black bg-transparent outline-none placeholder:text-gray-200 uppercase tracking-tighter"
          />
          <input 
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Breve descrição dos objetivos..."
            className="w-full text-sm font-bold bg-transparent outline-none text-gray-400"
          />
        </div>
      </header>

      <div className="px-6 space-y-6">
        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-50 shadow-sm">
           <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-5">Configurações Gerais</h3>
           <div className="flex flex-wrap gap-2 mb-6">
              {[
                { id: 'strength', label: 'Musculação' },
                { id: 'cardio', label: 'Cardio' },
                { id: 'yoga', label: 'Flexibilidade' },
              ].map(c => (
                <button 
                  key={c.id}
                  onClick={() => setCategory(c.id as any)}
                  className={clsx("px-5 py-2.5 rounded-full text-xs font-black transition-all", category === c.id ? "bg-black text-white shadow-lg" : "bg-gray-100 text-gray-400")}
                >
                  {c.label}
                </button>
              ))}
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Duração (min)</label>
                 <input type="number" value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full bg-gray-50 rounded-2xl p-4 font-black text-gray-900 outline-none" />
              </div>
              <div>
                 <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Intensidade</label>
                 <select value={difficulty} onChange={e => setDifficulty(e.target.value as any)} className="w-full bg-gray-50 rounded-2xl p-4 font-black text-gray-900 text-sm outline-none appearance-none">
                    <option value="Light">Leve</option>
                    <option value="Medium">Moderada</option>
                    <option value="Hard">Intensa</option>
                 </select>
              </div>
           </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Lista de Exercícios</h3>
             <button onClick={() => setIsSelecting(true)} className="flex items-center gap-1.5 text-[11px] font-black text-blue-500 uppercase tracking-widest">
               <Plus size={16} /> Adicionar
             </button>
          </div>
          
          {selectedExercises.map((item, idx) => {
            const ex = exercises.find(e => e.id === item.exerciseId);
            return (
              <div key={item.id} className="bg-white p-5 rounded-[2.5rem] flex items-center gap-4 animate-in slide-in-from-bottom-2 border border-gray-50 shadow-sm">
                 <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 shadow-sm">
                    <img src={ex?.imageUrl} className="w-full h-full object-cover" alt="" />
                 </div>
                 <div className="flex-1 min-w-0">
                    <h4 className="font-black text-sm text-gray-900 leading-tight mb-2 truncate">{ex?.name}</h4>
                    <div className="flex gap-2">
                       <div className="flex items-center bg-gray-50 rounded-xl px-2">
                          <input 
                            type="number" 
                            value={item.sets} 
                            onChange={(e) => {
                               const newEx = [...selectedExercises];
                               newEx[idx].sets = Number(e.target.value);
                               setSelectedExercises(newEx);
                            }}
                            className="w-10 bg-transparent text-center text-xs font-black p-2 outline-none"
                          />
                          <span className="text-[8px] font-black text-gray-400 uppercase pr-1">Séries</span>
                       </div>
                       <div className="flex items-center bg-gray-50 rounded-xl px-2">
                          <input 
                            type="number" 
                            value={item.reps} 
                            onChange={(e) => {
                               const newEx = [...selectedExercises];
                               newEx[idx].reps = Number(e.target.value);
                               setSelectedExercises(newEx);
                            }}
                            className="w-10 bg-transparent text-center text-xs font-black p-2 outline-none"
                          />
                          <span className="text-[8px] font-black text-gray-400 uppercase pr-1">Reps</span>
                       </div>
                    </div>
                 </div>
                 <button 
                    onClick={() => setSelectedExercises(selectedExercises.filter(e => e.id !== item.id))}
                    className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center active:bg-red-100 transition-colors"
                 >
                    <Trash2 size={18} />
                 </button>
              </div>
            );
          })}
          
          {selectedExercises.length === 0 && (
            <div onClick={() => setIsSelecting(true)} className="border-2 border-dashed border-gray-200 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-gray-400 gap-3 cursor-pointer hover:bg-white/50 transition-colors">
               <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                  <Dumbbell size={24} />
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest">Comece adicionando exercícios</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
