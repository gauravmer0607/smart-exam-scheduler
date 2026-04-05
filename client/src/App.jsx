import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Component Imports
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Features from './components/Features';
import Generate from './pages/Generate';
import Auth from './pages/Auth';

/**
 * ScrollToTop: Automatically resets scroll position on route change
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

/**
 * ConditionalLayout: Controls visibility of global UI elements like Navbar and Footer
 */
const ConditionalLayout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';

  return (
    <div className="min-h-screen flex flex-col bg-[#070e1b] selection:bg-blue-500/30">
      {!isAuthPage && <Navbar />}
      
      <main className="flex-grow">
        {children}
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
};

/**
 * Home: Main Landing Page view
 */
const Home = () => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    transition={{ duration: 0.5 }}
  >
    <Hero />
    <Features />
  </motion.div>
);

function App() {
  return (
    <Router>
      <ScrollToTop />
      <ConditionalLayout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/generate" element={<Generate />} />
            <Route path="/auth" element={<Auth />} />
          </Routes>
        </AnimatePresence>
      </ConditionalLayout>
    </Router>
  );
}

export default App;