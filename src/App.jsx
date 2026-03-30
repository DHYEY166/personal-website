import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import TopNavigation from './components/layout/TopNavigation';
import HomePage from './pages/HomePage';
import ChatbotPage from './pages/ChatbotPage';
import ScrollProgressBar from './components/ui/ScrollProgressBar';
import ScrollToTop from './components/ui/ScrollToTop';
import CustomCursor from './components/ui/CustomCursor';
import ParticleBackground from './components/ui/ParticleBackground';

function AppContent() {
  const location = useLocation();

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <CustomCursor />
      <ParticleBackground />
      <ScrollProgressBar />
      <TopNavigation />
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
      </Routes>
      <ScrollToTop />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
