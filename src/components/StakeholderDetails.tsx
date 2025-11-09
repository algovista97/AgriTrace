import React from 'react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useWeb3 } from '@/hooks/useWeb3';

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
    statusIndex?: number;
    statusLabel?: string;
  };
}

const formatDate = (timestamp?: number): string => {
  if (!timestamp || timestamp === 0) return '—';
  const date = new Date(timestamp * 1000);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};

export const StakeholderDetails: React.FC<StakeholderDetailsProps> = ({ product }) => {
  const { profile } = useAuth();
  const { account } = useWeb3();
  
  // Status-based completion logic
  // ProductStatus: Harvested (0), AtDistributor (1), AtRetailer (2), Sold (3)
  const statusIndex = product.statusIndex ?? 0;
  const isSold = product.statusLabel === 'Sold' || statusIndex >= 3;
  
  // Determine if each stage is completed
  const farmerCompleted = !!product.farmer || isSold;
  const distributorCompleted = (statusIndex >= 1 || !!product.distributor) || isSold;
  const retailerCompleted = (statusIndex >= 2 || !!product.retailer) || isSold;
  
  // Helper function to check if wallet matches current user
  const isCurrentUser = (walletAddress: string | undefined): boolean => {
    if (!walletAddress || !account) return false;
    return walletAddress.toLowerCase() === account.toLowerCase();
  };
  
  // Farmer: Use blockchain data first, fallback to profile only if wallet matches current user
  const farmerWallet = product.farmer || '';
  const farmerIsCurrentUser = isCurrentUser(farmerWallet);
  const farmerDisplayName = product.farmerName || (farmerIsCurrentUser ? profile?.fullName : undefined) || '—';
  const farmerDisplayOrg = product.farmerOrganization || (farmerIsCurrentUser ? profile?.organization : undefined) || '—';
  const farmerDisplayLocation = (farmerIsCurrentUser ? profile?.location : undefined) || '—';
  
  // Distributor: Use blockchain data ONLY, no profile fallback unless wallet matches
  const distributorWallet = product.distributor || '';
  const distributorIsCurrentUser = isCurrentUser(distributorWallet);
  const distributorDisplayName = product.distributorName || (distributorIsCurrentUser ? profile?.fullName : undefined) || '—';
  const distributorDisplayOrg = product.distributorOrganization || (distributorIsCurrentUser ? profile?.organization : undefined) || '—';
  const distributorDisplayLocation = (distributorIsCurrentUser ? profile?.location : undefined) || '—';
  
  // Retailer: Use blockchain data ONLY, no profile fallback unless wallet matches
  const retailerWallet = product.retailer || '';
  const retailerIsCurrentUser = isCurrentUser(retailerWallet);
  const retailerDisplayName = product.retailerName || (retailerIsCurrentUser ? profile?.fullName : undefined) || '—';
  const retailerDisplayOrg = product.retailerOrganization || (retailerIsCurrentUser ? profile?.organization : undefined) || '—';
  const retailerDisplayLocation = (retailerIsCurrentUser ? profile?.location : undefined) || '—';
  
  return (
    <div className="mt-6 pt-6 border-t">
      <h4 className="text-sm font-semibold mb-4">Stakeholder Details</h4>
      <div className="space-y-4">
        {/* Farmer Section - Always displayed */}
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">Farmer:</p>
          {farmerCompleted ? (
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
                <span className="font-mono">{farmerWallet || '—'}</span>
              </p>
              <p>
                <span className="font-medium">Registered On:</span>{' '}
                {formatDate(product.farmerRegisteredAt)}
              </p>
              <p>
                <span className="font-medium">Status:</span>{' '}
                <span className="text-green-600 font-medium">Completed</span>
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

        {/* Distributor Section - Always displayed */}
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">Distributor:</p>
          {distributorCompleted ? (
            <div className="pl-4 space-y-1 text-sm text-muted-foreground">
              <p>
                <span className="font-medium">Name:</span>{' '}
                {distributorDisplayName}
              </p>
              <p>
                <span className="font-medium">Organization:</span>{' '}
                {distributorDisplayOrg}
              </p>
              {distributorDisplayLocation !== '—' && (
                <p>
                  <span className="font-medium">Location:</span>{' '}
                  {distributorDisplayLocation}
                </p>
              )}
              <p>
                <span className="font-medium">Wallet Address:</span>{' '}
                <span className="font-mono">{distributorWallet || '—'}</span>
              </p>
              {product.distributorAddedAt && (
                <p>
                  <span className="font-medium">Added On:</span>{' '}
                  {formatDate(product.distributorAddedAt)}
                </p>
              )}
              <p>
                <span className="font-medium">Status:</span>{' '}
                <span className="text-green-600 font-medium">Completed</span>
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

        {/* Retailer Section - Always displayed */}
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">Retailer:</p>
          {retailerCompleted ? (
            <div className="pl-4 space-y-1 text-sm text-muted-foreground">
              <p>
                <span className="font-medium">Name:</span>{' '}
                {retailerDisplayName}
              </p>
              <p>
                <span className="font-medium">Organization:</span>{' '}
                {retailerDisplayOrg}
              </p>
              {retailerDisplayLocation !== '—' && (
                <p>
                  <span className="font-medium">Location:</span>{' '}
                  {retailerDisplayLocation}
                </p>
              )}
              <p>
                <span className="font-medium">Wallet Address:</span>{' '}
                <span className="font-mono">{retailerWallet || '—'}</span>
              </p>
              {product.retailerAddedAt && (
                <p>
                  <span className="font-medium">Added On:</span>{' '}
                  {formatDate(product.retailerAddedAt)}
                </p>
              )}
              <p>
                <span className="font-medium">Status:</span>{' '}
                <span className="text-green-600 font-medium">Completed</span>
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

