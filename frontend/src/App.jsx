import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Results from './pages/Results';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = React.useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Simple Header Component included here for ease
const GlobalHeader = () => {
  const { user, logout } = React.useContext(AuthContext);
  if (!user) return null;
  return (
    <div className="container">
      <header className="app-header">
        <a href="/" className="logo">MasalaMatch</a>
        <nav className="nav-links">
          <a href="/" className="nav-link active">Home</a>
          <a href="#" className="nav-link" onClick={(e) => {
            e.preventDefault();
            logout();
          }}>Logout (Chef {user.name})</a>
        </nav>
      </header>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <GlobalHeader />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/results" element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
