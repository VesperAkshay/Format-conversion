import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ConversionPage from './pages/ConversionPage';
import ChatBot from './components/ui/ChatBot';

import AboutPage from './pages/AboutPage';
import ApiPage from './pages/ApiPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ProfilePage from './pages/ProfilePage';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Header />
        <Container component="main" sx={{ py: 4, minHeight: 'calc(100vh - 128px)' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/convert/:type" element={<ConversionPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/api" element={<ApiPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            
            {/* Protected routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </Container>
        <Footer />
        <ChatBot />
      </div>
    </AuthProvider>
  );
}

export default App; 