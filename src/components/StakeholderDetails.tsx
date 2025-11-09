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
  const { account, getStakeholderByAddress, contract } = useWeb3();
  
  const [farmerProfile, setFarmerProfile] = useState<StakeholderProfile | null>(null);
  const [distributorProfile, setDistributorProfile] = useState<StakeholderProfile | null>(null);
  const [retailerProfile, setRetailerProfile] = useState<StakeholderProfile | null>(null);
  
  // Helper to check if wallet matches current user
  const isCurrentUser = (walletAddress: string | undefined): boolean => {
    if (!walletAddress || !account) return false;
    return walletAddress.toLowerCase() === account.toLowerCase();
  };
  
  // Fetch stakeholder data from blockchain and Supabase for each wallet address
  useEffect(() => {
    const fetchStakeholderData = async (walletAddress: string, setProfile: (p: StakeholderProfile | null) => void) => {
      if (!walletAddress || !contract) return;
      
      try {
        // Get blockchain stakeholder data (name, organization)
        const blockchainStakeholder = await getStakeholderByAddress(walletAddress);
        
        // Try to get Supabase profile data
        // First, check if wallet matches current user
        if (isCurrentUser(walletAddress) && currentUserProfile) {
          setProfile({
            fullName: currentUserProfile.fullName,
            organization: currentUserProfile.organization,
            location: currentUserProfile.location,
          });
          return;
        }
        
        // Use blockchain data for name and organization
        // For location, we'll use current user profile if wallet matches
        // Note: Supabase profiles table doesn't have wallet_address field,
        // so we can't directly query by wallet. We use blockchain data + current user profile.
        if (blockchainStakeholder && blockchainStakeholder.name) {
          const profileData: StakeholderProfile = {
            fullName: blockchainStakeholder.name,
            organization: blockchainStakeholder.organization || undefined,
            location: undefined, // Will be set below if current user
          };
          
          // If this is the current user, add location from their profile
          if (isCurrentUser(walletAddress) && currentUserProfile?.location) {
            profileData.location = currentUserProfile.location;
          }
          
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Error fetching stakeholder data:', error);
        // If current user, use their profile
        if (isCurrentUser(walletAddress) && currentUserProfile) {
          setProfile({
            fullName: currentUserProfile.fullName,
            organization: currentUserProfile.organization,
            location: currentUserProfile.location,
          });
        }
      }
    };
    
    // Fetch data for each stakeholder
    if (product.farmer) {
      fetchStakeholderData(product.farmer, setFarmerProfile);
    }
    if (product.distributor) {
      fetchStakeholderData(product.distributor, setDistributorProfile);
    }
    if (product.retailer) {
      fetchStakeholderData(product.retailer, setRetailerProfile);
    }
  }, [product.farmer, product.distributor, product.retailer, account, currentUserProfile, contract, getStakeholderByAddress]);
  
  // Farmer: Use blockchain data first, then Supabase profile data
  const farmerWallet = product.farmer || '';
  const farmerDisplayName = product.farmerName || farmerProfile?.fullName || '—';
  const farmerDisplayOrg = product.farmerOrganization || farmerProfile?.organization || '—';
  const farmerDisplayLocation = farmerProfile?.location || '—';
  
  // Distributor: Use blockchain data first, then Supabase profile data
  const distributorWallet = product.distributor || '';
  const distributorDisplayName = product.distributorName || distributorProfile?.fullName || '—';
  const distributorDisplayOrg = product.distributorOrganization || distributorProfile?.organization || '—';
  const distributorDisplayLocation = distributorProfile?.location || '—';
  
  // Retailer: Use blockchain data first, then Supabase profile data
  const retailerWallet = product.retailer || '';
  const retailerDisplayName = product.retailerName || retailerProfile?.fullName || '—';
  const retailerDisplayOrg = product.retailerOrganization || retailerProfile?.organization || '—';
  const retailerDisplayLocation = retailerProfile?.location || '—';
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

