// Yield management main component
import React, { useState, useEffect } from 'react';
import { LoadingCard, ErrorCard } from '../../shared/components/Card';
import AddYieldForm from './AddYieldForm';
import RecordSaleForm from './RecordSaleForm';
import SalesHistoryTable from './SalesHistoryTable';
import yieldService from './yieldService';

const YieldManagement = () => {
  const [yields, setYields] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [yieldsData, salesData] = await Promise.all([
        yieldService.getYields(),
        yieldService.getSales()
      ]);
      
      setYields(yieldsData);
      setSales(salesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddYield = async (yieldData) => {
    try {
      await yieldService.addYield(yieldData);
      await fetchData(); // Refresh data
    } catch (error) {
      throw error;
    }
  };

  const handleRecordSale = async (saleData) => {
    try {
      await yieldService.recordSale(saleData);
      await fetchData(); // Refresh data
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <LoadingCard message="Loading yield management data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <ErrorCard message={error} onRetry={fetchData} />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Forms Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AddYieldForm onYieldAdded={handleAddYield} />
        <RecordSaleForm yields={yields} onSaleRecorded={handleRecordSale} />
      </div>

      {/* Sales History */}
      <SalesHistoryTable sales={sales} />
    </div>
  );
};

export default YieldManagement;
