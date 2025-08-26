// Worker management main component
import React, { useState, useEffect } from 'react';
import { LoadingCard, ErrorCard } from '../../shared/components/Card';
import { ROUTES, WORKER_PAY_TYPES } from '../../shared/utils/constants';
import WorkerStats from './WorkerStats';
import WorkerList from './WorkerList';
import WorkerDetails from './WorkerDetails';
import workerService from './workerService';

const WorkerManagement = ({ activePage, onNavigate }) => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      setError(null);
      const workersData = await workerService.getWorkers();
      setWorkers(workersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activePage === ROUTES.WORKERS) {
      fetchWorkers();
      setSelectedWorkerId(null);
    }
  }, [activePage]);

  const handleAddWorker = async () => {
    // Simple demo implementation - in a real app, this would open a form modal
    try {
      await workerService.addWorker({
        name: 'New Worker',
        role: 'Farm Assistant',
        payRate: 500,
        payType: WORKER_PAY_TYPES.DAILY
      });
      await fetchWorkers();
    } catch (error) {
      console.error('Error adding worker:', error);
    }
  };

  const handleViewDetails = (workerId) => {
    setSelectedWorkerId(workerId);
    onNavigate(ROUTES.WORKER_DETAILS, workerId);
  };

  const handleBackToList = () => {
    setSelectedWorkerId(null);
    onNavigate(ROUTES.WORKERS);
  };

  // Show worker details if we're on the worker details page
  if (activePage === ROUTES.WORKER_DETAILS && selectedWorkerId) {
    return (
      <WorkerDetails 
        workerId={selectedWorkerId} 
        onBack={handleBackToList}
      />
    );
  }

  if (loading) {
    return (
      <div className="p-8">
        <LoadingCard message="Loading worker management data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <ErrorCard message={error} onRetry={fetchWorkers} />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Worker Statistics */}
      <WorkerStats workers={workers} />
      
      {/* Worker List */}
      <WorkerList 
        workers={workers}
        onAddWorker={handleAddWorker}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
};

export default WorkerManagement;
