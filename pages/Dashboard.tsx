import React from 'react';
import { useAppStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Share, Edit2 } from 'lucide-react';
import clsx from 'clsx';

export const Dashboard: React.FC = () => {
  const { workouts, currentUser, users } = useAppStore();
  const navigate = useNavigate();

  // Helper for generating calendar days
  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - today.getDay() + i); // Start from Sunday
    return {
      date: d.getDate(),
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      isToday: d.getDate() === today.getDate()
    };
  });

  return (
    <div className="px-6 pt-12 pb-6 space-y-8">
      {/* Header */}
      <header className="flex justify-between items-start">
        <div className="flex gap-4">
           <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
             <img src={currentUser?.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
           </div>
           <div>
             <h1 className="text-xl font-bold text-gray-900">Hello, {currentUser?.name.split(' ')[0]}</h1>
             <p className="text-sm text-gray-400">Today {today.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}.</p>
           </div>
        </div>
        <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center bg-white shadow-sm">
          <Search size={20} className="text-gray-900" />
        </button>
      </header>

      {/* Daily Challenge Banner */}
      <div className="relative bg-[#9C67F9] rounded-[2.5rem] p-6 text-white shadow-lg shadow-purple-200 overflow-hidden">
        {/* Abstract 3D shapes simulation using CSS circles */}
        <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-yellow-400 rounded-full mix-blend-overlay opacity-50 blur-2xl"></div>
        <div className="absolute bottom-[-10px] right-[40px] w-24 h-24 bg-pink-400 rounded-full mix-blend-overlay opacity-50 blur-xl"></div>
        
        <div className="relative z-10 w-2/3">
          <h2 className="text-2xl font-bold leading-tight mb-2">Daily challenge</h2>
          <p className="text-purple-100 text-xs mb-4">Do your plan before 09:00 AM</p>
          
          <div className="flex -space-x-3 mt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-[#9C67F9] bg-gray-200 overflow-hidden">
                <img src={`https://i.pravatar.cc/100?img=${10+i}`} alt="user" />
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-[#9C67F9] bg-[#8B5CF6] flex items-center justify-center text-[10px] font-bold">
              +4
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Strip */}
      <div className="flex justify-between items-center overflow-x-auto no-scrollbar gap-2 py-2">
        {weekDays.map((d, i) => (
          <div 
            key={i}
            className={clsx(
              "flex flex-col items-center justify-center min-w-[50px] h-[80px] rounded-[2rem] transition-all cursor-pointer",
              d.isToday ? "bg-black text-white shadow-lg" : "bg-white text-gray-400 border border-gray-100"
            )}
          >
            <span className="text-xs font-medium mb-1">{d.day}</span>
            <span className={clsx("text-lg font-bold", d.isToday ? "text-white" : "text-gray-900")}>{d.date}</span>
            {d.isToday && <div className="w-1 h-1 bg-white rounded-full mt-1"></div>}
          </div>
        ))}
      </div>

      {/* "Your plan" Section */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Your plan</h3>
        <div className="grid grid-cols-2 gap-4">
           {workouts.map((workout, index) => {
             // Dynamic styling based on category
             const isYoga = workout.category === 'yoga';
             const isBalance = workout.category === 'balance';
             const isCardio = workout.category === 'cardio';
             
             let bgClass = "bg-white";
             let textClass = "text-gray-900";
             let subTextClass = "text-gray-500";
             let badgeBg = "bg-white/30";
             let badgeText = "text-gray-900";

             if (isYoga) {
                bgClass = "bg-[#FFC078]"; // Orange
                badgeBg = "bg-white/40";
             } else if (isBalance) {
                bgClass = "bg-[#AECBFA]"; // Blue
                badgeBg = "bg-white/40";
             } else if (isCardio) {
                bgClass = "bg-[#F472B6]"; // Pink
                textClass = "text-white";
                subTextClass = "text-white/80";
                badgeBg = "bg-white/20";
                badgeText = "text-white";
             }

             return (
               <div 
                 key={workout.id} 
                 onClick={() => navigate(`/play/${workout.id}`)}
                 className={clsx(
                   "rounded-[2rem] p-5 flex flex-col justify-between h-56 relative overflow-hidden transition-transform active:scale-95 cursor-pointer shadow-sm",
                   bgClass
                 )}
               >
                 {/* Decorative Circle */}
                 {isYoga && <div className="absolute -right-4 top-10 w-24 h-24 bg-white/20 rounded-full blur-md"></div>}
                 {isBalance && <div className="absolute -left-4 bottom-4 w-20 h-20 bg-blue-400/20 rounded-full blur-md"></div>}

                 <div className="relative z-10">
                   <span className={clsx("px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm", badgeBg, badgeText)}>
                     {workout.difficulty}
                   </span>
                   <h4 className={clsx("text-2xl font-bold mt-4 leading-tight", textClass)}>{workout.name}</h4>
                 </div>

                 <div className="relative z-10">
                   <p className={clsx("text-sm font-medium mb-1", textClass)}>{workout.startTime || 'Anytime'}</p>
                   <p className={clsx("text-xs", subTextClass)}>{workout.location || 'Main Gym'}</p>
                   
                   <div className="mt-4 flex items-center gap-2">
                     <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200">
                        <img src={users.find(u => u.id === workout.trainerId)?.avatarUrl} alt="trainer" />
                     </div>
                     <span className={clsx("text-xs font-medium", textClass)}>
                        {users.find(u => u.id === workout.trainerId)?.name}
                     </span>
                   </div>
                 </div>
               </div>
             );
           })}
        </div>
      </div>
    </div>
  );
};