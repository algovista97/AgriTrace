import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Dashboard as DashboardComponent } from '@/components/Dashboard';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <DashboardComponent />
    </div>
  );
};

export default Dashboard;