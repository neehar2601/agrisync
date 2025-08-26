import React from 'react';

const TopBar = ({ title, userId, username }) => (
  <header className="flex items-center justify-between bg-white p-4 shadow-sm rounded-t-2xl">
    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2 text-gray-600">
        <span className="text-xl">👤</span>
        <span>{username} ({userId})</span>
      </div>
      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center font-bold text-gray-700">
        FS
      </div>
    </div>
  </header>
);

export default TopBar;
