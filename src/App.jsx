import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import TopNavigation from './components/layout/TopNavigation';
import HomePage from './pages/HomePage';
import ScrollProgressBar from './components/ui/ScrollProgressBar';
import ScrollToTop from './components/ui/ScrollToTop';
import CustomCursor from './components/ui/CustomCursor';
import { usePrefersReducedMotion } from './hooks/useMediaQuery';

// Code-split everything that is not needed for the first paint of the home page.
const ChatbotPage = lazy(() => import('./pages/ChatbotPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const ParticleBackground = lazy(() => import('./components/ui/ParticleBackground'));

function AppContent() {
  const location = useLocation();
  const reducedMotion = usePrefersReducedMotion();

  return (
    // reducedMotion="user" turns off framer-motion transform animations for visitors
    // who ask their OS for reduced motion.
    <MotionConfig reducedMotion="user">
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <a href="#main" className="skip-link">Skip to content</a>
      <CustomCursor />
      {!reducedMotion && (
        <div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }} aria-hidden="true">
          <Suspense fallback={null}>
            <ParticleBackground />
          </Suspense>
        </div>
      )}
      <ScrollProgressBar />
      <TopNavigation />
      <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <ScrollToTop />
    </div>
    </MotionConfig>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
