import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  Shield, 
  Clock,
  MapPin,
  Thermometer,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const Dashboard = () => {
  const [selectedRole, setSelectedRole] = useState('farmer');

  const mockData = {
    farmer: {
      stats: [
        { title: 'Products Registered', value: '1,247', change: '+12%', icon: Package },
        { title: 'Active Batches', value: '89', change: '+5%', icon: Clock },
        { title: 'Quality Score', value: '9.8/10', change: '+0.2', icon: Shield },
        { title: 'Revenue This Month', value: '$45,230', change: '+18%', icon: TrendingUp }
      ],
      recentActivities: [
        { id: 1, action: 'Registered new batch of organic tomatoes', time: '2 hours ago', status: 'success' },
        { id: 2, action: 'Quality inspection completed for rice batch #1234', time: '4 hours ago', status: 'success' },
        { id: 3, action: 'Temperature alert for storage unit A-7', time: '6 hours ago', status: 'warning' }
      ]
    },
    distributor: {
      stats: [
        { title: 'Shipments Tracked', value: '456', change: '+8%', icon: Package },
        { title: 'In Transit', value: '23', change: '-2%', icon: Clock },
        { title: 'On-Time Delivery', value: '96.5%', change: '+1.2%', icon: CheckCircle },
        { title: 'Temperature Compliance', value: '99.1%', change: '+0.5%', icon: Thermometer }
      ],
      recentActivities: [
        { id: 1, action: 'Shipment #567 delivered to warehouse', time: '1 hour ago', status: 'success' },
        { id: 2, action: 'Temperature monitoring updated for batch #890', time: '3 hours ago', status: 'success' },
        { id: 3, action: 'Route optimization completed', time: '5 hours ago', status: 'success' }
      ]
    },
    retailer: {
      stats: [
        { title: 'Products in Store', value: '2,341', change: '+15%', icon: Package },
        { title: 'Quality Verified', value: '2,298', change: '+14%', icon: Shield },
        { title: 'Customer Scans', value: '8,567', change: '+23%', icon: BarChart3 },
        { title: 'Trust Rating', value: '4.9/5', change: '+0.1', icon: TrendingUp }
      ],
      recentActivities: [
        { id: 1, action: 'Customer scanned QR for product verification', time: '15 minutes ago', status: 'success' },
        { id: 2, action: 'Final quality check completed for produce section', time: '2 hours ago', status: 'success' },
        { id: 3, action: 'New shipment received and verified', time: '4 hours ago', status: 'success' }
      ]
    }
  };

  const currentData = mockData[selectedRole as keyof typeof mockData];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Supply Chain Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Monitor your blockchain-secured agricultural supply chain
            </p>
          </div>
          
          {/* Role Selector */}
          <Tabs value={selectedRole} onValueChange={setSelectedRole} className="w-fit">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="farmer">Farmer</TabsTrigger>
              <TabsTrigger value="distributor">Distributor</TabsTrigger>
              <TabsTrigger value="retailer">Retailer</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentData.stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    <p className="text-sm text-growth mt-1">{stat.change}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center text-forest">
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest updates in your supply chain</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentData.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === 'success' ? 'bg-growth' : 'bg-harvest'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{activity.action}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                    <Badge variant={activity.status === 'success' ? 'default' : 'secondary'}>
                      {activity.status === 'success' ? 'Success' : 'Alert'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Supply Chain Map */}
          <Card className="border-0 shadow-soft">
            <CardHeader>
              <CardTitle>Active Shipments</CardTitle>
              <CardDescription>Real-time tracking of products in transit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-forest/5 border border-forest/20">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-forest" />
                    <div>
                      <p className="font-medium text-foreground">Batch #1234</p>
                      <p className="text-sm text-muted-foreground">Organic Tomatoes → City Market</p>
                    </div>
                  </div>
                  <Badge className="bg-growth text-white">In Transit</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg bg-harvest/5 border border-harvest/20">
                  <div className="flex items-center space-x-3">
                    <Thermometer className="h-5 w-5 text-harvest" />
                    <div>
                      <p className="font-medium text-foreground">Batch #5678</p>
                      <p className="text-sm text-muted-foreground">Fresh Lettuce → Grocery Chain</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Temperature Alert</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-growth" />
                    <div>
                      <p className="font-medium text-foreground">Batch #9012</p>
                      <p className="text-sm text-muted-foreground">Organic Rice → Supermarket</p>
                    </div>
                  </div>
                  <Badge className="bg-growth text-white">Delivered</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for your role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Package className="h-5 w-5" />
                <span>Register Product</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <BarChart3 className="h-5 w-5" />
                <span>View Analytics</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Shield className="h-5 w-5" />
                <span>Quality Check</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <MapPin className="h-5 w-5" />
                <span>Track Shipment</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};