import React from 'react';
import { Activity, Cpu, Network, Shield } from 'lucide-react';

const gridMetrics = [
  {
    icon: <Activity className="text-purple-500" />,
    label: 'Grid Stability',
    value: '99.8%',
    status: 'Optimal',
    color: 'text-green-500'
  },
  {
    icon: <Network className="text-blue-500" />,
    label: 'Network Load',
    value: '76%',
    status: 'Moderate',
    color: 'text-yellow-500'
  },
  {
    icon: <Shield className="text-red-500" />,
    label: 'Security Status',
    value: '100%',
    status: 'Protected',
    color: 'text-green-500'
  },
  {
    icon: <Cpu className="text-green-500" />,
    label: 'Smart Contracts',
    value: '2.4k',
    status: 'Active',
    color: 'text-blue-500'
  }
];

export const SmartGridStatus: React.FC = () => {
  return (
    <div className="card">
      <h2 className="text-2xl font-bold gradient-text mb-6">Smart Grid Status</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {gridMetrics.map((metric, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              {metric.icon}
              <span className="font-medium">{metric.label}</span>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{metric.value}</p>
              <p className={`text-sm ${metric.color}`}>{metric.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}