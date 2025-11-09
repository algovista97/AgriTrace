import React, { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useWeb3 } from '@/hooks/useWeb3';
import { supabase } from '@/integrations/supabase/client';

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

interface StakeholderProfile {
  fullName?: string;
  organization?: string;
  location?: string;
}

const formatDate = (timestamp?: number): string => {
  if (!timestamp || timestamp === 0) return '—';
  const date = new Date(timestamp * 1000);
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
};

export const StakeholderDetails: React.FC<StakeholderDetailsProps> = ({ product }) => {
  const { profile: currentUserProfile } = useAuth();
  const { account } = useWeb3();
  
  const [farmerProfile, setFarmerProfile] = useState<StakeholderProfile | null>(null);
  const [distributorProfile, setDistributorProfile] = useState<StakeholderProfile | null>(null);
  const [retailerProfile, setRetailerProfile] = useState<StakeholderProfile | null>(null);
  
  // Helper to check if wallet matches current user
  const isCurrentUser = (walletAddress: string | undefined): boolean => {
    if (!walletAddress || !account) return false;
    return walletAddress.toLowerCase() === account.toLowerCase();
  };
  
  // Fetch profile data for each stakeholder
  useEffect(() => {
    const fetchProfiles = async () => {
      // For Farmer: Use current user profile if wallet matches
      if (product.farmer && isCurrentUser(product.farmer) && currentUserProfile) {
        setFarmerProfile({
          fullName: currentUserProfile.fullName,
          organization: currentUserProfile.organization,
          location: currentUserProfile.location,
        });
      }
      
      // For Distributor: Try to find profile by wallet (if we had a wallet_address field)
      // For now, use current user profile if wallet matches
      if (product.distributor && isCurrentUser(product.distributor) && currentUserProfile) {
        setDistributorProfile({
          fullName: currentUserProfile.fullName,
          organization: currentUserProfile.organization,
          location: currentUserProfile.location,
        });
      }
      
      // For Retailer: Try to find profile by wallet (if we had a wallet_address field)
      // For now, use current user profile if wallet matches
      if (product.retailer && isCurrentUser(product.retailer) && currentUserProfile) {
        setRetailerProfile({
          fullName: currentUserProfile.fullName,
          organization: currentUserProfile.organization,
          location: currentUserProfile.location,
        });
      }
    };
    
    fetchProfiles();
  }, [product.farmer, product.distributor, product.retailer, account, currentUserProfile]);
  
  // Farmer: Use blockchain data first, then profile data if available
  const farmerWallet = product.farmer || '';
  const farmerIsCurrentUser = isCurrentUser(farmerWallet);
  const farmerDisplayName = product.farmerName || (farmerIsCurrentUser && farmerProfile?.fullName) || '—';
  const farmerDisplayOrg = product.farmerOrganization || (farmerIsCurrentUser && farmerProfile?.organization) || '—';
  const farmerDisplayLocation = (farmerIsCurrentUser && farmerProfile?.location) || '—';
  
  // Distributor: Use blockchain data first, then profile if wallet matches
  const distributorWallet = product.distributor || '';
  const distributorIsCurrentUser = isCurrentUser(distributorWallet);
  const distributorDisplayName = product.distributorName || (distributorIsCurrentUser && distributorProfile?.fullName) || '—';
  const distributorDisplayOrg = product.distributorOrganization || (distributorIsCurrentUser && distributorProfile?.organization) || '—';
  const distributorDisplayLocation = (distributorIsCurrentUser && distributorProfile?.location) || '—';
  
  // Retailer: Use blockchain data first, then profile if wallet matches
  const retailerWallet = product.retailer || '';
  const retailerIsCurrentUser = isCurrentUser(retailerWallet);
  const retailerDisplayName = product.retailerName || (retailerIsCurrentUser && retailerProfile?.fullName) || '—';
  const retailerDisplayOrg = product.retailerOrganization || (retailerIsCurrentUser && retailerProfile?.organization) || '—';
  const retailerDisplayLocation = (retailerIsCurrentUser && retailerProfile?.location) || '—';
  return (
    <div className="mt-6 pt-6 border-t">
      <h4 className="text-sm font-semibold mb-4">Stakeholder Details</h4>
      <div className="space-y-4">
        {/* Farmer Section */}
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">Farmer:</p>
          {product.farmer ? (
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

