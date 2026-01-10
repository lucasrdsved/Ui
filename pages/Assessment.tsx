
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { ChevronLeft, Save, Activity, Ruler, Weight, Scale, Calendar, TrendingUp } from 'lucide-react';

export const AssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const { addAssessment, users, assessments } = useAppStore();
  
  const student = users.find(u => u.type === 'student');

  const [weight, setWeight] = useState<string>('70.5');
  const [height, setHeight] = useState<string>('175');
  const [bodyFat, setBodyFat] = useState<string>('18.5');

  const w = parseFloat(weight) || 0;
  const h = parseFloat(height) / 100 || 1;
  const bmi = (w / (h * h)).toFixed(1);
  const lean = (w * (1 - (parseFloat(bodyFat) || 0) / 100)).toFixed(1);

  const handleSave = () => {
    if (!student) return;
    addAssessment({
      studentId: student.id,
      date: new Date().toISOString(),
      weight: parseFloat(weight),
      height: parseFloat(height),
      bodyFat: parseFloat(bodyFat)
    });
    // Limpar campos ou mostrar feedback
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F2F4F8] pb-40 font-inter">
      <header className="bg-white p-6 pb-8 rounded-b-[2.5rem] shadow-sm mb-6">
        <div className="flex items-center justify-between mb-8">
           <button onClick={() => navigate(-1)} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
             <ChevronLeft size={20} />
           </button>
           <h1 className="text-[11px] font-black uppercase tracking-widest text-gray-900">Nova Avaliação</h1>
           <button onClick={handleSave} className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow-lg">
             <Save size={20} />
           </button>
        </div>

        <div className="flex items-center gap-4 px-2">
           <img src={student?.avatarUrl} className="w-16 h-16 rounded-2xl border-2 border-gray-100 object-cover" alt="aluno" />
           <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Aluno Selecionado</p>
              <h2 className="text-2xl font-black text-gray-900">{student?.name}</h2>
           </div>
        </div>
      </header>

      <div className="px-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white p-6 rounded-[2.5rem] flex flex-col gap-2 shadow-sm border border-gray-50">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-2">
                 <Weight size={20} />
              </div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Peso (kg)</label>
              <input 
                type="number" 
                value={weight} 
                onChange={e => setWeight(e.target.value)}
                className="text-3xl font-black outline-none w-full bg-transparent" 
              />
           </div>

           <div className="bg-white p-6 rounded-[2.5rem] flex flex-col gap-2 shadow-sm border border-gray-50">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mb-2">
                 <Ruler size={20} />
              </div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Altura (cm)</label>
              <input 
                type="number" 
                value={height} 
                onChange={e => setHeight(e.target.value)}
                className="text-3xl font-black outline-none w-full bg-transparent" 
              />
           </div>

           <div className="col-span-2 bg-white p-6 rounded-[2.5rem] flex items-center justify-between shadow-sm border border-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center">
                    <Activity size={22} />
                </div>
                <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase block tracking-widest mb-1">Gordura Corporal</label>
                    <input 
                        type="number" 
                        value={bodyFat} 
                        onChange={e => setBodyFat(e.target.value)}
                        className="text-2xl font-black outline-none w-24 bg-transparent" 
                    />
                </div>
              </div>
              <span className="text-2xl font-black text-gray-200">%</span>
           </div>
        </div>

        <div className="bg-black text-white p-8 rounded-[2.5rem] shadow-2xl shadow-black/20">
           <div className="flex items-center gap-2 mb-8">
              <Scale size={18} className="text-gray-400" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Resultados Atuais</h3>
           </div>
           
           <div className="flex divide-x divide-white/10">
              <div className="flex-1 px-4 text-center">
                 <div className="text-3xl font-black mb-1">{bmi}</div>
                 <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Índice IMC</div>
              </div>
              <div className="flex-1 px-4 text-center">
                 <div className="text-3xl font-black mb-1">{lean}</div>
                 <div className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Massa Magra (kg)</div>
              </div>
           </div>
        </div>

        <section className="space-y-4">
           <div className="flex justify-between items-center px-2">
              <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter">Histórico</h3>
              <TrendingUp size={18} className="text-gray-400" />
           </div>

           <div className="space-y-3">
              {assessments.length === 0 ? (
                <div className="bg-white p-8 rounded-[2.5rem] text-center text-gray-400 border border-dashed border-gray-200">
                   Nenhuma avaliação registrada ainda.
                </div>
              ) : (
                assessments.map(item => (
                  <div key={item.id} className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-gray-50 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                           <Calendar size={18} className="text-gray-400" />
                        </div>
                        <div>
                           <p className="font-black text-sm text-gray-900">{new Date(item.date).toLocaleDateString()}</p>
                           <p className="text-[9px] font-black text-gray-400 uppercase">Peso: {item.weight}kg | Gordura: {item.bodyFat}%</p>
                        </div>
                     </div>
                     <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-black">
                        IMC {item.bmi}
                     </div>
                  </div>
                ))
              )}
           </div>
        </section>
      </div>
    </div>
  );
};
