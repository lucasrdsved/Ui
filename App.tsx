
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { WorkoutList } from './pages/WorkoutList';
import { WorkoutPlayer } from './components/WorkoutPlayer';
import { ExerciseDetail } from './pages/ExerciseDetail';
import { ExerciseLibrary } from './pages/ExerciseLibrary';
import { Chat } from './pages/Chat';
import { Profile } from './pages/Profile';
import { CreateWorkout } from './pages/CreateWorkout';
import { AssessmentPage } from './pages/Assessment';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workouts" element={<WorkoutList />} />
          <Route path="/exercises" element={<ExerciseLibrary />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/play/:workoutId" element={<WorkoutPlayer />} />
          <Route path="/exercise/:exerciseId" element={<ExerciseDetail />} />
          <Route path="/create-workout" element={<CreateWorkout />} />
          <Route path="/assessment" element={<AssessmentPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
