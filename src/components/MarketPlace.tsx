import React, { useState } from 'react';
import { ShoppingCart, TrendingUp, Battery, Zap, AlertCircle } from 'lucide-react';

export const MarketPlace: React.FC = () => {
  const [currentPrice, setCurrentPrice] = useState(0.12);
  const [priceChange, setPriceChange] = useState(+2.5);

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold gradient-text">Energy Market</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Current Rate:</span>
            <span className="text-lg font-bold text-red-500">{currentPrice} VOLT/kWh</span>
          </div>
          <div className={`flex items-center gap-1 ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            <TrendingUp size={16} />
            <span className="text-sm font-medium">{priceChange}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Battery className="text-red-500" />
              <span className="font-medium">Buy Energy</span>
            </div>
            <div className="text-sm text-gray-400">Balance: 1,240 VOLT</div>
          </div>
          <input
            type="number"
            placeholder="Amount (kWh)"
            className="input w-full mb-3"
          />
          <div className="flex justify-between text-sm text-gray-400 mb-3">
            <span>Total Cost:</span>
            <span>≈ 148.8 VOLT</span>
          </div>
          <button className="btn btn-primary w-full">
            Purchase Now
          </button>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Zap className="text-yellow-500" />
              <span className="font-medium">Sell Energy</span>
            </div>
            <div className="text-sm text-gray-400">Available: 25.4 kWh</div>
          </div>
          <input
            type="number"
            placeholder="Amount (kWh)"
            className="input w-full mb-3"
          />
          <div className="flex justify-between text-sm text-gray-400 mb-3">
            <span>You'll Receive:</span>
            <span>≈ 120 VOLT</span>
          </div>
          <button className="btn btn-primary w-full">
            List for Sale
          </button>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <AlertCircle size={16} />
            <span>Smart contract verified</span>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { type: 'Bought', amount: '5.2 kWh', price: '62.4 VOLT', time: '2 mins ago' },
            { type: 'Sold', amount: '3.1 kWh', price: '37.2 VOLT', time: '5 mins ago', reward: '+5 VOLT' },
            { type: 'Bought', amount: '2.8 kWh', price: '33.6 VOLT', time: '12 mins ago' },
          ].map((tx, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`${tx.type === 'Bought' ? 'text-red-500' : 'text-yellow-500'}`}>
                  {tx.type === 'Bought' ? <Battery size={20} /> : <Zap size={20} />}
                </div>
                <div>
                  <p className="font-medium">{tx.type} {tx.amount}</p>
                  <p className="text-sm text-gray-400">{tx.time}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-medium">{tx.price}</span>
                {tx.reward && (
                  <p className="text-sm text-green-500">{tx.reward} Green Reward</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};