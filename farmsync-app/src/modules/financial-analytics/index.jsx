// Financial analytics main component
import React, { useState, useEffect } from 'react';
import { LoadingCard, ErrorCard } from '../../shared/components/Card';
import FinancialOverview from './FinancialOverview';
import FinancialBreakdownCharts from './FinancialBreakdownCharts';
import TransactionHistory from './TransactionHistory';
import financialService from './financialService';

const FinancialAnalytics = () => {
  const [financials, setFinancials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFinancials = async () => {
    try {
      setLoading(true);
      setError(null);
      const financialsData = await financialService.getFinancials();
      setFinancials(financialsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancials();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <LoadingCard message="Loading financial analytics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <ErrorCard message={error} onRetry={fetchFinancials} />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Financial Overview */}
      <FinancialOverview financials={financials} />

      {/* Breakdown Charts */}
      <FinancialBreakdownCharts financials={financials} />
      
      {/* Transaction History */}
      <TransactionHistory financials={financials} />
    </div>
  );
};

export default FinancialAnalytics;
