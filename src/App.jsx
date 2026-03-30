import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import TopNavigation from './components/layout/TopNavigation';
import HomePage from './pages/HomePage';
import ChatbotPage from './pages/ChatbotPage';
import SplashScreen from './components/layout/SplashScreen';
import PageTransition from './components/layout/PageTransition';
import ScrollProgressBar from './components/ui/ScrollProgressBar';
import ScrollToTop from './components/ui/ScrollToTop';
import CustomCursor from './components/ui/CustomCursor';
import ParticleBackground from './components/ui/ParticleBackground';

function AppContent() {
  const location = useLocation();

  return (
    <>
      <SplashScreen />
      <div style={{ minHeight: '100vh', position: 'relative' }}>
        <CustomCursor />
        <ParticleBackground />
        <ScrollProgressBar />
        <TopNavigation />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/chatbot" element={<PageTransition><ChatbotPage /></PageTransition>} />
          </Routes>
        </AnimatePresence>
        <ScrollToTop />
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
