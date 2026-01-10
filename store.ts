
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Workout, Exercise, WorkoutSession, Assessment, Message, Badge } from './types';

interface AppState {
  currentUser: User | null;
  users: User[];
  workouts: Workout[];
  exercises: Exercise[];
  sessions: WorkoutSession[];
  assessments: Assessment[];
  messages: Message[];
  
  setCurrentUser: (user: User | null) => void;
  addSession: (session: WorkoutSession) => void;
  toggleUserRole: () => void;
  sendMessage: (text: string) => void;
  createWorkout: (workout: Workout) => void;
  addAssessment: (assessment: Omit<Assessment, 'bmi' | 'leanMass'>) => void;
}

const MOCK_BADGES: Badge[] = [
  { id: 'b1', name: 'Early Bird', icon: '🌅', description: 'Treinou antes das 8h', earnedAt: '2023-10-10' },
  { id: 'b2', name: 'On Fire', icon: '🔥', description: '3 dias seguidos', earnedAt: '2023-10-12' },
];

const GYM_EXERCISES: Exercise[] = [
  // PEITO
  { id: 'ex-p1', name: 'Supino Reto (Barra)', description: 'O exercício base para o peitoral maior. Mantenha os pés firmes e a escápula retraída.', muscleGroup: 'Peitoral', imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800' },
  { id: 'ex-p2', name: 'Chest Press Machine', description: 'Excelente para isolar o peito com segurança mecânica. Controle a fase excêntrica.', muscleGroup: 'Peitoral', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800' },
  { id: 'ex-p3', name: 'Crucifixo no Peck Deck', description: 'Isolamento total de peitoral com foco no miolo do peito.', muscleGroup: 'Peitoral', imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800' },
  
  // COSTAS
  { id: 'ex-c1', name: 'Puxada Aberta (Lat Pulldown)', description: 'Foco na largura das costas (Latíssimo do dorso). Não balance o tronco.', muscleGroup: 'Costas', imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=800' },
  { id: 'ex-c2', name: 'Remada Sentada (Cabo)', description: 'Trabalha a densidade das costas e trapézio médio/inferior.', muscleGroup: 'Costas', imageUrl: 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=800' },
  
  // PERNAS
  { id: 'ex-l1', name: 'Leg Press 45°', description: 'Poderoso para quadríceps e glúteos. Não bloqueie os joelhos no topo.', muscleGroup: 'Pernas', imageUrl: 'https://images.unsplash.com/photo-1591940742878-13aba4b7a35e?q=80&w=800' },
  { id: 'ex-l2', name: 'Cadeira Extensora', description: 'Isolamento de quadríceps. Ideal para definição e pico de contração.', muscleGroup: 'Pernas', imageUrl: 'https://images.unsplash.com/photo-1574680096145-b5ef050c2e1e?q=80&w=800' },
  { id: 'ex-l3', name: 'Mesa Flexora', description: 'Foco nos posteriores de coxa (isquiotibiais).', muscleGroup: 'Pernas', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800' },

  // OMBROS
  { id: 'ex-s1', name: 'Desenvolvimento Shoulder Press', description: 'Exercício principal para ombros. Pode ser feito com halteres ou máquina.', muscleGroup: 'Ombros', imageUrl: 'https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?q=80&w=800' },
  { id: 'ex-s2', name: 'Elevação Lateral', description: 'Foco no deltoide lateral para dar largura aos ombros.', muscleGroup: 'Ombros', imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2ec617?q=80&w=800' },

  // BRAÇOS
  { id: 'ex-b1', name: 'Rosca Direta (Cabo)', description: 'Tensão constante no bíceps durante todo o movimento.', muscleGroup: 'Braços', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800' },
  { id: 'ex-b2', name: 'Tríceps Pulley (Corda)', description: 'Ótimo para trabalhar a porção lateral e longa do tríceps.', muscleGroup: 'Braços', imageUrl: 'https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=800' },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: { id: 's1', name: 'Sandra Glam', email: 'sandra@fit.com', type: 'student', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', location: 'São Paulo, SP', badges: MOCK_BADGES },
      users: [
        { id: 't1', name: 'Tiffany Way', email: 'tiffany@fit.com', type: 'trainer', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200', location: 'Copenhagen, DK', badges: [] },
        { id: 's1', name: 'Sandra Glam', email: 'sandra@fit.com', type: 'student', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', location: 'São Paulo, SP', badges: MOCK_BADGES }
      ],
      workouts: [
        {
          id: 'w-hiit',
          trainerId: 't1',
          name: 'Super Peitoral',
          description: 'Treino de alta intensidade focado em máquinas.',
          estimatedDurationMin: 45,
          category: 'strength',
          difficulty: 'Hard',
          calories: 500,
          exercises: [
            { id: 'we1', exerciseId: 'ex-p1', sets: 4, reps: 10, restSeconds: 90, weightKg: 60, order: 1 },
            { id: 'we2', exerciseId: 'ex-p2', sets: 3, reps: 12, restSeconds: 60, weightKg: 40, order: 2 },
          ]
        }
      ],
      exercises: GYM_EXERCISES,
      sessions: [],
      assessments: [],
      messages: [],

      setCurrentUser: (user) => set({ currentUser: user }),
      
      addSession: (session) => set((state) => ({ 
        sessions: [...state.sessions, session] 
      })),

      toggleUserRole: () => set((state) => {
        const nextUser = state.currentUser?.type === 'student' ? state.users[0] : state.users[1];
        return { currentUser: nextUser };
      }),

      sendMessage: (text) => set((state) => {
        if (!state.currentUser) return {};
        const receiverId = state.currentUser.id === 't1' ? 's1' : 't1';
        const newMessage: Message = {
          id: Math.random().toString(36).substr(2, 9),
          senderId: state.currentUser.id,
          receiverId,
          text,
          timestamp: new Date().toISOString(),
          isRead: false
        };
        return { messages: [...state.messages, newMessage] };
      }),

      createWorkout: (workout) => set((state) => ({
        workouts: [...state.workouts, workout]
      })),

      addAssessment: (assessmentData) => set((state) => {
        const heightM = assessmentData.height / 100;
        const bmi = parseFloat((assessmentData.weight / (heightM * heightM)).toFixed(1));
        const leanMass = parseFloat((assessmentData.weight * (1 - assessmentData.bodyFat / 100)).toFixed(1));
        const newAssessment: Assessment = {
          ...assessmentData,
          bmi,
          leanMass,
          id: Math.random().toString(36).substr(2, 9)
        };
        return { assessments: [...state.assessments, newAssessment] };
      }),
    }),
    {
      name: 'fitness-pro-unified-v3',
    }
  )
);
