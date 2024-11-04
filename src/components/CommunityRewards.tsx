import React from 'react';
import { Trophy, Users, Star, Award } from 'lucide-react';

const leaderboard = [
  { rank: 1, name: 'GreenPower Hub', contribution: '1,245 kWh', rewards: '680 VOLT' },
  { rank: 2, name: 'SolarFlow', contribution: '982 kWh', rewards: '520 VOLT' },
  { rank: 3, name: 'WindMaster', contribution: '756 kWh', rewards: '410 VOLT' },
];

export const CommunityRewards: React.FC = () => {
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold gradient-text">Community & Rewards</h2>
        <div className="flex items-center gap-2">
          <Trophy className="text-yellow-500" />
          <span className="font-medium">Top Contributors</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Users className="text-blue-500" />
              <span className="font-medium">Your Community Impact</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Energy Shared</p>
                <p className="text-xl font-bold">324 kWh</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Network Contribution</p>
                <p className="text-xl font-bold text-green-500">+12%</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Star className="text-yellow-500" />
              <span className="font-medium">Achievements</span>
            </div>
            <div className="flex gap-2">
              <div className="bg-gray-900 p-2 rounded-lg">
                <Award className="h-6 w-6 text-purple-500" />
              </div>
              <div className="bg-gray-900 p-2 rounded-lg">
                <Trophy className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="bg-gray-900 p-2 rounded-lg">
                <Star className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="font-medium mb-4">Top Contributors</h3>
          <div className="space-y-3">
            {leaderboard.map((item) => (
              <div key={item.rank} className="flex items-center justify-between p-2 bg-gray-900 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 flex items-center justify-center rounded-full ${
                    item.rank === 1 ? 'bg-yellow-500' :
                    item.rank === 2 ? 'bg-gray-400' :
                    'bg-orange-700'
                  } text-black font-bold text-sm`}>
                    {item.rank}
                  </span>
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">{item.contribution}</p>
                  <p className="text-sm font-medium text-green-500">{item.rewards}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}