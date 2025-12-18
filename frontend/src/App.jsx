import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import Quizzes from './pages/Quizzes';
import QuizDetail from './pages/QuizDetail';
import TrustedSources from './pages/TrustedSources';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import About from './pages/About';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Routes publiques */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="about" element={<About />} />
        <Route path="trusted-sources" element={<TrustedSources />} />
        
        {/* Routes protégées */}
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="analysis" element={
          <ProtectedRoute>
            <Analysis />
          </ProtectedRoute>
        } />
        <Route path="quizzes" element={
          <ProtectedRoute>
            <Quizzes />
          </ProtectedRoute>
        } />
        <Route path="quizzes/:id" element={
          <ProtectedRoute>
            <QuizDetail />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        {/* Routes admin */}
        <Route path="admin" element={
          <ProtectedRoute requireAdmin>
            <Admin />
          </ProtectedRoute>
        } />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;