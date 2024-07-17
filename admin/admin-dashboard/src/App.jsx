import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext'; 
import Dashboard from './components/Dashboard';
import AdminLogin from './components/AdminLogin';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/admin-login" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth(); 
  return token ? children : <Navigate to="/admin-login" replace />;
};

export default App;
