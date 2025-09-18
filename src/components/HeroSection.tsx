import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Leaf, Shield, Globe } from 'lucide-react';
import heroImage from '@/assets/hero-blockchain-farm.jpg';

export const HeroSection = () => {
  return (
    <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-background via-muted/20 to-secondary/30">
      {/* Hero Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Blockchain agricultural supply chain" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/90"></div>
      </div>
      
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10 z-0">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-forest"></div>
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-harvest"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 rounded-full bg-growth"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            <Leaf className="h-4 w-4 mr-2" />
            Blockchain Agriculture Revolution
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="text-forest">Transparent</span>{' '}
            <span className="text-foreground">Supply Chain</span><br />
            <span className="text-harvest">for Agriculture</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Track every agricultural product from farm to fork with blockchain technology. 
            Build trust, ensure quality, and create transparency for farmers, distributors, 
            retailers, and consumers.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-forest hover:bg-forest/90 shadow-lg">
              <Shield className="h-4 w-4 mr-2" />
              Start Tracking
            </Button>
            <Button size="lg" variant="outline" className="border-forest text-forest hover:bg-forest/10">
              <Globe className="h-4 w-4 mr-2" />
              Explore Platform
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-forest mb-2">10M+</div>
              <div className="text-muted-foreground">Products Tracked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-harvest mb-2">5K+</div>
              <div className="text-muted-foreground">Active Farmers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-growth mb-2">99.9%</div>
              <div className="text-muted-foreground">Transparency Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};