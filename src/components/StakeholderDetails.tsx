import React from 'react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';

interface StakeholderDetailsProps {
  product: {
    farmer: string;
    farmerName?: string;
    farmerOrganization?: string;
    farmerRegisteredAt?: number;
    distributor?: string;
    distributorName?: string;
    distributorOrganization?: string;
    distributorAddedAt?: number;
    retailer?: string;
    retailerName?: string;
    retailerOrganization?: string;
    retailerAddedAt?: number;
    soldAt?: number;
  };
}

const formatDate = (timestamp?: number): string => {
  if (!timestamp || timestamp === 0) return '—';
  const date = new Date(timestamp * 1000);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};

export const StakeholderDetails: React.FC<StakeholderDetailsProps> = ({ product }) => {
  const { profile } = useAuth();
  
  // Fallback logic: use blockchain data first, then profile data from signup
  const farmerDisplayName = product.farmerName || profile?.fullName || '—';
  const farmerDisplayOrg = product.farmerOrganization || profile?.organization || '—';
  const farmerDisplayLocation = profile?.location || '—';
  
  // For distributor and retailer, we can't use current user's profile as fallback
  // since they might be different users. Only use blockchain data or show "—"
  const distributorDisplayName = product.distributorName || '—';
  const distributorDisplayOrg = product.distributorOrganization || '—';
  
  const retailerDisplayName = product.retailerName || '—';
  const retailerDisplayOrg = product.retailerOrganization || '—';
  
  return (
    <div className="mt-6 pt-6 border-t">
      <h4 className="text-sm font-semibold mb-4">Stakeholder Details</h4>
      <div className="space-y-4">
        {/* Farmer Section */}
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">Farmer:</p>
          <div className="pl-4 space-y-1 text-sm text-muted-foreground">
            <p>
              <span className="font-medium">Name:</span>{' '}
              {farmerDisplayName}
            </p>
            <p>
              <span className="font-medium">Organization:</span>{' '}
              {farmerDisplayOrg}
            </p>
            {farmerDisplayLocation !== '—' && (
              <p>
                <span className="font-medium">Location:</span>{' '}
                {farmerDisplayLocation}
              </p>
            )}
            <p>
              <span className="font-medium">Wallet Address:</span>{' '}
              <span className="font-mono">{product.farmer || '—'}</span>
            </p>
            <p>
              <span className="font-medium">Registered On:</span>{' '}
              {formatDate(product.farmerRegisteredAt)}
            </p>
          </div>
        </div>

        <Separator />

        {/* Distributor Section */}
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">Distributor:</p>
          {product.distributor ? (
            <div className="pl-4 space-y-1 text-sm text-muted-foreground">
              <p>
                <span className="font-medium">Name:</span>{' '}
                {distributorDisplayName}
              </p>
              <p>
                <span className="font-medium">Organization:</span>{' '}
                {distributorDisplayOrg}
              </p>
              <p>
                <span className="font-medium">Wallet Address:</span>{' '}
                <span className="font-mono">{product.distributor}</span>
              </p>
              <p>
                <span className="font-medium">Added On:</span>{' '}
                {formatDate(product.distributorAddedAt)}
              </p>
            </div>
          ) : (
            <div className="pl-4 space-y-1 text-sm text-muted-foreground">
              <p>
                <span className="font-medium">Name:</span> —
              </p>
              <p>
                <span className="font-medium">Organization:</span> —
              </p>
              <p>
                <span className="font-medium">Wallet Address:</span> —
              </p>
              <p>
                <span className="font-medium">Status:</span> <span className="italic">Pending</span>
              </p>
            </div>
          )}
        </div>

        <Separator />

        {/* Retailer Section */}
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">Retailer:</p>
          {product.retailer ? (
            <div className="pl-4 space-y-1 text-sm text-muted-foreground">
              <p>
                <span className="font-medium">Name:</span>{' '}
                {retailerDisplayName}
              </p>
              <p>
                <span className="font-medium">Organization:</span>{' '}
                {retailerDisplayOrg}
              </p>
              <p>
                <span className="font-medium">Wallet Address:</span>{' '}
                <span className="font-mono">{product.retailer}</span>
              </p>
              <p>
                <span className="font-medium">Added On:</span>{' '}
                {formatDate(product.retailerAddedAt)}
              </p>
            </div>
          ) : (
            <div className="pl-4 space-y-1 text-sm text-muted-foreground">
              <p>
                <span className="font-medium">Name:</span> —
              </p>
              <p>
                <span className="font-medium">Organization:</span> —
              </p>
              <p>
                <span className="font-medium">Wallet Address:</span> —
              </p>
              <p>
                <span className="font-medium">Status:</span> <span className="italic">Pending</span>
              </p>
            </div>
          )}
        </div>

        {/* Sold Status (if applicable) */}
        {product.soldAt && (
          <>
            <Separator />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">Sold:</p>
              <div className="pl-4 space-y-1 text-sm text-muted-foreground">
                <p>
                  <span className="font-medium">Sold On:</span>{' '}
                  {formatDate(product.soldAt)}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

