import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Web3Provider } from './context/Web3Context';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import Donate from './pages/Donate';
import MyCampaigns from './pages/MyCampaigns';
import CharityRegistration from './pages/CharityRegistration';
import AdminPanel from './pages/AdminPanel';

function App() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading Charity DApp...</p>
        </div>
      </div>
    );
  }
  
  return (
    <ThemeProvider>
      <Web3Provider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/my-campaigns" element={<MyCampaigns />} />
              <Route path="/charity-registration" element={<CharityRegistration />} />
              <Route path="/admin" element={<AdminPanel />} />
              {/* Redirect any unmatched routes to Dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </Web3Provider>
    </ThemeProvider>
  );
}

export default App;