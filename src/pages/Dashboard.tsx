import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Web3Provider } from '@/hooks/useWeb3';
import MetaMaskAuth from '@/components/MetaMaskAuth';
import BlockchainDashboard from '@/components/BlockchainDashboard';
import BlockchainSimulator from '@/components/BlockchainSimulator';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <Web3Provider>
          <div className="max-w-4xl mx-auto space-y-6">
            <BlockchainSimulator />
            <MetaMaskAuth />
            <BlockchainDashboard />
          </div>
        </Web3Provider>
      </div>
    </div>
  );
};

export default Dashboard;