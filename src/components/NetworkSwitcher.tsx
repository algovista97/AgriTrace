import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWeb3 } from '@/hooks/useWeb3';
import { toast } from '@/hooks/use-toast';
import { Wifi, WifiOff } from 'lucide-react';

const NetworkSwitcher = () => {
  const { chainId, isConnected, switchNetwork, getNetworkName } = useWeb3();

  const networks = [
    { key: 'localhost', name: 'Localhost', chainId: '0x539', color: 'bg-green-500' },
    { key: 'sepolia', name: 'Sepolia', chainId: '0xaa36a7', color: 'bg-blue-500' },
    { key: 'mumbai', name: 'Mumbai', chainId: '0x13881', color: 'bg-purple-500' }
  ] as const;

  const currentNetwork = networks.find(n => n.chainId === chainId);

  const handleNetworkSwitch = async (networkKey: typeof networks[number]['key']) => {
    try {
      await switchNetwork(networkKey);
      toast({
        title: "Network Switch Requested",
        description: "Please approve the network change in MetaMask",
      });
    } catch (error) {
      console.error('Failed to switch network:', error);
      toast({
        title: "Network Switch Failed",
        description: "Failed to switch network. Please try manually in MetaMask.",
        variant: "destructive",
      });
    }
  };

  if (!isConnected) {
    return (
      <Badge variant="outline" className="flex items-center gap-2">
        <WifiOff className="h-4 w-4" />
        Not Connected
      </Badge>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant="outline" 
        className={`flex items-center gap-2 ${currentNetwork?.color || 'bg-gray-500'}`}
      >
        <Wifi className="h-4 w-4 text-white" />
        <span className="text-white font-medium">{getNetworkName()}</span>
      </Badge>
      
      <div className="flex gap-1">
        {networks.map(network => (
          <Button
            key={network.key}
            variant={chainId === network.chainId ? "default" : "outline"}
            size="sm"
            onClick={() => handleNetworkSwitch(network.key)}
            className="text-xs"
            disabled={chainId === network.chainId}
          >
            {network.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default NetworkSwitcher;