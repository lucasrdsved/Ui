import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppStore } from '../store';
import { useTimer } from '../hooks/useTimer';
import { useWakeLock } from '../hooks/useWakeLock';
import { playSound } from '../utils/sound';
import { triggerHaptic } from '../utils/haptics';
import { ChevronLeft, Info, SkipForward, Play, Pause, Star, CheckCircle, Home } from 'lucide-react';
import clsx from 'clsx';

export const WorkoutPlayer: React.FC = () => {
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const { workouts, exercises, addSession } = useAppStore();
  const { requestWakeLock, releaseWakeLock } = useWakeLock();

  const workout = workouts.find(w => w.id === workoutId);
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [phase, setPhase] = useState<'intro' | 'active' | 'rest' | 'finished'>('active');
  const [startTime] = useState(new Date());
  const [rating, setRating] = useState(0);
  
  const currentWorkoutExercise = workout?.exercises[currentExerciseIdx];
  const currentExerciseDetail = exercises.find(e => e.id === currentWorkoutExercise?.exerciseId);
  
  const { timeLeft, isRunning, startTimer, pauseTimer, stopTimer } = useTimer(0, () => {
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
       handleFinishWorkout();
     }
  };

  const handleFinishWorkout = () => {
    setPhase('finished');
    playSound('success');
    // Here you would typically save the session to the store
  };

  const skipRest = () => {
    stopTimer();
    if (currentWorkoutExercise && currentSet < currentWorkoutExercise.sets) {
        setPhase('active');
        setCurrentSet(s => s + 1);
    } else {
        const nextIdx = currentExerciseIdx + 1;
        if (nextIdx < (workout?.exercises.length || 0)) {
            setCurrentExerciseIdx(nextIdx);
            setCurrentSet(1);
            setPhase('active');
        } else {
            handleFinishWorkout();
        }
    }
  };

  const goToExerciseDetail = () => {
    if (currentExerciseDetail) {
      navigate(`/exercise/${currentExerciseDetail.id}`);
    }
  };

  if (!workout || !currentExerciseDetail) return <div className="p-8">Loading workout...</div>;

  if (phase === 'finished') {
    const durationMin = Math.round((new Date().getTime() - startTime.getTime()) / 60000);
    const calories = workout.calories || 200; // Mock calculation

    return (
      <div className="min-h-screen bg-white flex flex-col items-center p-8 relative overflow-hidden">
        {/* Background confetti effect placeholder */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 -z-10"></div>
        
        <div className="mt-12 mb-8">
           <div className="w-28 h-28 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-200 animate-bounce">
             <CheckCircle size={48} className="text-white" />
           </div>
           <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Workout Completed!</h1>
           <p className="text-gray-500 text-center">You crushed {workout.name}</p>
        </div>

        <div className="bg-white rounded-[2rem] p-6 w-full max-w-sm shadow-xl shadow-gray-100 mb-8 border border-gray-50">
           <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-orange-50 rounded-2xl p-4 text-center">
                 <span className="block text-2xl font-bold text-gray-900">{durationMin}</span>
                 <span className="text-xs font-medium text-orange-500 uppercase">Minutes</span>
              </div>
              <div className="bg-blue-50 rounded-2xl p-4 text-center">
                 <span className="block text-2xl font-bold text-gray-900">{calories}</span>
                 <span className="text-xs font-medium text-blue-500 uppercase">Calories</span>
              </div>
           </div>
           
           <div className="text-center">
             <p className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-wide">Rate your workout</p>
             <div className="flex justify-center gap-2">
               {[1, 2, 3, 4, 5].map((star) => (
                 <button 
                  key={star} 
                  onClick={() => { setRating(star); triggerHaptic('light'); }}
                  className="transition-transform active:scale-125"
                 >
                   <Star 
                     size={32} 
                     fill={star <= rating ? "#FFC107" : "none"} 
                     stroke={star <= rating ? "#FFC107" : "#E5E7EB"} 
                     strokeWidth={2}
                   />
                 </button>
               ))}
             </div>
           </div>
        </div>

        <button 
          onClick={() => navigate('/')} 
          className="w-full max-w-sm bg-black text-white py-5 rounded-[1.5rem] font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-gray-300 hover:bg-gray-800 transition-all active:scale-95"
        >
          <Home size={20} /> Back to Home
        </button>
      </div>
    );
  }

  const isResting = phase === 'rest';

  return (
    <div className="h-screen flex flex-col bg-gray-900 relative">
      {/* Background Image Area */}
      <div className="absolute top-0 left-0 w-full h-[65%] z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/10 z-10"></div>
        <img 
          src={currentExerciseDetail.imageUrl} 
          alt="Exercise" 
          className="w-full h-full object-cover"
        />
        
        {/* Top Controls */}
        <div className="absolute top-0 left-0 w-full p-6 pt-12 flex justify-between items-center z-20 text-white">
          <button onClick={() => navigate(-1)} className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={goToExerciseDetail}
            className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <Info size={24} />
          </button>
        </div>
      </div>

      {/* Bottom Sheet Card */}
      <div className="absolute bottom-0 left-0 w-full h-[45%] bg-white rounded-t-[2.5rem] z-30 flex flex-col px-8 pt-8 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
        
        {/* Handle bar for visual cue */}
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8"></div>

        <div className="flex justify-between items-start mb-4">
           <div>
             <h2 className="text-2xl font-bold text-gray-900 mb-1 leading-tight">{isResting ? 'Rest Time' : currentExerciseDetail.name}</h2>
             <p className="text-gray-500 font-medium text-sm">
                {isResting 
                  ? 'Take a breath and recover' 
                  : currentExerciseDetail.muscleGroup
                }
             </p>
           </div>
           <div className="flex flex-col items-end">
             <span className="text-3xl font-bold text-gray-900 leading-none">
               {currentExerciseIdx + 1}<span className="text-gray-400 text-lg font-medium">/{workout.exercises.length}</span>
             </span>
             <span className="text-xs text-gray-500 font-bold bg-gray-100 px-3 py-1 rounded-full mt-2 uppercase tracking-wide">
               Set {currentSet} of {currentWorkoutExercise?.sets}
             </span>
           </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 flex items-center justify-center py-2">
           {isResting ? (
             <div className="text-center w-full">
                <div className="text-7xl font-bold text-gray-900 font-mono tracking-tighter tabular-nums mb-2">
                  00:{timeLeft.toString().padStart(2, '0')}
                </div>
                <div className="flex items-center gap-2 justify-center text-orange-500 bg-orange-50 py-1 px-3 rounded-full inline-flex mx-auto">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                  <span className="font-bold uppercase text-xs tracking-widest">Resting</span>
                </div>
             </div>
           ) : (
             <div className="flex w-full gap-4">
                <div className="flex-1 bg-gray-50 border border-gray-100 rounded-3xl p-4 flex flex-col items-center justify-center">
                   <span className="text-gray-400 font-bold text-xs uppercase mb-1">Weight</span>
                   <span className="text-gray-900 font-bold text-2xl">{currentWorkoutExercise?.weightKg || 0} <span className="text-sm text-gray-400">kg</span></span>
                </div>
                <div className="flex-1 bg-gray-50 border border-gray-100 rounded-3xl p-4 flex flex-col items-center justify-center">
                   <span className="text-gray-400 font-bold text-xs uppercase mb-1">Reps</span>
                   <span className="text-gray-900 font-bold text-2xl">{currentWorkoutExercise?.reps}</span>
                </div>
             </div>
           )}
        </div>

        {/* Main Action Button */}
        <div className="mt-auto pt-4">
          {isResting ? (
            <button 
              onClick={skipRest}
              className="w-full bg-black text-white py-5 rounded-[1.8rem] font-bold text-lg flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors active:scale-98"
            >
              Skip Rest <SkipForward size={22} />
            </button>
          ) : (
             <button 
               onClick={handleFinishSet}
               className="w-full bg-[#000] text-white py-5 rounded-[1.8rem] font-bold text-lg flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors active:scale-98 shadow-lg shadow-gray-200"
             >
               Complete Set <CheckCircle size={22} />
             </button>
          )}
        </div>

      </div>
    </div>
  );
};