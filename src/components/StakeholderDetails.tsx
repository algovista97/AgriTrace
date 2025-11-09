import React from 'react';
import { Separator } from '@/components/ui/separator';

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
              {product.farmerName || '—'}
            </p>
            <p>
              <span className="font-medium">Organization:</span>{' '}
              {product.farmerOrganization || '—'}
            </p>
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
                {product.distributorName || '—'}
              </p>
              <p>
                <span className="font-medium">Organization:</span>{' '}
                {product.distributorOrganization || '—'}
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
                {product.retailerName || '—'}
              </p>
              <p>
                <span className="font-medium">Organization:</span>{' '}
                {product.retailerOrganization || '—'}
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

