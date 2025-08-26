// Top Bar Component
import React from 'react';

const TopBar = ({ title, userId, onProfileClick }) => (
  <header className="flex items-center justify-between bg-white p-4 shadow-sm rounded-t-2xl">
    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2 text-gray-600">
        <span className="text-xl">👤</span>
        <span>User ID: {userId}</span>
      </div>
      <button
        onClick={onProfileClick}
        className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-700 hover:bg-gray-400 transition-colors"
      >
        FS
      </button>
    </div>
  </header>
);

export default TopBar;
