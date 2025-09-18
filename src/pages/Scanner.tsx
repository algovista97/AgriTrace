import React from 'react';
import { Navigation } from '@/components/Navigation';
import { QRScanner } from '@/components/QRScanner';

const Scanner = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <QRScanner />
    </div>
  );
};

export default Scanner;