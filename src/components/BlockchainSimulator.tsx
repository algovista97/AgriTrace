import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Zap, Shield, Clock } from 'lucide-react';

const BlockchainSimulator = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Demo Mode Active
        </CardTitle>
        <CardDescription>
          Blockchain simulation for testing without gas fees
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            You're currently using a simulated blockchain environment. All transactions are mocked for demonstration purposes.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-500" />
            <span className="text-sm">No Gas Fees</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="text-sm">Instant Transactions</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Demo Network</Badge>
          </div>
        </div>

        <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <p><strong>To use real blockchain:</strong></p>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Deploy the smart contract to Sepolia testnet</li>
            <li>Update the contract address in the code</li>
            <li>Get Sepolia ETH from a faucet</li>
            <li>Transactions will then be recorded on the real blockchain</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockchainSimulator;