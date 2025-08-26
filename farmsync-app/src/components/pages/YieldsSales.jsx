import React, { useState } from 'react';

const YieldsSales = ({ data, onRecordSale, onAddYield }) => {
  const [newYield, setNewYield] = useState({ name: '', quantity: '', unit: 'kg' });
  const [newSale, setNewSale] = useState({ cropId: '', quantity: '', price: '', seller: '' });

  const handleAddYield = (e) => {
    e.preventDefault();
    onAddYield(newYield);
    setNewYield({ name: '', quantity: '', unit: 'kg' });
  };

  const handleRecordSale = (e) => {
    e.preventDefault();
    onRecordSale(newSale);
    setNewSale({ cropId: '', quantity: '', price: '', seller: '' });
  };

  return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
          <h3 className="text-xl font-bold mb-4">Add New Yield</h3>
          <form onSubmit={handleAddYield} className="space-y-4">
            <div>
              <label className="block text-gray-700">Crop Name</label>
              <input 
                type="text" 
                value={newYield.name} 
                onChange={(e) => setNewYield({ ...newYield, name: e.target.value })} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" 
                required 
              />
            </div>
            <div>
              <label className="block text-gray-700">Quantity</label>
              <input 
                type="number" 
                value={newYield.quantity} 
                onChange={(e) => setNewYield({ ...newYield, quantity: e.target.value })} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500" 
                required 
              />
            </div>
            <div>
              <label className="block text-gray-700">Unit</label>
              <select 
                value={newYield.unit} 
                onChange={(e) => setNewYield({ ...newYield, unit: e.target.value })} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              >
                <option value="kg">kg</option>
                <option value="tonnes">tonnes</option>
                <option value="units">units</option>
              </select>
            </div>
            <button 
              type="submit" 
              className="w-full bg-green-500 text-white p-3 rounded-lg shadow-md hover:bg-green-600 transition"
            >
              Add Yield
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
          <h3 className="text-xl font-bold mb-4">Record Sale</h3>
          <form onSubmit={handleRecordSale} className="space-y-4">
            <div>
              <label className="block text-gray-700">Crop</label>
              <select 
                value={newSale.cropId} 
                onChange={(e) => setNewSale({ ...newSale, cropId: e.target.value })} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select Crop</option>
                {data.crops.map(crop => (
                  <option key={crop.id} value={crop.id}>{crop.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700">Quantity</label>
              <input 
                type="number" 
                value={newSale.quantity} 
                onChange={(e) => setNewSale({ ...newSale, quantity: e.target.value })} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                required 
              />
            </div>
            <div>
              <label className="block text-gray-700">Price per unit</label>
              <input 
                type="number" 
                value={newSale.price} 
                onChange={(e) => setNewSale({ ...newSale, price: e.target.value })} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                required 
              />
            </div>
            <div>
              <label className="block text-gray-700">Seller Name</label>
              <input 
                type="text" 
                value={newSale.seller} 
                onChange={(e) => setNewSale({ ...newSale, seller: e.target.value })} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                required 
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-green-500 text-white p-3 rounded-lg shadow-md hover:bg-green-600 transition"
            >
              Record Sale
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default YieldsSales;
