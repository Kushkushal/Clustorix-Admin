import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
// import SchoolDetailsPage from './pages/SchoolDetailsPage';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Public Auth Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="schools" element={<SchoolManagementPage />} />
              <Route path="trainers" element={<Trainer />} />
              <Route path="subscriptions" element={<Subscription />} />
              <Route path="tickets" element={<Ticket />} />
              <Route path="settings" element={<Settings />} />

              {/* <Route path="schools/:id" element={<SchoolDetailsPage />} /> */}
              {/* Add other routes here (e.g., /admin/trainers, /admin/subscriptions) */}
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
