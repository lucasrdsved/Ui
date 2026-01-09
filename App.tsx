import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { WorkoutList } from './pages/WorkoutList';
import { WorkoutPlayer } from './components/WorkoutPlayer';
import { ExerciseDetail } from './pages/ExerciseDetail';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workouts" element={<WorkoutList />} />
          <Route path="/play/:workoutId" element={<WorkoutPlayer />} />
          <Route path="/exercise/:exerciseId" element={<ExerciseDetail />} />
          <Route path="/profile" element={<div className="p-4 text-center text-slate-500">Perfil (Em Desenvolvimento)</div>} />
          <Route path="/settings" element={<div className="p-4 text-center text-slate-500">Configurações (Em Desenvolvimento)</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;