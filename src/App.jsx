import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import TopNavigation from './components/layout/TopNavigation';
import SiteFooter from './components/layout/SiteFooter';
import HomePage from './pages/HomePage';
import ScrollToTop from './components/ui/ScrollToTop';

// Code-split everything that is not needed for the first paint of the home page.
const ChatbotPage = lazy(() => import('./pages/ChatbotPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function AppContent() {
  const location = useLocation();

  return (
    // reducedMotion="user" turns off framer-motion transform animations for visitors
    // who ask their OS for reduced motion.
    <MotionConfig reducedMotion="user">
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <a href="#main" className="skip-link">Skip to content</a>
        <TopNavigation />
        <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        {location.pathname !== '/chatbot' && <SiteFooter />}
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
