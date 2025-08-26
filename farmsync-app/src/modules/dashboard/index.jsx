// Dashboard main component
import React, { useState, useEffect } from 'react';
import { LoadingCard, ErrorCard } from '../../shared/components/Card';
import DashboardMetrics from './DashboardMetrics';
import FinancialTrendsChart from './FinancialTrendsChart';
import WeatherWidget from './WeatherWidget';
import dashboardService from './dashboardService';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await dashboardService.getDashboardData();
      setData(dashboardData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <LoadingCard message="Loading dashboard data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <ErrorCard message={error} onRetry={fetchDashboardData} />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Key Metrics */}
      <DashboardMetrics data={data} />

      {/* Charts and Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FinancialTrendsChart data={data.financialTrends || []} />
        <WeatherWidget data={data.weather} />
      </div>
    </div>
  );
};

export default Dashboard;
