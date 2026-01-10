
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Workout, Exercise, WorkoutSession, Assessment, Message, Badge } from '../types';

interface SyncItem {
  type: 'session' | 'assessment' | 'workout' | 'message';
  id: string;
  data: any;
  timestamp: string;
}

interface AppState {
  currentUser: User | null;
  users: User[];
  workouts: Workout[];
  exercises: Exercise[];
  sessions: WorkoutSession[];
  assessments: Assessment[];
  messages: Message[];
  syncQueue: SyncItem[];
  isOnline: boolean;
  
  setCurrentUser: (user: User | null) => void;
  addSession: (session: WorkoutSession) => void;
  toggleUserRole: () => void;
  sendMessage: (text: string) => void;
  createWorkout: (workout: Workout) => void;
  addAssessment: (assessment: Omit<Assessment, 'bmi' | 'leanMass' | 'id'>) => void;
  setOnlineStatus: (status: boolean) => void;
  clearSyncQueue: () => void;
  processSync: () => Promise<void>;
}

const MOCK_BADGES: Badge[] = [
  { id: 'b1', name: 'Early Bird', icon: '🌅', description: 'Treinou antes das 8h', earnedAt: '2023-10-10' },
  { id: 'b2', name: 'On Fire', icon: '🔥', description: '3 dias seguidos', earnedAt: '2023-10-12' },
];

const GYM_EXERCISES: Exercise[] = [
  { id: 'ex-p1', name: 'Supino Reto (Barra)', description: 'O exercício base para o peitoral maior.', muscleGroup: 'Peitoral', imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=800' },
  { id: 'ex-p2', name: 'Chest Press Machine', description: 'Excelente para isolar o peito com segurança mecânica.', muscleGroup: 'Peitoral', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800' },
  { id: 'ex-c1', name: 'Puxada Aberta', description: 'Foco na largura das costas.', muscleGroup: 'Costas', imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=800' },
  { id: 'ex-l1', name: 'Leg Press 45°', description: 'Poderoso para quadríceps e glúteos.', muscleGroup: 'Pernas', imageUrl: 'https://images.unsplash.com/photo-1591940742878-13aba4b7a35e?q=80&w=800' },
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
          description: 'Treino focado em máquinas.',
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
      syncQueue: [],
      isOnline: navigator.onLine,

      setOnlineStatus: (status) => set({ isOnline: status }),

      setCurrentUser: (user) => set({ currentUser: user }),
      
      addSession: (session) => set((state) => ({ 
        sessions: [session, ...state.sessions],
        syncQueue: [...state.syncQueue, { type: 'session', id: session.id, data: session, timestamp: new Date().toISOString() }]
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
        return { 
          messages: [...state.messages, newMessage],
          syncQueue: [...state.syncQueue, { type: 'message', id: newMessage.id, data: newMessage, timestamp: newMessage.timestamp }]
        };
      }),

      createWorkout: (workout) => set((state) => ({
        workouts: [...state.workouts, workout],
        syncQueue: [...state.syncQueue, { type: 'workout', id: workout.id, data: workout, timestamp: new Date().toISOString() }]
      })),

      addAssessment: (data) => set((state) => {
        const heightM = data.height / 100;
        const bmi = parseFloat((data.weight / (heightM * heightM)).toFixed(1));
        const leanMass = parseFloat((data.weight * (1 - data.bodyFat / 100)).toFixed(1));
        const newAssessment: Assessment = {
          ...data,
          bmi,
          leanMass,
          id: Math.random().toString(36).substr(2, 9)
        };
        return { 
          assessments: [newAssessment, ...state.assessments],
          syncQueue: [...state.syncQueue, { type: 'assessment', id: newAssessment.id, data: newAssessment, timestamp: newAssessment.date }]
        };
      }),

      clearSyncQueue: () => set({ syncQueue: [] }),

      processSync: async () => {
        const { syncQueue, isOnline } = get();
        if (!isOnline || syncQueue.length === 0) return;

        console.log(`Sincronizando ${syncQueue.length} itens com o servidor...`);
        // Simulação de delay de rede
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        set({ syncQueue: [] });
        console.log('Sincronização concluída com sucesso.');
      }
    }),
    {
      name: 'fitness-pro-unified-v4',
    }
  )
);
