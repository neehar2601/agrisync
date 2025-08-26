import React from 'react';

const QuickActions = ({ onAction }) => {
  const actions = [
    { id: 'record-yield', icon: '📝', label: 'Record Yield', color: 'bg-green-500' },
    { id: 'add-worker', icon: '👥', label: 'Add Worker', color: 'bg-blue-500' },
    { id: 'record-expense', icon: '💰', label: 'Record Expense', color: 'bg-yellow-500' },
    { id: 'view-reports', icon: '📊', label: 'View Reports', color: 'bg-purple-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {actions.map(action => (
        <button
          key={action.id}
          onClick={() => onAction(action.id)}
          className={`${action.color} hover:opacity-90 text-white p-4 rounded-xl shadow-md transition-all duration-200 flex flex-col items-center justify-center space-y-2`}
        >
          <span className="text-2xl">{action.icon}</span>
          <span className="text-sm font-medium">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
