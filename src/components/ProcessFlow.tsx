import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Leaf, Package, Truck, Building, ShoppingCart, QrCode } from 'lucide-react';

export const ProcessFlow = () => {
  const processSteps = [
    {
      icon: <Leaf className="h-6 w-6" />,
      title: "Farm Registration",
      description: "Farmer registers produce with origin data, harvest date, and quality metrics",
      blockchain: "Smart contract creates immutable record of product origin"
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "QR Code Generation",
      description: "Unique QR code generated and linked to blockchain record",
      blockchain: "Product ID stored on-chain with initial metadata"
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Transportation",
      description: "Distributors update location, temperature, and transport conditions",
      blockchain: "Transport data appended to blockchain with timestamps"
    },
    {
      icon: <Building className="h-6 w-6" />,
      title: "Processing & Distribution",
      description: "Wholesalers perform quality checks and update storage conditions",
      blockchain: "Processing steps and quality metrics recorded immutably"
    },
    {
      icon: <ShoppingCart className="h-6 w-6" />,
      title: "Retail & Sale",
      description: "Retailers verify final quality and make product available to consumers",
      blockchain: "Final quality verification and retail information added"
    },
    {
      icon: <QrCode className="h-6 w-6" />,
      title: "Consumer Verification",
      description: "Customers scan QR code to view complete journey and verify authenticity",
      blockchain: "Consumer access logged with full transparency"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Blockchain Process</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            From Farm to Fork Journey
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Follow the complete journey of agricultural products through our blockchain-secured 
            supply chain with full transparency and traceability.
          </p>
        </div>
        
        <div className="space-y-8">
          {processSteps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="border-0 shadow-soft hover:shadow-strong transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
                    {/* Step Number & Icon */}
                    <div className="flex items-center space-x-4 flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-forest text-white flex items-center justify-center font-bold text-lg">
                        {index + 1}
                      </div>
                      <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center text-forest">
                        {step.icon}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-semibold mb-2 text-foreground">{step.title}</h3>
                      <p className="text-muted-foreground mb-3 leading-relaxed">{step.description}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary" className="bg-blockchain/10 text-blockchain border-blockchain/20">
                          Blockchain Action
                        </Badge>
                        <span className="text-sm text-muted-foreground">{step.blockchain}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Arrow between steps */}
              {index < processSteps.length - 1 && (
                <div className="flex justify-center my-4">
                  <ArrowRight className="h-6 w-6 text-forest" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Summary Card */}
        <Card className="mt-12 border-forest/20 bg-forest/5">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-forest">Complete Transparency Achieved</CardTitle>
            <CardDescription className="text-base">
              Every step is recorded immutably on the blockchain, creating an unbreakable 
              chain of trust from farm to consumer.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </section>
  );
};