import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Workout, Exercise, WorkoutSession, Assessment } from './types';

interface AppState {
  currentUser: User | null;
  users: User[];
  workouts: Workout[];
  exercises: Exercise[];
  sessions: WorkoutSession[];
  assessments: Assessment[];
  
  setCurrentUser: (user: User | null) => void;
  addSession: (session: WorkoutSession) => void;
  toggleUserRole: () => void; // Demo utility
}

// Initial Mock Data
const MOCK_EXERCISES: Exercise[] = [
  { id: '1', name: 'Snake Pose', description: 'Sarpasana in Sanskrit', muscleGroup: 'Costas', imageUrl: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=800&auto=format&fit=crop' },
  { id: '2', name: 'Agachamento Livre', description: 'Pés na largura dos ombros', muscleGroup: 'Pernas', imageUrl: 'https://images.unsplash.com/photo-1574680096141-1cddd32e04ca?q=80&w=800&auto=format&fit=crop' },
  { id: '3', name: 'Warrior Pose', description: 'Virabhadrasana', muscleGroup: 'Corpo Todo', imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop' },
  { id: '4', name: 'Rosca Direta', description: 'Barra W', muscleGroup: 'Bíceps', imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop' },
];

const MOCK_WORKOUTS: Workout[] = [
  {
    id: 'w1',
    trainerId: 't1',
    name: 'Yoga Group',
    description: 'Focus on flexibility and breathing.',
    estimatedDurationMin: 60,
    category: 'yoga',
    difficulty: 'Medium',
    calories: 250,
    startTime: '14:00-15:00',
    location: 'A5 room',
    exercises: [
      { id: 'we1', exerciseId: '1', sets: 3, reps: 1, restSeconds: 30, weightKg: 0, order: 1 },
      { id: 'we2', exerciseId: '3', sets: 3, reps: 1, restSeconds: 30, weightKg: 0, order: 2 },
    ]
  },
  {
    id: 'w2',
    trainerId: 't1',
    name: 'Balance',
    description: 'Core stability and balance.',
    estimatedDurationMin: 45,
    category: 'balance',
    difficulty: 'Light',
    calories: 180,
    startTime: '18:00-19:30',
    location: 'A2 room',
    exercises: [
      { id: 'we4', exerciseId: '3', sets: 4, reps: 1, restSeconds: 45, weightKg: 0, order: 1 },
    ]
  },
  {
    id: 'w3',
    trainerId: 't1',
    name: 'Power Start',
    description: 'High intensity cardio.',
    estimatedDurationMin: 30,
    category: 'cardio',
    difficulty: 'Hard',
    calories: 400,
    startTime: '07:00-07:30',
    location: 'Gym B',
    exercises: [
      { id: 'we5', exerciseId: '2', sets: 4, reps: 15, restSeconds: 60, weightKg: 0, order: 1 },
    ]
  }
];

const MOCK_USERS: User[] = [
  { id: 't1', name: 'Tiffany Way', email: 'tiffany@fit.com', type: 'trainer', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop', location: 'Copenhagen, DK' },
  { id: 's1', name: 'Sandra Glam', email: 'sandra@fit.com', type: 'student', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop', location: 'Denmark, Copenhagen' }
];

const MOCK_ASSESSMENTS: Assessment[] = [
  { date: '2023-01-01', weight: 85, bodyFat: 22 },
  { date: '2023-02-01', weight: 83, bodyFat: 20 },
  { date: '2023-03-01', weight: 81, bodyFat: 18 },
  { date: '2023-04-01', weight: 80, bodyFat: 17 },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: MOCK_USERS[1], 
      users: MOCK_USERS,
      workouts: MOCK_WORKOUTS,
      exercises: MOCK_EXERCISES,
      sessions: [],
      assessments: MOCK_ASSESSMENTS,

      setCurrentUser: (user) => set({ currentUser: user }),
      
      addSession: (session) => set((state) => ({ 
        sessions: [session, ...state.sessions] 
      })),

      toggleUserRole: () => {
        const current = get().currentUser;
        if (current?.type === 'student') {
          set({ currentUser: MOCK_USERS[0] });
        } else {
          set({ currentUser: MOCK_USERS[1] });
        }
      }
    }),
    {
      name: 'treinos-pt-storage',
    }
  )
);