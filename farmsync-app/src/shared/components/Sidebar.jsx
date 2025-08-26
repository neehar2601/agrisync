// Sidebar Navigation Component
import React from 'react';
import { ROUTES } from '../utils/constants';

const Sidebar = ({ activePage, onNavigate, onLogout }) => (
  <nav className="flex flex-col bg-gray-800 text-white w-64 p-4 min-h-screen rounded-2xl shadow-xl">
    <div className="flex items-center space-x-2 text-xl font-bold mb-8 text-green-400">
      <span className="text-3xl">🌱</span>
      <span>FarmSync</span>
    </div>
    <ul className="space-y-2">
      <li 
        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
          activePage === ROUTES.DASHBOARD ? 'bg-green-600' : 'hover:bg-gray-700'
        }`} 
        onClick={() => onNavigate(ROUTES.DASHBOARD)}
      >
        <span className="text-xl">🏠</span>
        <span>Dashboard</span>
      </li>
      <li 
        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
          activePage === ROUTES.YIELDS ? 'bg-green-600' : 'hover:bg-gray-700'
        }`} 
        onClick={() => onNavigate(ROUTES.YIELDS)}
      >
        <span className="text-xl">🌾</span>
        <span>Yields & Sales</span>
      </li>
      <li 
        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
          activePage === ROUTES.WORKERS ? 'bg-green-600' : 'hover:bg-gray-700'
        }`} 
        onClick={() => onNavigate(ROUTES.WORKERS)}
      >
        <span className="text-xl">👨‍🌾</span>
        <span>Worker Management</span>
      </li>
      <li 
        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
          activePage === ROUTES.FINANCIALS ? 'bg-green-600' : 'hover:bg-gray-700'
        }`} 
        onClick={() => onNavigate(ROUTES.FINANCIALS)}
      >
        <span className="text-xl">💰</span>
        <span>Financials</span>
      </li>
      <li 
        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
          activePage === ROUTES.INVENTORY ? 'bg-green-600' : 'hover:bg-gray-700'
        }`} 
        onClick={() => onNavigate(ROUTES.INVENTORY)}
      >
        <span className="text-xl">📦</span>
        <span>Inventory</span>
      </li>
      <li 
        className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
          activePage === ROUTES.REPORTS ? 'bg-green-600' : 'hover:bg-gray-700'
        }`} 
        onClick={() => onNavigate(ROUTES.REPORTS)}
      >
        <span className="text-xl">📈</span>
        <span>Reports & Analytics</span>
      </li>
    </ul>
    <div className="mt-auto pt-4 border-t border-gray-700">
      <button 
        onClick={onLogout}
        className="flex items-center space-x-3 p-3 w-full rounded-lg cursor-pointer text-red-400 hover:bg-gray-700 transition-all duration-200"
      >
        <span className="text-xl">🚪</span>
        <span>Logout</span>
      </button>
    </div>
  </nav>
);

export default Sidebar;
