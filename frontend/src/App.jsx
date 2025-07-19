import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import AdminDashboard from './components/AdminDashboard';
import LoadingScreen from './components/LoadingScreen';
import { useAuth } from './hooks/useAuth';
import { useTheme } from './hooks/useTheme';

function App() {
  const { authState, register, login, logout, checkAuthStatus } = useAuth();
  const [showRegistration, setShowRegistration] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const { theme } = useTheme();

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Check authentication status on app load
  useEffect(() => {
    const initializeAuth = async () => {
      await checkAuthStatus();
      setIsInitializing(false);
    };

    initializeAuth();
  }, [checkAuthStatus]);

  // Show loading screen while initializing
  if (isInitializing || authState.loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="App">
      {authState.isAuthenticated && authState.admin ? (
        <AdminDashboard 
          adminEmail={authState.admin.email}
          adminId={authState.admin.id}
          onLogout={logout} 
        />
      ) : showRegistration ? (
        <RegistrationForm 
          onRegister={register}
          onBackToLogin={() => setShowRegistration(false)}
        />
      ) : (
        <LoginForm 
          onLogin={login} 
          onShowRegistration={() => setShowRegistration(true)}
        />
      )}
    </div>
  );
}

export default App;