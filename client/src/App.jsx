import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import SchoolManagementPage from './pages/SchoolManagementPage';
import Trainer from './pages/Trainers';
import Subscription from './pages/Subscription';
import Ticket from './pages/Ticket';
import Settings from './pages/Settings';
import Loginpage from './pages/LoginPage';
import Query from './pages/Query';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Loginpage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes - All admin routes require authentication */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<Layout />}>
              {/* Default admin route */}
              <Route index element={<DashboardPage />} />
              
              {/* Admin sub-routes */}
              <Route path="schools" element={<SchoolManagementPage />} />
              <Route path="trainers" element={<Trainer />} />
              <Route path="subscriptions" element={<Subscription />} />
              <Route path="tickets" element={<Ticket />} />
              <Route path="queries" element={<Query />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Catch all - redirect to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;