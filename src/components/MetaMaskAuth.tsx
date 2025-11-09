import React, { useEffect, useMemo, useState } from 'react';
import { useWeb3 } from '@/hooks/useWeb3';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Wallet, ExternalLink, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_KEYS, ROLE_KEY_TO_INDEX, ROLE_LABELS } from '@/constants/roles';

const NETWORK_NAMES = {
  '0x539': 'Localhost 8545',
  '0xaa36a7': 'Sepolia Testnet',
  '0x13881': 'Mumbai Testnet'
};

const ROLE_OPTIONS = ROLE_KEYS.map((key) => ({
  key,
  label: ROLE_LABELS[key],
  value: ROLE_KEY_TO_INDEX[key].toString(),
}));

const MetaMaskAuth = () => {
  const {
    account,
    chainId,
    isConnected,
    isLoading,
    stakeholder,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    registerStakeholder
  } = useWeb3();
  const { profile } = useAuth();

  const [registrationData, setRegistrationData] = useState({
    role: '',
    name: '',
    organization: ''
  });
  const [isRegistering, setIsRegistering] = useState(false);

  const hasEthereum = useMemo(() => typeof window !== 'undefined' && Boolean(window.ethereum), []);

  const preferredRoleValue = useMemo(() => {
    if (!profile?.role) return '';
    return ROLE_KEY_TO_INDEX[profile.role].toString();
  }, [profile?.role]);

  useEffect(() => {
    if (!profile) return;

    setRegistrationData((prev) => {
      const nextRole = prev.role || preferredRoleValue;
      const nextName = prev.name || profile.fullName || '';
      const nextOrg = prev.organization || profile.organization || '';

      if (nextRole === prev.role && nextName === prev.name && nextOrg === prev.organization) {
        return prev;
      }

      return {
        role: nextRole,
        name: nextName,
        organization: nextOrg,
      };
    });
  }, [preferredRoleValue, profile]);

  const profileRoleLabel = profile?.role ? ROLE_LABELS[profile.role] : undefined;

  const walletRoleMismatch = Boolean(
    stakeholder?.isRegistered &&
      profile?.role &&
      stakeholder.roleKey !== profile.role
  );

  const walletRoleLabel = stakeholder?.isRegistered ? ROLE_LABELS[stakeholder.roleKey] : null;

  const handleRegisterStakeholder = async () => {
    if (!registrationData.role || !registrationData.name) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const roleIndex = parseInt(registrationData.role, 10);
    if (Number.isNaN(roleIndex)) {
      toast({
        title: "Invalid Role",
        description: "Please select a valid role before registering",
        variant: "destructive",
      });
      return;
    }

    const selectedRoleKey = ROLE_OPTIONS.find((option) => option.value === registrationData.role)?.key;
    if (profile?.role && selectedRoleKey && selectedRoleKey !== profile.role) {
      toast({
        title: "Role Mismatch",
        description: `Your profile role is ${ROLE_LABELS[profile.role]}. Please register the same role on-chain.`,
        variant: "destructive",
      });
      return;
    }

    setIsRegistering(true);
    try {
      await registerStakeholder(
        roleIndex,
        registrationData.name,
        registrationData.organization || 'N/A'
      );
      setRegistrationData({
        role: preferredRoleValue,
        name: profile?.fullName || '',
        organization: profile?.organization || '',
      });
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsRegistering(false);
    }
  };

  const getNetworkStatus = () => {
    if (!chainId) return null;
    
    const networkName = NETWORK_NAMES[chainId as keyof typeof NETWORK_NAMES];
    const isSupported = networkName !== undefined;
    
    return {
      name: networkName || 'Unknown Network',
      isSupported,
      chainId
    };
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Wallet className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your MetaMask wallet to access the AgriTrace DApp
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!hasEthereum && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm text-yellow-800">
                  MetaMask not detected. Please install MetaMask to continue.
                </span>
              </div>
            )}
            
            <Button 
              onClick={connectWallet} 
              disabled={isLoading || !hasEthereum}
              className="w-full"
            >
              {isLoading ? 'Connecting...' : 'Connect MetaMask'}
            </Button>
            
            {!hasEthereum && (
              <Button
                variant="outline"
                onClick={() => window.open('https://metamask.io', '_blank')}
                className="w-full"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Install MetaMask
              </Button>
            )}

            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Supported Networks:</strong></p>
              <ul className="space-y-1">
                <li>• Localhost 8545 (Development)</li>
                <li>• Sepolia Testnet (Ethereum)</li>
                <li>• Mumbai Testnet (Polygon)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const networkStatus = getNetworkStatus();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Wallet Connected</CardTitle>
          <CardDescription>
            {account?.slice(0, 6)}...{account?.slice(-4)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Network Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Network:</span>
            <Badge variant={networkStatus?.isSupported ? "default" : "destructive"}>
              {networkStatus?.name}
            </Badge>
          </div>

          {walletRoleMismatch && (
            <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-900">
              <AlertCircle className="w-4 h-4 mt-0.5" />
              <div>
                <p className="font-medium">Role mismatch detected</p>
                <p>
                  Your account profile is registered as {profileRoleLabel ?? 'Unknown role'} but this wallet is {walletRoleLabel ?? 'Unregistered'}.
                  Use a wallet registered with the same role or contact an administrator to update your on-chain role.
                </p>
              </div>
            </div>
          )}

          {!networkStatus?.isSupported && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-800">
                  Please switch to a supported testnet
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => switchNetwork('localhost')}
                >
                  Localhost
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => switchNetwork('sepolia')}
                >
                  Sepolia
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => switchNetwork('mumbai')}
                >
                  Mumbai
                </Button>
              </div>
            </div>
          )}

          {/* Stakeholder Registration */}
          {networkStatus?.isSupported && !stakeholder?.isRegistered && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="font-medium">Register as Stakeholder</h3>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={registrationData.role}
                  onValueChange={(value) => setRegistrationData(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={registrationData.name}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Organization (Optional)</Label>
                <Input
                  id="organization"
                  value={registrationData.organization}
                  onChange={(e) => setRegistrationData(prev => ({ ...prev, organization: e.target.value }))}
                  placeholder="Enter your organization"
                />
              </div>

              <Button
                onClick={handleRegisterStakeholder}
                disabled={isRegistering || !registrationData.role || !registrationData.name}
                className="w-full"
              >
                {isRegistering ? 'Registering...' : 'Register on Blockchain'}
              </Button>
            </div>
          )}

          {/* Registered Stakeholder Info */}
          {stakeholder?.isRegistered && (
            <div className="space-y-2 border-t pt-4">
              <h3 className="font-medium">Registration Status</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm">Role:</span>
                <Badge>{walletRoleLabel ?? 'Unregistered'}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Name:</span>
                <span className="text-sm font-medium">{stakeholder.name}</span>
              </div>
              {stakeholder.organization && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Organization:</span>
                  <span className="text-sm font-medium">{stakeholder.organization}</span>
                </div>
              )}
            </div>
          )}

          <Button
            variant="outline"
            onClick={disconnectWallet}
            className="w-full"
          >
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetaMaskAuth;