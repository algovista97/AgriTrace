import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tractor, Truck, Building2, Store, User } from 'lucide-react';

export const StakeholderRoles = () => {
  const stakeholders = [
    {
      icon: <Tractor className="h-8 w-8" />,
      role: "Farmer",
      description: "Register produce, record harvest data, and initial quality metrics",
      responsibilities: ["Crop registration", "Harvest logging", "Quality certification", "Organic verification"],
      color: "bg-earth text-white"
    },
    {
      icon: <Truck className="h-8 w-8" />,
      role: "Distributor",
      description: "Update transportation conditions and logistics information",
      responsibilities: ["Transport logging", "Temperature monitoring", "Route tracking", "Delivery confirmation"],
      color: "bg-blockchain text-white"
    },
    {
      icon: <Building2 className="h-8 w-8" />,
      role: "Wholesaler",
      description: "Manage bulk distribution and quality checks",
      responsibilities: ["Bulk processing", "Quality inspection", "Storage conditions", "Distribution planning"],
      color: "bg-harvest text-white"
    },
    {
      icon: <Store className="h-8 w-8" />,
      role: "Retailer",
      description: "Final quality verification and consumer-facing information",
      responsibilities: ["Final inspection", "Shelf management", "Consumer information", "Sales tracking"],
      color: "bg-growth text-white"
    },
    {
      icon: <User className="h-8 w-8" />,
      role: "Consumer",
      description: "Scan QR codes to verify authenticity and view complete journey",
      responsibilities: ["QR code scanning", "Product verification", "Feedback submission", "Trust validation"],
      color: "bg-forest text-white"
    }
  ];

  return (
    <section className="py-20 px-4 bg-secondary/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">Ecosystem Participants</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Every Stakeholder Matters
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform connects all participants in the agricultural supply chain, 
            ensuring transparency and accountability at every step.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stakeholders.map((stakeholder, index) => (
            <Card key={index} className="border-0 shadow-soft hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className={`w-16 h-16 rounded-lg ${stakeholder.color} flex items-center justify-center mb-4`}>
                  {stakeholder.icon}
                </div>
                <CardTitle className="text-xl mb-2">{stakeholder.role}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {stakeholder.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stakeholder.responsibilities.map((responsibility, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-forest"></div>
                      <span className="text-sm text-muted-foreground">{responsibility}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};