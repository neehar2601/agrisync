import React, { useState } from 'react';
import YieldForm from './YieldForm';
import { formatDate, formatNumber } from '../../utils/formatters';

const YieldTracker = () => {
  const [yields, setYields] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [filterCrop, setFilterCrop] = useState('all');

  const handleAddYield = (newYield) => {
    setYields([...yields, { ...newYield, id: Date.now() }]);
    setShowForm(false);
  };

  const getFilteredYields = () => {
    let filtered = [...yields];

    // Filter by period
    if (filterPeriod !== 'all') {
      const today = new Date();
      const filterDate = new Date();
      
      switch (filterPeriod) {
        case 'week':
          filterDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(today.getMonth() - 1);
          break;
        case 'quarter':
          filterDate.setMonth(today.getMonth() - 3);
          break;
        case 'year':
          filterDate.setFullYear(today.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter(item => new Date(item.harvestDate) >= filterDate);
    }

    // Filter by crop type
    if (filterCrop !== 'all') {
      filtered = filtered.filter(item => item.cropType === filterCrop);
    }

    return filtered;
  };

  const uniqueCrops = ['all', ...new Set(yields.map(item => item.cropType))];

  const getTotalQuantity = (filteredYields) => {
    return filteredYields.reduce((total, item) => {
      const quantity = parseFloat(item.quantity);
      if (item.unit === 'tons') {
        return total + (quantity * 1000); // Convert tons to kg
      }
      return total + quantity;
    }, 0);
  };

  const filteredYields = getFilteredYields();
  const totalQuantity = getTotalQuantity(filteredYields);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">Yield Tracker</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all duration-200"
        >
          {showForm ? 'Cancel' : 'Add New Harvest'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <YieldForm onSubmit={handleAddYield} />
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-wrap gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Time Period</label>
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Time</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="quarter">Past Quarter</option>
              <option value="year">Past Year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Crop Type</label>
            <select
              value={filterCrop}
              onChange={(e) => setFilterCrop(e.target.value)}
              className="p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            >
              {uniqueCrops.map(crop => (
                <option key={crop} value={crop}>
                  {crop.charAt(0).toUpperCase() + crop.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-800">
              Total Yield: {formatNumber(totalQuantity)} kg
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Crop Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quality
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredYields.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(item.harvestDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.cropType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatNumber(item.quantity)} {item.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    Grade {item.quality}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.location}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredYields.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No harvest records found for the selected filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YieldTracker;
