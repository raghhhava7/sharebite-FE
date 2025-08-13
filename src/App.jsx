import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import Toast from './components/UI/Toast';
import ErrorBoundary from './components/UI/ErrorBoundary';
import PerformanceMonitor from './components/Performance/PerformanceMonitor';
import ChatWidget from './components/Chat/ChatWidget';
import AppRoutes from './routes.jsx';
import './App.css';

// Component to conditionally render Navbar and Footer
const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavAndFooter = ['/login', '/signup'].includes(location.pathname);

  return (
    <div className="app">
      {!hideNavAndFooter && <Navbar />}
      <main className={`main-content ${hideNavAndFooter ? 'full-height' : ''}`}>
        {children}
      </main>
      {!hideNavAndFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Router>
          <ToastProvider>
            <AuthProvider>
              <Layout>
                <AppRoutes />
              </Layout>
              <ChatWidget />
              <Toast />
              <PerformanceMonitor />
            </AuthProvider>
          </ToastProvider>
        </Router>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;