import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Inscriptions from './pages/Inscriptions';
import Models from './pages/Models';
import ModelDetail from './pages/ModelDetail';

import Courses from './pages/Courses';
import News from './pages/News';
import Profile from './pages/Profile';
import LoginModal from './components/auth/LoginModal';
import ToastContainer from './components/common/Toast';
import { useAuthStore } from './store/authStore';

// Admin Imports
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ModelManager from './pages/admin/ModelManager';
import NewsManager from './pages/admin/NewsManager';
import InscriptionManager from './pages/admin/InscriptionManager';
import CourseManager from './pages/admin/CourseManager';
import SettingsManager from './pages/admin/SettingsManager';
import AdminLogin from './pages/admin/AdminLogin';

// Placeholder components for other routes
const ModelRequests = () => <div className="p-20"><h1 className="text-4xl font-serif">Model Requests (Cart)</h1></div>;

function App() {
  const { isLoginModalOpen, setLoginModalOpen } = useAuthStore();

  return (
    <>
      <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="models" element={<Models />} />
        <Route path="models/:id" element={<ModelDetail />} />
        <Route path="courses" element={<Courses />} />
        <Route path="news" element={<News />} />
        <Route path="inscriptions" element={<Inscriptions />} />
          <Route path="profile" element={<Profile />} />
          <Route path="requests" element={<ModelRequests />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="models" element={<ModelManager />} />
            <Route path="news" element={<NewsManager />} />
            <Route path="courses" element={<CourseManager />} />
            <Route path="inscriptions" element={<InscriptionManager />} />
            <Route path="contacts" element={<InscriptionManager />} /> {/* Reusing inscription placeholder for now */}
            <Route path="settings" element={<SettingsManager />} />
          </Route>
        </Route>
      </Routes>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} />
      <ToastContainer />
    </>
  );
}

export default App;
