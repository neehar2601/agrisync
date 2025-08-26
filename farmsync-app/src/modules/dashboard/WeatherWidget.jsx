// Weather widget component
import React from 'react';
import { Card, Button } from '../../shared/components/Card';

const WeatherWidget = ({ data }) => {
  const weather = data || {
    temp: '30°C',
    windSpeed: '10 km/h',
    humidity: '75%',
    condition: 'Sunny',
    forecast: '5 Day Forecast'
  };

  return (
    <Card title="Weather Data (Mock)" className="space-y-4">
      <div className="flex items-center justify-between text-lg">
        <div className="flex flex-col items-center">
          <span className="text-4xl">☀️</span>
          <span className="mt-2 text-gray-600">{weather.condition}</span>
        </div>
        <div className="text-center">
          <span className="text-4xl font-bold">{weather.temp}</span>
          <p className="text-gray-500">Current Temp</p>
        </div>
      </div>
      
      <div className="flex justify-around text-center">
        <div>
          <p className="text-lg font-semibold">{weather.windSpeed}</p>
          <p className="text-sm text-gray-500">Wind Speed</p>
        </div>
        <div>
          <p className="text-lg font-semibold">{weather.humidity}</p>
          <p className="text-sm text-gray-500">Humidity</p>
        </div>
      </div>
      
      <button className="w-full bg-green-500 text-white p-3 rounded-xl shadow-md hover:bg-green-600 transition">
        {weather.forecast}
      </button>
    </Card>
  );
};

export default WeatherWidget;
