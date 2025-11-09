import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { isAddress } from 'ethers';
import { useWeb3 } from '@/hooks/useWeb3';
import { useAuth } from '@/hooks/useAuth';
import { ROLE_LABELS, RoleKey } from '@/constants/roles';
import MetaMaskAuth from './MetaMaskAuth';
import BlockchainProductRegistration from './BlockchainProductRegistration';
import BlockchainProductSearch from './BlockchainProductSearch';
import { SupplyChainTimeline } from './SupplyChainTimeline';
import { StakeholderDetails } from './StakeholderDetails';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import {
  Activity,
  AlertCircle,
  Loader2,
  Package,
  Search,
  Send,
  ShoppingCart,
  TrendingUp,
  Wallet,
} from 'lucide-react';

const PRODUCT_STATUSES = ['Harvested', 'At Distributor', 'At Retailer', 'Sold'] as const;

type ProductStatusLabel = (typeof PRODUCT_STATUSES)[number];

interface DashboardStakeholder {
  walletAddress: string;
  roleKey: RoleKey;
  roleIndex: number;
  name: string;
  organization: string;
  isRegistered: boolean;
}

interface ProductSummary {
  id: number;
  name: string;
  variety: string;
  quantity: number;
  statusIndex: number;
  statusLabel: ProductStatusLabel;
  farmLocation: string;
  harvestDate: Date;
  qualityGrade: string;
  farmer: string;
  // NEW: Farmer details
  farmerName?: string;
  farmerOrganization?: string;
  // NEW: Distributor details
  distributor?: string;
  distributorName?: string;
  distributorOrganization?: string;
  // NEW: Retailer details
  retailer?: string;
  retailerName?: string;
  retailerOrganization?: string;
  // NEW: Timestamps
  farmerRegisteredAt?: number;
  distributorAddedAt?: number;
  retailerAddedAt?: number;
  soldAt?: number;
}

interface TransactionSummary {
  id: string;
  productId: number;
  type: string;
  from: string;
  to: string;
  location: string;
  timestamp: Date;
  statusLabel: ProductStatusLabel;
}

interface RoleDashboardProps {
  account: string;
  chainName: string;
  stakeholder: DashboardStakeholder;
  profileName?: string;
  profileOrganization?: string;
  profileLocation?: string;
}

interface TransferFormState {
  productId: string;
  to: string;
  location: string;
  notes: string;
}

const formatStatus = (statusIndex: number): ProductStatusLabel => PRODUCT_STATUSES[statusIndex] ?? 'Harvested';

const truncateAddress = (address: string) =>
  address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

const toNumber = (value: any): number => {
  if (typeof value === 'bigint') return Number(value);
  if (typeof value === 'string') return Number(value);
  return Number(value ?? 0);
};

const toDateFromSeconds = (value: any): Date => new Date(toNumber(value) * 1000);

const toLowerAddress = (value: string): string => (value ?? '').toLowerCase();

const parseProductFromChain = (id: number, product: any): ProductSummary => ({
  id,
  name: product.name,
  variety: product.variety ?? '',
  quantity: toNumber(product.quantity),
  statusIndex: toNumber(product.status),
  statusLabel: formatStatus(toNumber(product.status)),
  farmLocation: product.farmLocation ?? 'Unknown',
  harvestDate: toDateFromSeconds(product.harvestDate),
  qualityGrade: product.qualityGrade ?? 'N/A',
  farmer: product.farmer ?? '',
  // NEW: Parse farmer details (backward compatible - defaults to empty if not present)
  farmerName: product.farmerName && product.farmerName.length > 0 ? product.farmerName : undefined,
  farmerOrganization: product.farmerOrganization && product.farmerOrganization.length > 0 ? product.farmerOrganization : undefined,
  // NEW: Parse distributor details (only if address is not zero)
  distributor: product.distributor && product.distributor !== '0x0000000000000000000000000000000000000000' ? product.distributor : undefined,
  distributorName: product.distributorName && product.distributorName.length > 0 ? product.distributorName : undefined,
  distributorOrganization: product.distributorOrganization && product.distributorOrganization.length > 0 ? product.distributorOrganization : undefined,
  // NEW: Parse retailer details (only if address is not zero)
  retailer: product.retailer && product.retailer !== '0x0000000000000000000000000000000000000000' ? product.retailer : undefined,
  retailerName: product.retailerName && product.retailerName.length > 0 ? product.retailerName : undefined,
  retailerOrganization: product.retailerOrganization && product.retailerOrganization.length > 0 ? product.retailerOrganization : undefined,
  // NEW: Parse timestamps (backward compatible - defaults to 0 if not present)
  farmerRegisteredAt: product.farmerRegisteredAt && toNumber(product.farmerRegisteredAt) > 0 ? toNumber(product.farmerRegisteredAt) : undefined,
  distributorAddedAt: product.distributorAddedAt && toNumber(product.distributorAddedAt) > 0 ? toNumber(product.distributorAddedAt) : undefined,
  retailerAddedAt: product.retailerAddedAt && toNumber(product.retailerAddedAt) > 0 ? toNumber(product.retailerAddedAt) : undefined,
  soldAt: product.soldAt && toNumber(product.soldAt) > 0 ? toNumber(product.soldAt) : undefined,
});

