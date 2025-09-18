import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="border-0 shadow-soft hover:shadow-strong transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
      <CardHeader className="text-center pb-4">
        <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center mx-auto mb-4 text-forest">
          {icon}
        </div>
        <CardTitle className="text-xl mb-2">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-center text-base leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};