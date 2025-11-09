import React from 'react';
import { CheckCircle2, Clock, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SupplyChainStep {
  label: string;
  active: boolean;
  name?: string;
  organization?: string;
  address?: string;
  isCompleted: boolean;
}

interface SupplyChainTimelineProps {
  product: {
    farmer: string;
    farmerName?: string;
    farmerOrganization?: string;
    distributor?: string;
    distributorName?: string;
    distributorOrganization?: string;
    retailer?: string;
    retailerName?: string;
    retailerOrganization?: string;
    statusLabel: string;
    statusIndex?: number;
  };
  truncateAddress?: (address: string) => string;
}

export const SupplyChainTimeline: React.FC<SupplyChainTimelineProps> = ({
  product,
  truncateAddress = (addr) => (addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : ''),
}) => {
  // Status-based completion logic
  // ProductStatus: Harvested (0), AtDistributor (1), AtRetailer (2), Sold (3)
  const statusIndex = product.statusIndex ?? 0;
  const isSold = product.statusLabel === 'Sold' || statusIndex >= 3;
  
  // Determine completion based on status progression
  const farmerCompleted = !!product.farmer || isSold;
  const distributorCompleted = (statusIndex >= 1 || !!product.distributor) || isSold;
  const retailerCompleted = (statusIndex >= 2 || !!product.retailer) || isSold;
  const soldCompleted = isSold;
  
  const steps: SupplyChainStep[] = [
    {
      label: 'Farmer',
      active: farmerCompleted,
      name: product.farmerName,
      organization: product.farmerOrganization,
      address: product.farmer,
      isCompleted: farmerCompleted,
    },
    {
      label: 'Distributor',
      active: distributorCompleted,
      name: product.distributorName,
      organization: product.distributorOrganization,
      address: product.distributor,
      isCompleted: distributorCompleted,
    },
    {
      label: 'Retailer',
      active: retailerCompleted,
      name: product.retailerName,
      organization: product.retailerOrganization,
      address: product.retailer,
      isCompleted: retailerCompleted,
    },
    {
      label: 'Sold',
      active: soldCompleted,
      isCompleted: soldCompleted,
    },
  ];

  return (
    <TooltipProvider>
      <div className="w-full py-4">
        <div className="flex items-start justify-between relative">
          {/* Connecting lines */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-border -z-10">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{
                width: `${((steps.filter((s) => s.isCompleted).length - 1) / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>

          {/* Steps */}
          {steps.map((step, index) => (
            <div key={step.label} className="flex flex-col items-center flex-1 relative z-10">
              {/* Step circle */}
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                  step.isCompleted
                    ? 'bg-primary border-primary text-primary-foreground'
                    : step.active
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-muted border-muted-foreground/20 text-muted-foreground'
                )}
              >
                {step.isCompleted ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : step.active ? (
                  <Clock className="w-6 h-6" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </div>

              {/* Step label and detailed info */}
              <div className="mt-3 text-center max-w-[140px] px-1">
                <p
                  className={cn(
                    'text-sm font-semibold mb-2',
                    step.isCompleted ? 'text-foreground' : step.active ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {step.label}
                  {step.isCompleted && ' ✅'}
                </p>
                
                {step.active && step.label !== 'Sold' ? (
                  <div className="space-y-1">
                    {/* Name and Organization */}
                    {(step.name || step.organization) && (
                      <div>
                        {step.name && (
                          <p className="text-xs font-medium text-foreground">
                            {step.name}
                          </p>
                        )}
                        {step.organization && (
                          <p className="text-xs text-muted-foreground">
                            ({step.organization})
                          </p>
                        )}
                      </div>
                    )}
                    
                    {/* Wallet Address with Tooltip */}
                    {step.address && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-xs text-muted-foreground font-mono cursor-help hover:text-foreground transition-colors">
                            {truncateAddress(step.address)}
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-mono">{step.address}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                ) : !step.active && step.label !== 'Sold' ? (
                  <p className="text-xs text-muted-foreground italic">Pending</p>
                ) : step.label === 'Sold' && step.isCompleted ? (
                  <p className="text-xs text-muted-foreground">Completed</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

