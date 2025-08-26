// Main modular App component
import React, { useState, useEffect } from 'react';
import Sidebar from './shared/components/Sidebar';
import TopBar from './shared/components/TopBar';
import { ROUTES } from './shared/utils/constants';

// Module imports
import AuthModule from './modules/auth';
import Dashboard from './modules/dashboard';
import YieldManagement from './modules/yield-management';
import WorkerManagement from './modules/worker-management';
import FinancialAnalytics from './modules/financial-analytics';

// Services
import authService from './modules/auth/authService';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activePage, setActivePage] = useState(ROUTES.DASHBOARD);
  const [userId, setUserId] = useState('');
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);

  useEffect(() => {
    // Check if user is already authenticated
    const authenticated = authService.isAuthenticated();
    setIsAuthenticated(authenticated);
    
    if (authenticated) {
      const currentUserId = authService.getCurrentUser();
      setUserId(currentUserId);
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    const currentUserId = authService.getCurrentUser();
    setUserId(currentUserId);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUserId('');
    setActivePage(ROUTES.DASHBOARD);
  };

  const handleNavigate = (page, workerId = null) => {
    setActivePage(page);
    setSelectedWorkerId(workerId);
  };

  const handleProfileClick = () => {
    // Placeholder for profile functionality
    console.log('Profile clicked');
  };

  const getPageTitle = () => {
    switch (activePage) {
      case ROUTES.DASHBOARD:
        return 'Dashboard';
      case ROUTES.YIELDS:
        return 'Yields & Sales';
      case ROUTES.WORKERS:
        return 'Worker Management';
      case ROUTES.WORKER_DETAILS:
        return 'Worker Details';
      case ROUTES.FINANCIALS:
        return 'Financial Analytics';
      case ROUTES.INVENTORY:
        return 'Inventory';
      case ROUTES.REPORTS:
        return 'Reports & Analytics';
      default:
        return 'FarmSync';
    }
  };

  const renderActivePage = () => {
    switch (activePage) {
      case ROUTES.DASHBOARD:
        return <Dashboard />;
      case ROUTES.YIELDS:
        return <YieldManagement />;
      case ROUTES.WORKERS:
      case ROUTES.WORKER_DETAILS:
        return (
          <WorkerManagement 
            activePage={activePage}
            onNavigate={handleNavigate}
            selectedWorkerId={selectedWorkerId}
          />
        );
      case ROUTES.FINANCIALS:
        return <FinancialAnalytics />;
      case ROUTES.INVENTORY:
        return <div className="p-8 text-center text-gray-500">Inventory module coming soon...</div>;
      case ROUTES.REPORTS:
        return <div className="p-8 text-center text-gray-500">Reports module coming soon...</div>;
      default:
        return <Dashboard />;
    }
  };

  // Show authentication module if not authenticated
  if (!isAuthenticated) {
    return <AuthModule onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex space-x-8 font-sans antialiased">
      <style>{`
        body {
          margin: 0;
        }
      `}</style>
      
      <Sidebar 
        activePage={activePage} 
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />
      
      <div className="flex-1 flex flex-col rounded-2xl shadow-xl overflow-hidden">
        <TopBar 
          title={getPageTitle()} 
          userId={userId}
          onProfileClick={handleProfileClick}
        />
        
        <main className="flex-1 bg-gray-50 overflow-y-auto">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
};

export default App;
