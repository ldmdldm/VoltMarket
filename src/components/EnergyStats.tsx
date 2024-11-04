import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Battery, Zap, Wind, Sun, Leaf } from 'lucide-react';

const data = [
  { time: '00:00', production: 4000, consumption: 2400, rewards: 180 },
  { time: '04:00', production: 3000, consumption: 1398, rewards: 140 },
  { time: '08:00', production: 2000, consumption: 9800, rewards: 90 },
  { time: '12:00', production: 2780, consumption: 3908, rewards: 120 },
  { time: '16:00', production: 1890, consumption: 4800, rewards: 80 },
  { time: '20:00', production: 2390, consumption: 3800, rewards: 100 },
];

export const EnergyStats: React.FC = () => {
  return (
    <div className="card space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold gradient-text">Energy Overview</h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Battery className="text-red-500" />
            <span className="text-sm font-medium">85% Storage</span>
          </div>
          <div className="flex items-center gap-2">
            <Leaf className="text-green-500" />
            <span className="text-sm font-medium">320 VOLT</span>
          </div>
        </div>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '0.5rem'
              }}
            />
            <Area 
              type="monotone" 
              dataKey="production" 
              stroke="#EF4444" 
              fill="#EF4444" 
              fillOpacity={0.4}
            />
            <Area 
              type="monotone" 
              dataKey="consumption" 
              stroke="#6366F1" 
              fill="#6366F1" 
              fillOpacity={0.4}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg">
          <Sun className="text-yellow-500" />
          <div>
            <p className="text-sm text-gray-400">Solar Production</p>
            <p className="text-lg font-semibold">8.2 kWh</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg">
          <Wind className="text-blue-500" />
          <div>
            <p className="text-sm text-gray-400">Wind Production</p>
            <p className="text-lg font-semibold">4.1 kWh</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg">
          <Leaf className="text-green-500" />
          <div>
            <p className="text-sm text-gray-400">Green Rewards</p>
            <p className="text-lg font-semibold">320 VOLT</p>
          </div>
        </div>
      </div>
    </div>
  );
};