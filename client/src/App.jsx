import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page Components
import Hero from './components/Hero';
import Features from './components/Features';
import Generate from './pages/Generate';
import Auth from './pages/Auth'; 

// Scroll helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout Wrapper to Conditionally Hide Navbar/Footer
const ConditionalLayout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  return (
    <div className="min-h-screen flex flex-col bg-[#070e1b] selection:bg-blue-500/30">
      {/* Hide Navbar only on /auth */}
      {!isAuthPage && <Navbar />}

      <main className="flex-grow">
        {children}
      </main>

      {/* Hide Footer only on /auth */}
      {!isAuthPage && <Footer />}
    </div>
  );
};

const Home = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Hero />
      <Features />
    </motion.div>
  );
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ConditionalLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generate" element={<Generate />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </ConditionalLayout>
    </Router>
  );
}

export default App;