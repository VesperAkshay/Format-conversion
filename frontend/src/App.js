import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ConversionPage from './pages/ConversionPage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <div className="App">
      <Header />
      <Container component="main" sx={{ py: 4, minHeight: 'calc(100vh - 128px)' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/convert/:type" element={<ConversionPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Container>
      <Footer />
    </div>
  );
}

export default App; 