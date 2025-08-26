import React, { useState } from 'react';
import { formatDate } from '../../utils/formatters';

const YieldForm = ({ onSubmit }) => {
  const [yieldData, setYieldData] = useState({
    cropType: '',
    quantity: '',
    unit: 'kg',
    harvestDate: '',
    quality: 'A',
    notes: '',
    location: '',
  });

  const qualityGrades = [
    { grade: 'A', description: 'Premium Quality' },
    { grade: 'B', description: 'Standard Quality' },
    { grade: 'C', description: 'Below Standard' },
    { grade: 'D', description: 'Low Quality' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(yieldData);
    setYieldData({
      cropType: '',
      quantity: '',
      unit: 'kg',
      harvestDate: '',
      quality: 'A',
      notes: '',
      location: '',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-700 mb-2">Crop Type</label>
          <input
            type="text"
            value={yieldData.cropType}
            onChange={(e) => setYieldData({ ...yieldData, cropType: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Quantity</label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={yieldData.quantity}
              onChange={(e) => setYieldData({ ...yieldData, quantity: e.target.value })}
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              required
            />
            <select
              value={yieldData.unit}
              onChange={(e) => setYieldData({ ...yieldData, unit: e.target.value })}
              className="w-24 p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            >
              <option value="kg">kg</option>
              <option value="tons">tons</option>
              <option value="units">units</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Harvest Date</label>
          <input
            type="date"
            value={yieldData.harvestDate}
            onChange={(e) => setYieldData({ ...yieldData, harvestDate: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Quality Grade</label>
          <select
            value={yieldData.quality}
            onChange={(e) => setYieldData({ ...yieldData, quality: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
          >
            {qualityGrades.map(({ grade, description }) => (
              <option key={grade} value={grade}>
                Grade {grade} - {description}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Location</label>
          <input
            type="text"
            value={yieldData.location}
            onChange={(e) => setYieldData({ ...yieldData, location: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            placeholder="Field or plot number"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2">Notes</label>
          <textarea
            value={yieldData.notes}
            onChange={(e) => setYieldData({ ...yieldData, notes: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            rows="3"
            placeholder="Additional notes about the harvest"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-600 transition-all duration-200"
        >
          Record Harvest
        </button>
      </div>
    </form>
  );
};

export default YieldForm;
