
import React from 'react';
import { useAppStore } from '../store';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Zap, ChevronRight, Users, TrendingUp, Dumbbell, CheckCircle, Plus, Flame, Award, BookOpen } from 'lucide-react';
import { AreaChart, Area, XAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import clsx from 'clsx';

const TrainerDashboard = () => {
  const { workouts, users, currentUser, messages } = useAppStore();
  const navigate = useNavigate();
  const unreadCount = messages.filter(m => m.receiverId === currentUser?.id && !m.isRead).length;

  const students = users.filter(u => u.type === 'student');
  
  const chartData = [
    { name: 'Seg', sessões: 2 },
    { name: 'Ter', sessões: 5 },
    { name: 'Qua', sessões: 3 },
    { name: 'Qui', sessões: 6 },
    { name: 'Sex', sessões: 4 },
    { name: 'Sab', sessões: 8 },
    { name: 'Dom', sessões: 5 },
  ];

  return (
    <div className="px-6 pt-12 pb-32 space-y-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div onClick={() => navigate('/profile')} className="w-12 h-12 rounded-full overflow-hidden border-2 border-black/5 shadow-lg cursor-pointer">
            <img src={currentUser?.avatarUrl} alt="Perfil" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Personal Trainer</h1>
            <p className="text-xl text-gray-900 font-black">{currentUser?.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
           <button onClick={() => navigate('/chat')} className="relative w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors">
            <MessageSquare size={20} className="text-gray-900" />
            {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#F2F4F8]">{unreadCount}</span>}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Dumbbell, label: 'Treinos', path: '/workouts', color: 'bg-purple-50 text-purple-500' },
          { icon: BookOpen, label: 'Biblioteca', path: '/exercises', color: 'bg-blue-50 text-blue-500' },
          { icon: TrendingUp, label: 'Avaliar', path: '/assessment', color: 'bg-orange-50 text-orange-500' },
        ].map((action) => (
          <div 
            key={action.label}
            onClick={() => navigate(action.path)} 
            className="bg-white p-4 rounded-[2rem] shadow-sm flex flex-col items-center justify-center text-center gap-2 border border-gray-50 cursor-pointer active:scale-95 transition-all"
          >
            <div className={clsx("w-10 h-10 rounded-full flex items-center justify-center", action.color)}>
              <action.icon size={20} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-tight">{action.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-black text-white p-6 rounded-[2.5rem] shadow-xl shadow-black/20 flex items-center justify-around">
         <div className="text-center">
            <h3 className="text-2xl font-black">{students.length}</h3>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Alunos</p>
         </div>
         <div className="w-px h-10 bg-white/20"></div>
         <div className="text-center">
            <h3 className="text-2xl font-black">{workouts.length}</h3>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Programas</p>
         </div>
         <div className="w-px h-10 bg-white/20"></div>
         <button onClick={() => navigate('/create-workout')} className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform">
           <Plus size={24} />
         </button>
      </div>

      <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black text-gray-900 text-sm">Performance Semanal</h3>
          <span className="text-[9px] font-black text-gray-400 uppercase bg-gray-50 px-3 py-1.5 rounded-full">Sessões</span>
        </div>
        <div className="h-48 w-full">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={chartData}>
               <defs>
                 <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="5%" stopColor="#000" stopOpacity={0.1}/>
                   <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                 </linearGradient>
               </defs>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
               <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af', fontWeight: 600}} dy={10} />
               <Area type="monotone" dataKey="sessões" stroke="#000" strokeWidth={3} fillOpacity={1} fill="url(#colorSessions)" />
             </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>

      <section>
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="text-lg font-black text-gray-900">Meus Alunos</h3>
          <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Ver Todos</button>
        </div>
        <div className="space-y-3">
          {students.map(student => (
            <div key={student.id} className="bg-white p-4 rounded-[2rem] flex items-center gap-4 shadow-sm border border-gray-50 hover:border-gray-200 transition-all cursor-pointer" onClick={() => navigate('/chat')}>
              <img src={student.avatarUrl} className="w-12 h-12 rounded-2xl object-cover shadow-sm" alt="aluno" />
              <div className="flex-1">
                 <h4 className="font-black text-gray-900 text-sm leading-tight">{student.name}</h4>
                 <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{student.location || 'Brasil'}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                 <CheckCircle size={16} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const StudentDashboard = () => {
  const { workouts, currentUser, messages } = useAppStore();
  const navigate = useNavigate();

  const unreadCount = messages.filter(m => m.receiverId === currentUser?.id && !m.isRead).length;
  const streak = 12;
  
  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - today.getDay() + i);
    return {
      date: d.getDate(),
      day: d.toLocaleDateString('pt-BR', { weekday: 'short' }).split('.')[0],
      isToday: d.getDate() === today.getDate(),
    };
  });

  return (
    <div className="px-6 pt-12 pb-32 space-y-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-3">
           <div onClick={() => navigate('/profile')} className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg cursor-pointer">
             <img src={currentUser?.avatarUrl} alt="Perfil" className="w-full h-full object-cover" />
           </div>
           <div>
             <h1 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Olá, {currentUser?.name.split(' ')[0]}</h1>
             <p className="text-sm text-gray-900 font-black">{today.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}</p>
           </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/chat')} className="relative w-11 h-11 rounded-full border border-white bg-white/50 backdrop-blur-sm flex items-center justify-center shadow-sm">
            <MessageSquare size={20} className="text-gray-900" />
            {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#F2F4F8]">{unreadCount}</span>}
          </button>
        </div>
      </header>

      <div className="relative bg-[#9C67F9] rounded-[2.5rem] p-7 text-white shadow-2xl shadow-purple-500/20 overflow-hidden min-h-[160px] flex items-center">
        <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-orange-400 rounded-2xl rotate-45 mix-blend-screen opacity-40 blur-xl"></div>
        <div className="relative z-10 w-full">
          <h2 className="text-3xl font-black leading-tight mb-1 uppercase tracking-tighter">Desafio<br/>Diário</h2>
          <p className="text-purple-100 text-[10px] font-black mb-5 opacity-80 uppercase tracking-widest">Conclua sua meta de hoje</p>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#9C67F9] bg-gray-200 overflow-hidden shadow-md">
                  <img src={`https://i.pravatar.cc/100?u=${i+20}`} alt="user" />
                </div>
              ))}
            </div>
            <span className="text-[10px] font-black opacity-80">+15 alunos treinando</span>
          </div>
        </div>
      </div>

      <div onClick={() => navigate('/exercises')} className="bg-white p-5 rounded-[2.2rem] border border-gray-100 flex items-center justify-between shadow-sm active:scale-[0.98] transition-all cursor-pointer">
         <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
               <BookOpen size={20} />
            </div>
            <div>
               <h4 className="font-black text-gray-900 text-sm">Biblioteca de Máquinas</h4>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Veja a execução correta</p>
            </div>
         </div>
         <ChevronRight size={18} className="text-gray-200" />
      </div>

      <div className="flex justify-between items-center gap-2 py-2 overflow-x-auto no-scrollbar">
        {weekDays.map((day, idx) => (
          <div 
            key={idx} 
            className={clsx(
              "flex flex-col items-center justify-center min-w-[44px] py-3.5 rounded-2xl transition-all duration-300",
              day.isToday ? "bg-black text-white shadow-xl shadow-black/20 scale-105" : "bg-white text-gray-400 border border-gray-50"
            )}
          >
            <span className="text-[9px] font-black uppercase mb-1">{day.day}</span>
            <span className="text-sm font-black">{day.date}</span>
          </div>
        ))}
      </div>

      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xl font-black text-gray-900">Seu Treino</h3>
          <button onClick={() => navigate('/workouts')} className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">Todos <ChevronRight size={12} /></button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {workouts.slice(0, 2).map((workout) => (
            <div 
              key={workout.id}
              onClick={() => navigate(`/play/${workout.id}`)}
              className={clsx(
                "rounded-[2.5rem] p-5 flex flex-col justify-between min-h-[190px] shadow-lg transition-transform active:scale-95 cursor-pointer relative overflow-hidden",
                workout.category === 'yoga' ? "bg-orange-400 text-white" : "bg-blue-500 text-white"
              )}
            >
              <div className="relative z-10">
                <span className="text-[9px] font-black uppercase bg-white/20 px-3 py-1.5 rounded-xl backdrop-blur-md mb-3 inline-block">
                  {workout.difficulty === 'Hard' ? 'Intenso' : workout.difficulty === 'Medium' ? 'Moderado' : 'Leve'}
                </span>
                <h4 className="text-xl font-black leading-tight mb-1">{workout.name}</h4>
                <p className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">Academia Pro</p>
              </div>
              <div className="flex items-center justify-between relative z-10 mt-4">
                 <div className="flex items-center gap-1.5">
                   <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200" className="w-7 h-7 rounded-full border border-white/30" alt="Trainer" />
                   <span className="text-[10px] font-black opacity-90">Tiffany</span>
                 </div>
                 <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <Zap size={16} fill="currentColor" />
                 </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-white rounded-[2.2rem] p-6 shadow-sm border border-gray-100 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
               <Flame size={24} fill="currentColor" />
            </div>
            <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Frequência</p>
               <h4 className="text-lg font-black text-gray-900">{streak} Dias Seguindo</h4>
            </div>
         </div>
         <Award className="text-gray-200" size={32} />
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { currentUser } = useAppStore();
  return currentUser?.type === 'trainer' ? <TrainerDashboard /> : <StudentDashboard />;
};
