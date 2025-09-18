import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  QrCode, 
  Camera, 
  Search, 
  MapPin,
  Calendar,
  Thermometer,
  Truck,
  CheckCircle,
  Shield,
  Leaf
} from 'lucide-react';

export const QRScanner = () => {
  const [scanMode, setScanMode] = useState<'camera' | 'manual'>('camera');
  const [productId, setProductId] = useState('');
  const [scannedProduct, setScannedProduct] = useState<any>(null);

  // Mock product data that would come from blockchain
  const mockProductData = {
    id: 'AG-TOM-2024-001234',
    name: 'Organic Roma Tomatoes',
    farmer: {
      name: 'Green Valley Farms',
      location: 'California, USA',
      certification: 'USDA Organic'
    },
    harvest: {
      date: '2024-01-15',
      quality: 'A+',
      weight: '500 lbs'
    },
    journey: [
      {
        stage: 'Farm Registration',
        timestamp: '2024-01-15T08:00:00Z',
        location: 'Green Valley Farms, CA',
        actor: 'John Smith (Farmer)',
        temperature: '18°C',
        status: 'completed'
      },
      {
        stage: 'Quality Inspection',
        timestamp: '2024-01-15T14:30:00Z',
        location: 'Green Valley Farms, CA',
        actor: 'Sarah Johnson (Inspector)',
        temperature: '18°C',
        status: 'completed'
      },
      {
        stage: 'Transportation',
        timestamp: '2024-01-16T06:00:00Z',
        location: 'Highway 101, CA',
        actor: 'FreshTrans Logistics',
        temperature: '4°C',
        status: 'completed'
      },
      {
        stage: 'Warehouse Receipt',
        timestamp: '2024-01-16T18:45:00Z',
        location: 'FreshMart Distribution, CA',
        actor: 'Mike Wilson (Receiver)',
        temperature: '4°C',
        status: 'completed'
      },
      {
        stage: 'Retail Display',
        timestamp: '2024-01-17T09:15:00Z',
        location: 'SuperFresh Market, CA',
        actor: 'Lisa Chen (Manager)',
        temperature: '6°C',
        status: 'current'
      }
    ],
    blockchain: {
      hash: '0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p',
      block: '15,234,567',
      network: 'Ethereum',
      gasUsed: '0.0023 ETH'
    }
  };

  const handleScan = () => {
    // Simulate scanning/searching
    setScannedProduct(mockProductData);
  };

  const handleManualSearch = () => {
    if (productId) {
      setScannedProduct(mockProductData);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Product Verification</h1>
          <p className="text-muted-foreground">
            Scan QR code or enter product ID to view complete supply chain history
          </p>
        </div>

        {/* Scanner Interface */}
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <QrCode className="h-5 w-5 text-forest" />
                <span>Product Scanner</span>
              </CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant={scanMode === 'camera' ? 'default' : 'outline'}
                  onClick={() => setScanMode('camera')}
                  size="sm"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Camera
                </Button>
                <Button 
                  variant={scanMode === 'manual' ? 'default' : 'outline'}
                  onClick={() => setScanMode('manual')}
                  size="sm"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Manual
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {scanMode === 'camera' ? (
              <div className="text-center space-y-4">
                <div className="w-64 h-64 mx-auto bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-forest/30">
                  <div className="text-center space-y-2">
                    <Camera className="h-12 w-12 text-forest mx-auto" />
                    <p className="text-muted-foreground">Camera viewfinder</p>
                    <p className="text-sm text-muted-foreground">Position QR code in center</p>
                  </div>
                </div>
                <Button onClick={handleScan} className="bg-forest hover:bg-forest/90">
                  <QrCode className="h-4 w-4 mr-2" />
                  Start Scanning
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter Product ID (e.g., AG-TOM-2024-001234)"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleManualSearch} className="bg-forest hover:bg-forest/90">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Information */}
        {scannedProduct && (
          <div className="space-y-6">
            {/* Product Overview */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl text-foreground">{scannedProduct.name}</CardTitle>
                    <CardDescription className="text-lg">ID: {scannedProduct.id}</CardDescription>
                  </div>
                  <Badge className="bg-growth text-white">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Verified Authentic
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3">
                    <Leaf className="h-5 w-5 text-forest" />
                    <div>
                      <p className="font-medium">Farm Origin</p>
                      <p className="text-sm text-muted-foreground">{scannedProduct.farmer.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-harvest" />
                    <div>
                      <p className="font-medium">Harvest Date</p>
                      <p className="text-sm text-muted-foreground">{scannedProduct.harvest.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-blockchain" />
                    <div>
                      <p className="font-medium">Quality Grade</p>
                      <p className="text-sm text-muted-foreground">{scannedProduct.harvest.quality}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supply Chain Journey */}
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Supply Chain Journey</CardTitle>
                <CardDescription>Complete transparent history from farm to shelf</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scannedProduct.journey.map((step, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-start space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.status === 'completed' ? 'bg-growth text-white' : 
                          step.status === 'current' ? 'bg-harvest text-white' : 'bg-muted'
                        }`}>
                          {step.status === 'completed' ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 pb-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-foreground">{step.stage}</h4>
                            <Badge variant={step.status === 'current' ? 'default' : 'secondary'}>
                              {step.status === 'completed' ? 'Completed' : 'Current'}
                            </Badge>
                          </div>
                          <div className="grid md:grid-cols-3 gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span>{step.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Thermometer className="h-3 w-3" />
                              <span>{step.temperature}</span>
                            </div>
                            <div>
                              <span>{step.actor}</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(step.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {index < scannedProduct.journey.length - 1 && (
                        <div className="absolute left-4 top-8 bottom-0 w-px bg-border"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Blockchain Information */}
            <Card className="border-0 shadow-soft border-blockchain/20 bg-blockchain/5">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blockchain">
                  <Shield className="h-5 w-5" />
                  <span>Blockchain Verification</span>
                </CardTitle>
                <CardDescription>Immutable record stored on distributed ledger</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-foreground">Transaction Hash</p>
                    <p className="text-muted-foreground font-mono break-all">{scannedProduct.blockchain.hash}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Block Number</p>
                    <p className="text-muted-foreground">{scannedProduct.blockchain.block}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Network</p>
                    <p className="text-muted-foreground">{scannedProduct.blockchain.network}</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Gas Used</p>
                    <p className="text-muted-foreground">{scannedProduct.blockchain.gasUsed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};