interface RoleDashboardShellProps {
  account: string;
  networkName: string;
  roleLabel: string;
  stakeholderName?: string;
  profileName?: string;
  profileOrganization?: string;
  profileLocation?: string;
  children: React.ReactNode;
}

const RoleDashboardShell: React.FC<RoleDashboardShellProps> = ({ 
  account, 
  networkName, 
  roleLabel, 
  stakeholderName, 
  profileName,
  profileOrganization,
  profileLocation,
  children 
}) => {
  // Use stakeholder name from blockchain, fallback to profile name from signup
  const displayName = stakeholderName || profileName || 'User';
  const displayOrg = profileOrganization || '';
  const displayLocation = profileLocation || '';

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Blockchain Dashboard</h1>
            <p className="text-sm text-muted-foreground">Signed in as {displayName}</p>
            {displayOrg && (
              <p className="text-sm text-muted-foreground">Organization: {displayOrg}</p>
            )}
            {displayLocation && (
              <p className="text-sm text-muted-foreground">Location: {displayLocation}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Wallet {truncateAddress(account)} • Network {networkName}
            </p>
          </div>
          <Badge className="text-base py-2 px-4 capitalize">{roleLabel}</Badge>
        </div>
        {children}
      </div>
    </div>
  );
};

const RoleMismatchNotice: React.FC<{ profileRole: string; walletRole: string }> = ({ profileRole, walletRole }) => (
  <div className="min-h-screen flex items-center justify-center bg-background p-6">
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Role mismatch detected</CardTitle>
        <CardDescription>
          Your authenticated profile and connected wallet are registered with different roles.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          You don’t have access to this section. Only {profileRole} can access it.
        </p>
        <div className="space-y-2 text-sm">
          <p>
            <strong>Profile role:</strong> {profileRole}
          </p>
          <p>
            <strong>Wallet role:</strong> {walletRole}
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Switch to a wallet registered as {profileRole} or update your on-chain registration to continue.
        </p>
      </CardContent>
    </Card>
  </div>
);

const FarmerDashboard: React.FC<RoleDashboardProps> = ({ account, chainName, stakeholder, profileName, profileOrganization, profileLocation }) => {
  const {
    getProductsByFarmer,
    getProduct,
    getProductTransactions,
    transferProduct,
    getStakeholderByAddress,
  } = useWeb3();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [transactions, setTransactions] = useState<TransactionSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [transferForm, setTransferForm] = useState<TransferFormState>({
    productId: '',
    to: '',
    location: '',
    notes: '',
  });
  const [isTransferring, setIsTransferring] = useState(false);

  const accountLower = useMemo(() => toLowerAddress(account), [account]);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const onChainIds = await getProductsByFarmer(account);
      const productIds = onChainIds.map((value: any) => Number(value)).filter((value) => value > 0);
      const productEntries = await Promise.all(
        productIds.map(async (id) => {
          const product = await getProduct(id);
          if (!product?.exists) return null;
          return parseProductFromChain(id, product);
        })
      );
      const validProducts = productEntries.filter((item): item is ProductSummary => Boolean(item));
      setProducts(validProducts);

      const txEntries: TransactionSummary[] = [];
      for (const id of productIds) {
        const productTransactions = await getProductTransactions(id);
        productTransactions.forEach((tx: any, index: number) => {
          const timestamp = toDateFromSeconds(tx.timestamp);
          txEntries.push({
            id: `${id}-${index}-${toNumber(tx.timestamp)}`,
            productId: Number(tx.productId ?? id),
            type: tx.transactionType,
            from: tx.from,
            to: tx.to,
            location: tx.location,
            timestamp,
            statusLabel: formatStatus(toNumber(tx.newStatus)),
          });
        });
      }
      txEntries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      setTransactions(txEntries.slice(0, 20));
    } catch (error) {
      console.error('Error fetching farmer data:', error);
      toast({
        title: 'Failed to load data',
        description: 'Unable to fetch farmer dashboard data right now.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [account, getProduct, getProductTransactions, getProductsByFarmer]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleTransferSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const productId = Number(transferForm.productId);
    const distributorAddress = transferForm.to.trim();

    if (!productId || Number.isNaN(productId)) {
      toast({ title: 'Invalid product ID', description: 'Enter a valid product ID.', variant: 'destructive' });
      return;
    }

    if (!isAddress(distributorAddress)) {
      toast({
        title: 'Invalid address',
        description: 'Enter a valid distributor wallet address.',
        variant: 'destructive',
      });
      return;
    }

    setIsTransferring(true);
    try {
      const product = await getProduct(productId);
      if (!product?.exists) {
        toast({ title: 'Product not found', description: `No product found with ID ${productId}.`, variant: 'destructive' });
        return;
      }

      if (toNumber(product.status) !== 0) {
        toast({
          title: 'Product already transferred',
          description: 'Only harvested products can be sent to distributors.',
          variant: 'destructive',
        });
        return;
      }

      if (toLowerAddress(product.farmer) !== accountLower) {
        toast({
          title: 'Unauthorized transfer',
          description: 'You can only transfer products that you registered.',
          variant: 'destructive',
        });
        return;
      }

      const recipient = await getStakeholderByAddress(distributorAddress);
      if (!recipient.isRegistered || recipient.roleKey !== 'distributor') {
        toast({
          title: 'Invalid recipient',
          description: 'The destination wallet must belong to a registered distributor.',
          variant: 'destructive',
        });
        return;
      }

      await transferProduct(
        productId,
        distributorAddress,
        1,
        transferForm.location || 'In transit',
        'transfer',
        transferForm.notes || ''
      );

      setTransferForm({ productId: '', to: '', location: '', notes: '' });
      await fetchDashboardData();
    } catch (error) {
      console.error('Farmer transfer error:', error);
    } finally {
      setIsTransferring(false);
    }
  };

  const stats = [
    {
      title: 'Wallet',
      value: truncateAddress(account),
      icon: <Wallet className="w-4 h-4" />,
    },
    {
      title: 'Network',
      value: chainName,
      icon: <Activity className="w-4 h-4" />,
    },
    {
      title: 'Products Registered',
      value: products.length.toString(),
      icon: <Package className="w-4 h-4" />,
    },
    {
      title: 'Recent Transactions',
      value: transactions.length.toString(),
      icon: <TrendingUp className="w-4 h-4" />,
    },
  ];

  return (
    <RoleDashboardShell
      account={account}
      networkName={chainName}
      roleLabel={ROLE_LABELS[stakeholder.roleKey]}
      stakeholderName={stakeholder.name}
      profileName={profileName}
      profileOrganization={profileOrganization}
      profileLocation={profileLocation}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="register">Register Product</TabsTrigger>
          <TabsTrigger value="transfer">Transfer</TabsTrigger>
          <TabsTrigger value="products">My Products</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest transactions involving your products</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading blockchain data...
                </div>
              ) : transactions.length > 0 ? (
                <div className="space-y-4">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          Product #{transaction.productId} • {transaction.type}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.location} • {transaction.timestamp.toLocaleString()}
                        </p>
                      </div>
                      <Badge variant="outline">{transaction.statusLabel}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No recent activity recorded.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <BlockchainProductRegistration />
        </TabsContent>

        <TabsContent value="transfer">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Transfer Product to Distributor
              </CardTitle>
              <CardDescription>
                Move harvested products to a registered distributor to continue the supply chain.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTransferSubmit} className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="farmer-product-id">
                    Product ID
                  </label>
                  <Input
                    id="farmer-product-id"
                    value={transferForm.productId}
                    onChange={(event) => setTransferForm((prev) => ({ ...prev, productId: event.target.value }))}
                    placeholder="Enter product ID"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="farmer-distributor-address">
                    Distributor Wallet Address
                  </label>
                  <Input
                    id="farmer-distributor-address"
                    value={transferForm.to}
                    onChange={(event) => setTransferForm((prev) => ({ ...prev, to: event.target.value }))}
                    placeholder="0x..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="farmer-location">
                    Current Location
                  </label>
                  <Input
                    id="farmer-location"
                    value={transferForm.location}
                    onChange={(event) => setTransferForm((prev) => ({ ...prev, location: event.target.value }))}
                    placeholder="City, Country"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="farmer-notes">
                    Notes (Optional)
                  </label>
                  <Input
                    id="farmer-notes"
                    value={transferForm.notes}
                    onChange={(event) => setTransferForm((prev) => ({ ...prev, notes: event.target.value }))}
                    placeholder="Quality, handling instructions, etc."
                  />
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" className="w-full md:w-auto" disabled={isTransferring}>
                    {isTransferring && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Transfer Product
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading products from blockchain...
              </CardContent>
            </Card>
          ) : products.length > 0 ? (
            <div className="grid gap-4">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">
                        {product.name} {product.variety && `(${product.variety})`}
                      </CardTitle>
                      <Badge
                        variant={product.statusIndex === 0 ? 'default' : 'secondary'}
                        className="capitalize"
                      >
                        {product.statusLabel}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Blockchain ID</p>
                        <p className="font-medium">#{product.id}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Quantity</p>
                        <p className="font-medium">{product.quantity} kg</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Quality</p>
                        <p className="font-medium">Grade {product.qualityGrade}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Harvest Date</p>
                        <p className="font-medium">{product.harvestDate.toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <p className="text-sm text-muted-foreground">
                      <strong>Location:</strong> {product.farmLocation}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <Package className="w-12 h-12 mx-auto mb-4" />
                <p>No products registered yet. Start by registering a new product.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          {transactions.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>All blockchain movements for your products</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-start justify-between gap-4 border rounded-lg p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Product #{transaction.productId}</Badge>
                        <span className="font-medium capitalize">{transaction.type}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {transaction.location} • {transaction.timestamp.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        From {truncateAddress(transaction.from)} → To {truncateAddress(transaction.to)}
                      </p>
                    </div>
                    <Badge>{transaction.statusLabel}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <Activity className="w-12 h-12 mx-auto mb-4" />
                <p>No blockchain transactions recorded yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </RoleDashboardShell>
  );
};

const DistributorDashboard: React.FC<RoleDashboardProps> = ({ account, chainName, stakeholder, profileName, profileOrganization, profileLocation }) => {
  const {
    getProduct,
    getProductTransactions,
    getProductCount,
    transferProduct,
    getStakeholderByAddress,
  } = useWeb3();

  const [assignedProducts, setAssignedProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [transferForm, setTransferForm] = useState<TransferFormState>({ productId: '', to: '', location: '', notes: '' });
  const [isTransferring, setIsTransferring] = useState(false);

  const accountLower = useMemo(() => toLowerAddress(account), [account]);

  const fetchAssignedProducts = useCallback(async () => {
    setLoading(true);
    try {
      const total = await getProductCount();
      const ids = Array.from({ length: total }, (_, index) => index + 1);
      const entries = await Promise.all(
        ids.map(async (id) => {
          try {
            const product = await getProduct(id);
            if (!product?.exists) return null;
            if (toNumber(product.status) !== 1) return null;
            const txs = await getProductTransactions(id);
            if (!txs?.length) return null;
            const lastTx = txs[txs.length - 1];
            if (toLowerAddress(lastTx.to) !== accountLower) return null;
            return parseProductFromChain(id, product);
          } catch (error) {
            console.error('Error parsing product', error);
            return null;
          }
        })
      );
      const filtered = entries.filter((item): item is ProductSummary => Boolean(item));
      filtered.sort((a, b) => b.harvestDate.getTime() - a.harvestDate.getTime());
      setAssignedProducts(filtered);
    } catch (error) {
      console.error('Error fetching distributor products:', error);
      toast({
        title: 'Unable to load products',
        description: 'Failed to fetch assigned products from the blockchain.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [accountLower, getProduct, getProductCount, getProductTransactions]);

  useEffect(() => {
    fetchAssignedProducts();
  }, [fetchAssignedProducts]);

  const handleTransferSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const productId = Number(transferForm.productId);
    const retailerAddress = transferForm.to.trim();

    if (!productId || Number.isNaN(productId)) {
      toast({ title: 'Invalid product ID', description: 'Enter a valid product ID.', variant: 'destructive' });
      return;
    }

    if (!isAddress(retailerAddress)) {
      toast({ title: 'Invalid address', description: 'Enter a valid retailer wallet address.', variant: 'destructive' });
      return;
    }

    setIsTransferring(true);
    try {
      const product = await getProduct(productId);
      if (!product?.exists || toNumber(product.status) !== 1) {
        toast({
          title: 'Product unavailable',
          description: 'Only products currently at the distributor can be transferred.',
          variant: 'destructive',
        });
        return;
      }

      const txs = await getProductTransactions(productId);
      const lastTx = txs[txs.length - 1];
      if (toLowerAddress(lastTx.to) !== accountLower) {
        toast({
          title: 'Not the current holder',
          description: 'You can only transfer products currently assigned to you.',
          variant: 'destructive',
        });
        return;
      }

      const recipient = await getStakeholderByAddress(retailerAddress);
      if (!recipient.isRegistered || recipient.roleKey !== 'retailer') {
        toast({
          title: 'Invalid recipient',
          description: 'The destination wallet must belong to a registered retailer.',
          variant: 'destructive',
        });
        return;
      }

      await transferProduct(
        productId,
        retailerAddress,
        2,
        transferForm.location || 'In transit',
        'transfer',
        transferForm.notes || ''
      );

      setTransferForm({ productId: '', to: '', location: '', notes: '' });
      await fetchAssignedProducts();
    } catch (error) {
      console.error('Distributor transfer error:', error);
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <RoleDashboardShell
      account={account}
      networkName={chainName}
      roleLabel={ROLE_LABELS[stakeholder.roleKey]}
      stakeholderName={stakeholder.name}
      profileName={profileName}
      profileOrganization={profileOrganization}
      profileLocation={profileLocation}
    >
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>In-transit Products</CardTitle>
            <CardDescription>Products currently assigned to your distribution hub</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Fetching assigned products from blockchain...
              </div>
            ) : assignedProducts.length > 0 ? (
              <div className="space-y-4">
                {assignedProducts.map((product) => (
                  <div key={product.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Product #{product.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.name} • {product.quantity} kg • Grade {product.qualityGrade}
                        </p>
                      </div>
                      <Badge variant="secondary">{product.statusLabel}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Harvested on {product.harvestDate.toLocaleDateString()} • Farmer {truncateAddress(product.farmer)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No products are currently assigned to you.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Transfer to Retailer
            </CardTitle>
            <CardDescription>Send verified products to the next stage of the supply chain.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTransferSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="distributor-product-id">
                  Product ID
                </label>
                <Input
                  id="distributor-product-id"
                  value={transferForm.productId}
                  onChange={(event) => setTransferForm((prev) => ({ ...prev, productId: event.target.value }))}
                  placeholder="Enter product ID"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="distributor-retailer-address">
                  Retailer Address
                </label>
                <Input
                  id="distributor-retailer-address"
                  value={transferForm.to}
                  onChange={(event) => setTransferForm((prev) => ({ ...prev, to: event.target.value }))}
                  placeholder="0x..."
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="distributor-location">
                  Current Location
                </label>
                <Input
                  id="distributor-location"
                  value={transferForm.location}
                  onChange={(event) => setTransferForm((prev) => ({ ...prev, location: event.target.value }))}
                  placeholder="City, Warehouse"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="distributor-notes">
                  Notes (Optional)
                </label>
                <Input
                  id="distributor-notes"
                  value={transferForm.notes}
                  onChange={(event) => setTransferForm((prev) => ({ ...prev, notes: event.target.value }))}
                  placeholder="Temperature, condition, etc."
                />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" className="w-full md:w-auto" disabled={isTransferring}>
                  {isTransferring && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Transfer Product
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </RoleDashboardShell>
  );
};

const RetailerDashboard: React.FC<RoleDashboardProps> = ({ account, chainName, stakeholder, profileName, profileOrganization, profileLocation }) => {
  const { getProduct, getProductTransactions, getProductCount, transferProduct, getStakeholderByAddress } = useWeb3();
  const [inventory, setInventory] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [sellForm, setSellForm] = useState<TransferFormState>({ productId: '', to: '', location: '', notes: '' });
  const [isSelling, setIsSelling] = useState(false);

  const accountLower = useMemo(() => toLowerAddress(account), [account]);

  const fetchInventory = useCallback(async () => {
    setLoading(true);
    try {
      const total = await getProductCount();
      const ids = Array.from({ length: total }, (_, index) => index + 1);
      const entries = await Promise.all(
        ids.map(async (id) => {
          try {
            const product = await getProduct(id);
            if (!product?.exists) return null;
            if (toNumber(product.status) !== 2) return null;
            const txs = await getProductTransactions(id);
            if (!txs?.length) return null;
            const lastTx = txs[txs.length - 1];
            if (toLowerAddress(lastTx.to) !== accountLower) return null;
            return parseProductFromChain(id, product);
          } catch (error) {
            console.error('Error parsing product', error);
            return null;
          }
        })
      );
      const filtered = entries.filter((item): item is ProductSummary => Boolean(item));
      filtered.sort((a, b) => b.harvestDate.getTime() - a.harvestDate.getTime());
      setInventory(filtered);
    } catch (error) {
      console.error('Error fetching retailer inventory:', error);
      toast({
        title: 'Unable to load inventory',
        description: 'Failed to fetch retailer inventory from blockchain.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [accountLower, getProduct, getProductCount, getProductTransactions]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleSaleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const productId = Number(sellForm.productId);
    const consumerAddress = sellForm.to.trim();

    if (!productId || Number.isNaN(productId)) {
      toast({ title: 'Invalid product ID', description: 'Enter a valid product ID.', variant: 'destructive' });
      return;
    }

    if (!isAddress(consumerAddress)) {
      toast({ title: 'Invalid address', description: 'Enter a valid consumer wallet address.', variant: 'destructive' });
      return;
    }

    setIsSelling(true);
    try {
      const product = await getProduct(productId);
      if (!product?.exists || toNumber(product.status) !== 2) {
        toast({
          title: 'Product unavailable',
          description: 'Only products currently at the retailer can be sold.',
          variant: 'destructive',
        });
        return;
      }

      const txs = await getProductTransactions(productId);
      const lastTx = txs[txs.length - 1];
      if (toLowerAddress(lastTx.to) !== accountLower) {
        toast({
          title: 'Not the current holder',
          description: 'You can only sell products currently assigned to you.',
          variant: 'destructive',
        });
        return;
      }

      const recipient = await getStakeholderByAddress(consumerAddress);
      if (!recipient.isRegistered || recipient.roleKey !== 'consumer') {
        toast({
          title: 'Invalid recipient',
          description: 'The destination wallet must belong to a registered consumer.',
          variant: 'destructive',
        });
        return;
      }

      await transferProduct(
        productId,
        consumerAddress,
        3,
        sellForm.location || 'Point of sale',
        'sale',
        sellForm.notes || ''
      );

      setSellForm({ productId: '', to: '', location: '', notes: '' });
      await fetchInventory();
    } catch (error) {
      console.error('Retailer sale error:', error);
    } finally {
      setIsSelling(false);
    }
  };

  return (
    <RoleDashboardShell
      account={account}
      networkName={chainName}
      roleLabel={ROLE_LABELS[stakeholder.roleKey]}
      stakeholderName={stakeholder.name}
      profileName={profileName}
      profileOrganization={profileOrganization}
      profileLocation={profileLocation}
    >
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Retail Inventory</CardTitle>
            <CardDescription>Products currently listed at your retail location</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading inventory from blockchain...
              </div>
            ) : inventory.length > 0 ? (
              <div className="space-y-4">
                {inventory.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Product #{product.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {product.name} • {product.quantity} kg • Grade {product.qualityGrade}
                        </p>
                      </div>
                      <Badge variant="secondary">{product.statusLabel}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Received from distributor • Harvested {product.harvestDate.toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No products currently available for sale.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Record a Sale
            </CardTitle>
            <CardDescription>Finalize a customer purchase and close the blockchain lifecycle.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaleSubmit} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="retailer-product-id">
                  Product ID
                </label>
                <Input
                  id="retailer-product-id"
                  value={sellForm.productId}
                  onChange={(event) => setSellForm((prev) => ({ ...prev, productId: event.target.value }))}
                  placeholder="Enter product ID"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="retailer-consumer-address">
                  Consumer Address
                </label>
                <Input
                  id="retailer-consumer-address"
                  value={sellForm.to}
                  onChange={(event) => setSellForm((prev) => ({ ...prev, to: event.target.value }))}
                  placeholder="0x..."
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="retailer-location">
                  Point of Sale
                </label>
                <Input
                  id="retailer-location"
                  value={sellForm.location}
                  onChange={(event) => setSellForm((prev) => ({ ...prev, location: event.target.value }))}
                  placeholder="Store location"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="retailer-notes">
                  Notes (Optional)
                </label>
                <Input
                  id="retailer-notes"
                  value={sellForm.notes}
                  onChange={(event) => setSellForm((prev) => ({ ...prev, notes: event.target.value }))}
                  placeholder="Receipt, batch, etc."
                />
              </div>
              <div className="md:col-span-2">
                <Button type="submit" className="w-full md:w-auto" disabled={isSelling}>
                  {isSelling && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Complete Sale
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </RoleDashboardShell>
  );
};

const ConsumerDashboard: React.FC<RoleDashboardProps> = ({ account, chainName, stakeholder, profileName, profileOrganization, profileLocation }) => {
  const { getProduct, isProductAuthentic } = useWeb3();
  const [verificationForm, setVerificationForm] = useState({ productId: '', dataHash: '' });
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    product?: ProductSummary;
    isAuthentic: boolean;
  } | null>(null);

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    const productId = Number(verificationForm.productId);
    const dataHash = verificationForm.dataHash.trim();

    if (!productId || Number.isNaN(productId) || !dataHash) {
      toast({ title: 'Incomplete details', description: 'Enter both product ID and data hash to verify.', variant: 'destructive' });
      return;
    }

    setIsVerifying(true);
    try {
      const authentic = await isProductAuthentic(productId, dataHash);
      let productSummary: ProductSummary | undefined;
      try {
        const product = await getProduct(productId);
        if (product?.exists) {
          productSummary = parseProductFromChain(productId, product);
        }
      } catch (error) {
        console.warn('Unable to fetch product details for verification result.', error);
      }
      setVerificationResult({ isAuthentic: authentic, product: productSummary ?? undefined });
    } catch (error) {
      console.error('Verification error:', error);
      toast({ title: 'Verification failed', description: 'Unable to verify product authenticity right now.', variant: 'destructive' });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <RoleDashboardShell
      account={account}
      networkName={chainName}
      roleLabel={ROLE_LABELS[stakeholder.roleKey]}
      stakeholderName={stakeholder.name}
      profileName={profileName}
      profileOrganization={profileOrganization}
      profileLocation={profileLocation}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Verify Product Authenticity
            </CardTitle>
            <CardDescription>
              Enter a product ID and its data hash to verify its blockchain record.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="consumer-product-id">
                  Product ID
                </label>
                <Input
                  id="consumer-product-id"
                  value={verificationForm.productId}
                  onChange={(event) => setVerificationForm((prev) => ({ ...prev, productId: event.target.value }))}
                  placeholder="Enter product ID"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="consumer-data-hash">
                  Product Data Hash
                </label>
                <Input
                  id="consumer-data-hash"
                  value={verificationForm.dataHash}
                  onChange={(event) => setVerificationForm((prev) => ({ ...prev, dataHash: event.target.value }))}
                  placeholder="Hash from QR code or label"
                  required
                />
              </div>
              <Button type="submit" disabled={isVerifying}>
                {isVerifying && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Verify Authenticity
              </Button>
            </form>

            {verificationResult && (
              <div className="mt-6 rounded-lg border p-4 space-y-2">
                <div className={`flex items-center gap-2 text-sm ${verificationResult.isAuthentic ? 'text-green-600' : 'text-red-600'}`}>
                  <AlertCircle className={`w-4 h-4 ${verificationResult.isAuthentic ? 'text-green-600' : 'text-red-600'}`} />
                  {verificationResult.isAuthentic
                    ? 'Product is authentic and matches the blockchain record.'
                    : 'Product authenticity could not be confirmed.'}
                </div>
                {verificationResult.product && (
                  <>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><strong>Name:</strong> {verificationResult.product.name}</p>
                      <p><strong>Status:</strong> {verificationResult.product.statusLabel}</p>
                      <p><strong>Registered Farmer:</strong> {truncateAddress(verificationResult.product.farmer)}</p>
                      {/* NEW: Display distributor details if present */}
                      {verificationResult.product.distributor && (
                        <p><strong>Distributor:</strong> {verificationResult.product.distributorName || 'Unknown'} ({truncateAddress(verificationResult.product.distributor)})</p>
                      )}
                      {/* NEW: Display retailer details if present */}
                      {verificationResult.product.retailer && (
                        <p><strong>Retailer:</strong> {verificationResult.product.retailerName || 'Unknown'} ({truncateAddress(verificationResult.product.retailer)})</p>
                      )}
                    </div>
                    {/* NEW: Supply Chain Timeline */}
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="text-sm font-semibold mb-4">Supply Chain Journey</h4>
                      <SupplyChainTimeline product={verificationResult.product} truncateAddress={truncateAddress} />
                    </div>
                    {/* NEW: Stakeholder Details */}
                    <StakeholderDetails product={verificationResult.product} />
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Search Blockchain Records</CardTitle>
            <CardDescription>Look up detailed product information and history.</CardDescription>
          </CardHeader>
          <CardContent>
            <BlockchainProductSearch />
          </CardContent>
        </Card>
      </div>
    </RoleDashboardShell>
  );
};

const BlockchainDashboard = () => {
  const { profile } = useAuth();
  const { account, chainId, isConnected, stakeholder, getNetworkName } = useWeb3();

  if (!isConnected || !stakeholder?.isRegistered || !account) {
    return <MetaMaskAuth />;
  }

  const walletRoleKey = stakeholder.roleKey;
  const walletRoleLabel = ROLE_LABELS[walletRoleKey];
  const profileRoleLabel = profile?.role ? ROLE_LABELS[profile.role] : undefined;
  const networkName = getNetworkName();

  if (profile?.role && profile.role !== walletRoleKey) {
    return (
      <RoleMismatchNotice
        profileRole={profileRoleLabel ?? 'Authorized role'}
        walletRole={walletRoleLabel}
      />
    );
  }

  const props: RoleDashboardProps = {
    account,
    chainName: networkName,
    stakeholder: stakeholder as DashboardStakeholder,
    profileName: profile?.fullName,
    profileOrganization: profile?.organization,
    profileLocation: profile?.location,
  };

  switch (walletRoleKey) {
    case 'farmer':
      return <FarmerDashboard {...props} />;
    case 'distributor':
      return <DistributorDashboard {...props} />;
    case 'retailer':
      return <RetailerDashboard {...props} />;
    case 'consumer':
      return <ConsumerDashboard {...props} />;
    default:
      return <MetaMaskAuth />;
  }
};

export default BlockchainDashboard;

