// Reusable card components
import React from 'react';

export const StatsCard = ({ title, value, icon, color = 'text-gray-800' }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
    <div>
      <h3 className="text-lg font-semibold text-gray-500">{title}</h3>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
    <span className="text-4xl">{icon}</span>
  </div>
);

export const Card = ({ title, children, className = '', actions = null }) => (
  <div className={`bg-white p-6 rounded-2xl shadow-lg ${className}`}>
    {title && (
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">{title}</h3>
        {actions && <div className="flex space-x-2">{actions}</div>}
      </div>
    )}
    {children}
  </div>
);

export const LoadingCard = ({ message = 'Loading...' }) => (
  <Card>
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mr-3"></div>
      <span className="text-gray-500">{message}</span>
    </div>
  </Card>
);

export const ErrorCard = ({ message, onRetry }) => (
  <Card>
    <div className="text-center py-8">
      <div className="text-red-500 text-4xl mb-4">⚠️</div>
      <p className="text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  </Card>
);
