export type UserType = 'trainer' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  avatarUrl?: string;
  location?: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: string;
  videoUrl?: string; // Simulated URL
  imageUrl: string;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  sets: number;
  reps: number;
  restSeconds: number;
  weightKg: number;
  notes?: string;
  order: number;
}

export interface Workout {
  id: string;
  trainerId: string;
  name: string;
  description: string;
  exercises: WorkoutExercise[];
  estimatedDurationMin: number;
  category: 'yoga' | 'strength' | 'cardio' | 'balance';
  difficulty: 'Light' | 'Medium' | 'Hard';
  calories?: number;
  startTime?: string; // e.g., "14:00-15:00"
  location?: string; // e.g., "A5 room"
}

export interface WorkoutSession {
  id: string;
  workoutId: string;
  studentId: string;
  startedAt: string;
  completedAt?: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  exercisesCompleted: {
    exerciseId: string;
    setsCompleted: number;
    repsPerSet: number[];
  }[];
}

// Stats for charts
export interface Assessment {
  date: string;
  weight: number;
  bodyFat: number;
}