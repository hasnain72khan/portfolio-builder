import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Register           from './pages/Register';
import Login              from './pages/Login';
import Admin              from './pages/Admin';
import AdminSkills        from './pages/AdminSkills';
import AdminProjects      from './pages/AdminProjects';
import AdminServices      from './pages/AdminServices';
import AdminAbout         from './pages/AdminAbout';
import AdminChat          from './pages/AdminChat';
import AdminExperience    from './pages/AdminExperience';
import AdminEducation     from './pages/AdminEducation';
import AdminTestimonials  from './pages/AdminTestimonials';
import PublicPortfolio    from './pages/PublicPortfolio';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth */}
          <Route path="/register" element={<Register />} />
          <Route path="/login"    element={<Login />} />

          {/* Public portfolio */}
          <Route path="/portfolio/:username" element={<PublicPortfolio />} />

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Protected admin routes */}
          <Route path="/admin"          element={<ProtectedRoute><Admin /></ProtectedRoute>} />
          <Route path="/admin/about"    element={<ProtectedRoute><AdminAbout /></ProtectedRoute>} />
          <Route path="/admin/skills"   element={<ProtectedRoute><AdminSkills /></ProtectedRoute>} />
          <Route path="/admin/projects" element={<ProtectedRoute><AdminProjects /></ProtectedRoute>} />
          <Route path="/admin/services" element={<ProtectedRoute><AdminServices /></ProtectedRoute>} />
          <Route path="/admin/experience" element={<ProtectedRoute><AdminExperience /></ProtectedRoute>} />
          <Route path="/admin/education" element={<ProtectedRoute><AdminEducation /></ProtectedRoute>} />
          <Route path="/admin/testimonials" element={<ProtectedRoute><AdminTestimonials /></ProtectedRoute>} />
          <Route path="/admin/chat"     element={<ProtectedRoute><AdminChat /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
