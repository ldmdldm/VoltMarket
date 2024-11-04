import React from 'react';
import { CircuitBoard, Settings, User, Bell } from 'lucide-react';
import { EnergyStats } from './components/EnergyStats';
import { MarketPlace } from './components/MarketPlace';
import { SmartGridStatus } from './components/SmartGridStatus';
import { CommunityRewards } from './components/CommunityRewards';

function App() {
  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <CircuitBoard className="h-8 w-8 text-red-500" />
              <span className="ml-2 text-xl font-bold gradient-text">VoltMarket</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                <Bell className="h-6 w-6" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                <Settings className="h-6 w-6" />
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                <User className="h-5 w-5" />
                <span className="text-sm font-medium">1,560 VOLT</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="card bg-gradient-to-br from-gray-900 to-gray-800 border-none">
              <h1 className="text-3xl font-bold mb-2 gradient-text">Welcome to VoltMarket</h1>
              <p className="text-gray-400">Trade energy peer-to-peer and earn VOLT tokens for sustainable production</p>
              <div className="mt-4 flex gap-2">
                <div className="bg-gray-800 rounded-lg p-3 flex-1">
                  <p className="text-sm text-gray-400">Your Energy Balance</p>
                  <p className="text-xl font-bold">25.4 kWh</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 flex-1">
                  <p className="text-sm text-gray-400">Green Rewards</p>
                  <p className="text-xl font-bold text-green-500">+15.2 VOLT</p>
                </div>
              </div>
            </div>
            <EnergyStats />
          </div>
          <MarketPlace />
        </div>
        
        <SmartGridStatus />
        <CommunityRewards />
      </main>
    </div>
  );
}

export default App;