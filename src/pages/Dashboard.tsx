import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Web3Provider } from '@/hooks/useWeb3';
import BlockchainDashboard from '@/components/BlockchainDashboard';
import { useProductIndexer } from '@/hooks/useProductIndexer';

const DashboardWithIndexer = () => {
  useProductIndexer();
  return <BlockchainDashboard />;
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Web3Provider>
        <DashboardWithIndexer />
      </Web3Provider>
    </div>
  );
};

export default Dashboard;