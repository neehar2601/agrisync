import React from 'react';

const RecentActivity = ({ activities }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div 
            key={index}
            className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            <span className="text-2xl">{activity.icon}</span>
            <div className="flex-1">
              <p className="font-medium text-gray-800">{activity.description}</p>
              <p className="text-sm text-gray-500">{activity.timestamp}</p>
            </div>
            <span className={`text-sm px-3 py-1 rounded-full ${activity.type === 'financial' ? 'bg-green-100 text-green-800' : activity.type === 'yield' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
              {activity.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
