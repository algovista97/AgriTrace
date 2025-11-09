import React from 'react';
import { Navigation } from '@/components/Navigation';
import BlockchainDashboard from '@/components/BlockchainDashboard';
import { useProductIndexer } from '@/hooks/useProductIndexer';

const Dashboard = () => {
  // Run the product indexer hook once to sync Supabase + blockchain
  useProductIndexer();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Navigation Bar */}
      <header>
        <Navigation />
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 p-4">
        <React.Suspense fallback={<div>Loading blockchain data...</div>}>
          <BlockchainDashboard />
        </React.Suspense>
      </main>
    </div>
  );
};

export default Dashboard;
