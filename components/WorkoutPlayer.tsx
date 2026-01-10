
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../store';
import { useTimer } from '../hooks/useTimer';
import { useWakeLock } from '../hooks/useWakeLock';
import { playSound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';
import { ChevronLeft, Info, Pause, CheckCircle, Flame, Star } from 'lucide-react';
import clsx from 'clsx';
import { WorkoutSession } from '../types';

export const WorkoutPlayer: React.FC = () => {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const { workouts, exercises, currentUser, addSession } = useAppStore();
  const { requestWakeLock, releaseWakeLock } = useWakeLock();

  const workout = workouts.find(w => w.id === workoutId);
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [phase, setPhase] = useState<'active' | 'rest' | 'finished'>('active');
  const [rating, setRating] = useState(0);
  const [sessionData] = useState<Omit<WorkoutSession, 'completedAt' | 'status'>>({
    id: Math.random().toString(36).substr(2, 9),
    workoutId: workoutId || '',
    studentId: currentUser?.id || '',
    startedAt: new Date().toISOString(),
    exercisesCompleted: []
  });
  
  const currentWorkoutExercise = workout?.exercises[currentExerciseIdx];
  const currentExerciseDetail = exercises.find(e => e.id === currentWorkoutExercise?.exerciseId);
  
  const { timeLeft, startTimer, stopTimer } = useTimer(0, () => {
    playSound('end');
    triggerHaptic('success');
    if (phase === 'rest') {
      handleNextSetOrExercise();
    }
  });

  useEffect(() => {
    requestWakeLock();
    return () => { releaseWakeLock(); };
  }, []);

  const handleFinishSet = () => {
    triggerHaptic('success');
    playSound('success');
    
    if (currentWorkoutExercise && currentSet < currentWorkoutExercise.sets) {
       setPhase('rest');
       startTimer(currentWorkoutExercise.restSeconds);
    } else {
       handleNextExercise();
    }
  };

  const handleNextSetOrExercise = () => {
    setPhase('active');
    setCurrentSet(prev => prev + 1);
    stopTimer();
  };

  const handleNextExercise = () => {
     if (!workout) return;
     const nextIdx = currentExerciseIdx + 1;
     if (nextIdx < workout.exercises.length) {
       setCurrentExerciseIdx(nextIdx);
       setCurrentSet(1);
       setPhase('rest');
       startTimer(workout.exercises[nextIdx].restSeconds);
     } else {
       finalizeSession();
     }
  };

  const finalizeSession = () => {
    setPhase('finished');
    playSound('success');
    
    const completedSession: WorkoutSession = {
        ...sessionData,
        completedAt: new Date().toISOString(),
        status: 'completed'
    };
    addSession(completedSession);
  };

  const skipRest = () => {
    stopTimer();
    if (currentWorkoutExercise && currentSet < currentWorkoutExercise.sets) {
        setPhase('active');
        setCurrentSet(s => s + 1);
    } else {
        handleNextExercise();
    }
  };

  if (!workout || !currentExerciseDetail) return null;

  if (phase === 'finished') {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center px-8 py-12 animate-in zoom-in duration-500">
        <div className="w-full flex-1 flex flex-col items-center justify-center space-y-8">
           <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-200 animate-bounce">
             <CheckCircle size={64} className="text-white" />
           </div>
           <div className="text-center space-y-2">
             <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Muito Bom!</h1>
             <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Treino Finalizado</p>
           </div>
           
           <div className="bg-gray-50 rounded-[2.5rem] p-8 w-full max-w-sm grid grid-cols-2 gap-4">
              <div className="text-center">
                 <p className="text-3xl font-black text-gray-900">{workout.calories}</p>
                 <p className="text-[10px] font-black text-gray-400 uppercase">Kcal Queimadas</p>
              </div>
              <div className="text-center">
                 <p className="text-3xl font-black text-gray-900">{workout.estimatedDurationMin}</p>
                 <p className="text-[10px] font-black text-gray-400 uppercase">Minutos</p>
              </div>
           </div>

           <div className="flex gap-2">
             {[1, 2, 3, 4, 5].map(s => (
               <Star key={s} size={32} className={clsx("transition-all", rating >= s ? "text-yellow-400 fill-yellow-400 scale-110" : "text-gray-200")} onClick={() => setRating(s)} />
             ))}
           </div>
        </div>

        <button 
          onClick={() => navigate('/')} 
          className="w-full bg-black text-white py-6 rounded-[2.5rem] font-black text-lg shadow-xl shadow-black/20 mb-8"
        >
          Voltar ao Início
        </button>
      </div>
    );
  }

  const progress = phase === 'rest' ? (timeLeft / (currentWorkoutExercise?.restSeconds || 30)) * 100 : 0;

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden font-inter">
      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8 relative">
        <header className="absolute top-12 left-0 w-full px-8 flex justify-between items-center z-20">
          <button onClick={() => navigate(-1)} className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center active:scale-90 transition-transform">
            <ChevronLeft size={24} className="text-gray-900" />
          </button>
          <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tiffany Way</h2>
          <button className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center active:scale-90 transition-transform">
            <Info size={24} className="text-gray-900" />
          </button>
        </header>

        <div className="text-center">
          <h1 className="text-3xl font-black text-gray-900 mb-2 leading-tight uppercase tracking-tighter">{workout.name}</h1>
          <div className="flex items-center justify-center gap-2">
            <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
               <div className="h-full bg-black transition-all" style={{ width: `${((currentExerciseIdx + 1) / workout.exercises.length) * 100}%` }}></div>
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase">{currentExerciseIdx + 1} de {workout.exercises.length}</span>
          </div>
        </div>

        <div className="relative w-72 h-72 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90">
             <circle cx="144" cy="144" r="130" stroke="#F2F4F8" strokeWidth="6" fill="transparent" />
             <circle 
                cx="144" cy="144" r="130" stroke="black" strokeWidth="6" fill="transparent"
                strokeDasharray="816.8" 
                strokeDashoffset={816.8 - (816.8 * (phase === 'rest' ? progress : 100) / 100)}
                className="transition-all duration-1000 ease-linear"
             />
          </svg>
          
          <div className="relative z-10 w-full h-full p-10">
             <img 
               src={currentExerciseDetail.imageUrl} 
               alt="Exercício" 
               className="w-full h-full object-cover rounded-full shadow-2xl"
             />
          </div>
          
          {phase === 'rest' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm rounded-full animate-in fade-in zoom-in">
              <span className="text-xs font-black text-gray-400 uppercase mb-1 tracking-widest">Descanso</span>
              <span className="text-6xl font-black text-gray-900 tabular-nums">00:{timeLeft.toString().padStart(2, '0')}</span>
            </div>
          )}
        </div>

        <div className="text-center max-w-xs">
           <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tighter">{currentExerciseDetail.name}</h3>
           <p className="text-[11px] font-bold text-gray-400 uppercase leading-relaxed tracking-tight">
             Foco na contração muscular e controle do movimento. Mantenha a postura.
           </p>
        </div>
      </div>

      <div className="p-8 pb-12 bg-white flex flex-col space-y-6">
        <div className="flex items-center justify-between px-2">
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Calorias</span>
              <div className="flex items-center gap-1.5">
                <Flame size={16} className="text-orange-500" fill="currentColor" />
                <span className="text-xl font-black text-gray-900">{workout.calories} kcal</span>
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              <div className="bg-gray-50 px-5 py-3 rounded-2xl flex flex-col items-center">
                <span className="text-[9px] font-black text-gray-400 uppercase mb-1">Séries</span>
                <span className="text-sm font-black text-gray-900">{currentSet}/{currentWorkoutExercise?.sets}</span>
              </div>
              <div className="bg-gray-50 px-5 py-3 rounded-2xl flex flex-col items-center">
                <span className="text-[9px] font-black text-gray-400 uppercase mb-1">Reps</span>
                <span className="text-sm font-black text-gray-900">{currentWorkoutExercise?.reps}</span>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="flex-1 bg-black text-white h-20 rounded-[2.5rem] font-black text-lg flex items-center justify-center shadow-xl shadow-black/20 active:scale-95 transition-all uppercase tracking-widest" onClick={phase === 'rest' ? skipRest : handleFinishSet}>
            {phase === 'rest' ? 'Pular Descanso' : 'Concluir Série'}
          </button>
          <button className="w-20 h-20 bg-gray-100 text-gray-900 rounded-full flex items-center justify-center active:scale-95 transition-all">
             <Pause size={28} fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
};
