import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ethers } from 'ethers';
import { toast } from '@/hooks/use-toast';
import SupplyChainABI from '@/contracts/SupplyChain.json';
import deployedContract from '../contracts/deployed-contract.json';
import { ROLE_LABELS, ROLE_KEY_TO_INDEX, ROLE_INDEX_TO_KEY, RoleKey } from '@/constants/roles';

const NETWORKS = {
  localhost: {
    chainId: '0x539',
    chainName: 'Localhost 8545',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['http://127.0.0.1:8545'],
    blockExplorerUrls: ['http://127.0.0.1:8545']
  },
  sepolia: {
    chainId: '0xaa36a7',
    chainName: 'Sepolia Test Network',
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    rpcUrls: ['https://rpc.sepolia.org'],
    blockExplorerUrls: ['https://sepolia.etherscan.io']
  },
  mumbai: {
    chainId: '0x13881',
    chainName: 'Mumbai Polygon Testnet',
    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com']
  }
};

const CONTRACT_ADDRESSES = {
  localhost: deployedContract.address,
  sepolia: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  mumbai: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  hardhat: '0x5FbDB2315678afecb367f032d93F642f64180aa3'
};

interface StakeholderState {
  walletAddress: string;
  roleIndex: number;
  roleKey: RoleKey;
  name: string;
  organization: string;
  isRegistered: boolean;
}

const resolveRoleKey = (roleIndex: number): RoleKey => {
  const key = ROLE_INDEX_TO_KEY[roleIndex as keyof typeof ROLE_INDEX_TO_KEY];
  return key ?? 'farmer';
};

const mapStakeholder = (raw: any, fallbackAddress?: string): StakeholderState => {
  if (!raw) {
    return {
      walletAddress: fallbackAddress ?? '',
      roleIndex: ROLE_KEY_TO_INDEX.farmer,
      roleKey: 'farmer',
      name: '',
      organization: '',
      isRegistered: false,
    };
  }

  const walletAddress = raw.walletAddress ?? raw[0] ?? fallbackAddress ?? '';
  const roleValue = raw.role ?? raw[1] ?? ROLE_KEY_TO_INDEX.farmer;
  const roleIndex = Number(roleValue);
  const roleKey = resolveRoleKey(roleIndex);

  return {
    walletAddress,
    roleIndex,
    roleKey,
    name: raw.name ?? raw[2] ?? '',
    organization: raw.organization ?? raw[3] ?? '',
    isRegistered: Boolean(raw.isRegistered ?? raw[4] ?? false),
  };
};

interface Web3ContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  contract: any;
  chainId: string | null;
  isConnected: boolean;
  isLoading: boolean;
  stakeholder: StakeholderState | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (network: keyof typeof NETWORKS) => Promise<void>;
  getNetworkName: () => string;
  registerStakeholder: (role: number, name: string, organization: string) => Promise<void>;
  registerProduct: (productData: any) => Promise<{ productId: number; blockNumber: number; transactionHash: string }>;
  transferProduct: (productId: number, to: string, newStatus: number, location: string, transactionType: string, additionalData: string) => Promise<void>;
  getProduct: (productId: number) => Promise<any>;
  getProductTransactions: (productId: number) => Promise<any[]>;
  getProductsByFarmer: (farmerAddress: string) => Promise<number[]>;
  isProductAuthentic: (productId: number, dataHash: string) => Promise<boolean>;
  listenForProductRegistered: (callback: (productId: number, farmer: string, blockNumber: number) => void) => (() => void) | undefined;
  refreshStakeholder: () => Promise<void>;
  getStakeholderByAddress: (address: string) => Promise<StakeholderState>;
  getProductCount: () => Promise<number>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stakeholder, setStakeholder] = useState<StakeholderState | null>(null);

  const getContractAddress = (chainId: string) => {
    switch (chainId) {
      case '0x539':
        return CONTRACT_ADDRESSES.localhost;
      case '0xaa36a7':
        return CONTRACT_ADDRESSES.sepolia;
      case '0x13881':
        return CONTRACT_ADDRESSES.mumbai;
      default:
        return CONTRACT_ADDRESSES.localhost;
    }
  };

  const getNetworkName = (chainId: string) => {
    switch (chainId) {
      case '0x539':
        return 'Localhost';
      case '0xaa36a7':
        return 'Sepolia';
      case '0x13881':
        return 'Mumbai';
      default:
        return 'Unknown Network';
    }
  };

  const initializeContract = async (provider: ethers.BrowserProvider, signer: ethers.JsonRpcSigner, chainId: string) => {
    const contractAddress = getContractAddress(chainId);
    const networkName = getNetworkName(chainId);
    if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
      throw new Error(`Contract not configured for ${networkName}. Please deploy the contract first.`);
    }
    try {
      const contractInstance = new ethers.Contract(contractAddress, SupplyChainABI.abi, signer);
      const code = await provider.getCode(contractAddress);
      if (code === '0x') {
        throw new Error(`No contract deployed at address ${contractAddress}`);
      }
      toast({ title: "Blockchain Connected", description: `Connected to smart contract on ${networkName}` });
      return contractInstance;
    } catch (error) {
      console.error('Error initializing contract:', error);
      throw error;
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({ title: "MetaMask Required", description: "Please install MetaMask to use this application.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const chainId = '0x' + network.chainId.toString(16);
      const activeAccount = accounts[0];
      setAccount(activeAccount);
      setProvider(provider);
      setSigner(signer);
      setChainId(chainId);
      setIsConnected(true);
      const contractInstance = await initializeContract(provider, signer, chainId);
      setContract(contractInstance);
      try {
        const stakeholderData = await contractInstance.getStakeholder(activeAccount);
        const formatted = mapStakeholder(stakeholderData, activeAccount);
        setStakeholder(formatted);
        if (formatted.isRegistered) {
          toast({
            title: 'Stakeholder Synced',
            description: `Wallet recognized as ${ROLE_LABELS[formatted.roleKey]}.`,
          });
        }
      } catch (err) {
        console.log('Stakeholder not registered yet', err);
        setStakeholder(mapStakeholder(null, activeAccount));
      }
      toast({ title: "Wallet Connected", description: `Connected to ${activeAccount.slice(0, 6)}...${activeAccount.slice(-4)}` });
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast({ title: "Connection Failed", description: error.message || "Failed to connect wallet", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setContract(null);
    setChainId(null);
    setIsConnected(false);
    setStakeholder(null);
    toast({ title: "Wallet Disconnected", description: "Your wallet has been disconnected." });
  };

  const switchNetwork = async (network: keyof typeof NETWORKS) => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: NETWORKS[network].chainId }] });
    } catch (error: any) {
      if (error.code === 4902) {
        await window.ethereum.request({ method: 'wallet_addEthereumChain', params: [NETWORKS[network]] });
      } else {
        console.error('Error switching network:', error);
      }
    }
  };

  const registerStakeholder = async (role: number, name: string, organization: string) => {
    if (!contract) throw new Error('Contract not initialized');
    if (!account) throw new Error('Wallet not connected');
    try {
      const tx = await contract.registerStakeholder(role, name, organization);
      toast({ title: "Transaction Submitted", description: "Registering stakeholder on blockchain..." });
      await tx.wait();
      const updatedStakeholder = await contract.getStakeholder(account);
      const formatted = mapStakeholder(updatedStakeholder, account);
      setStakeholder(formatted);
      toast({ title: "Success!", description: `Stakeholder registered successfully as ${ROLE_LABELS[formatted.roleKey]}.` });
    } catch (error: any) {
      console.error('Error registering stakeholder:', error);
      toast({ title: "Registration Failed", description: error.message || "Failed to register stakeholder", variant: "destructive" });
      throw error;
    }
  };

  const refreshStakeholder = useCallback(async () => {
    if (!account) {
      setStakeholder(null);
      return;
    }

    if (!contract) {
      // Contract not ready yet; keep previous state
      return;
    }

    try {
      const updatedStakeholder = await contract.getStakeholder(account);
      setStakeholder(mapStakeholder(updatedStakeholder, account));
    } catch (error) {
      console.error('Error refreshing stakeholder state:', error);
      setStakeholder(mapStakeholder(null, account));
    }
  }, [account, contract]);

  const getStakeholderByAddress = useCallback(
    async (address: string): Promise<StakeholderState> => {
      if (!contract) throw new Error('Contract not initialized');
      const stakeholderData = await contract.getStakeholder(address);
      return mapStakeholder(stakeholderData, address);
    },
    [contract]
  );

  const getProductCount = useCallback(async (): Promise<number> => {
    if (!contract) throw new Error('Contract not initialized');
    const count = await contract.productCounter();
    return Number(count);
  }, [contract]);

  const registerProduct = async (productData: any): Promise<{ productId: number; blockNumber: number; transactionHash: string }> => {
    if (!contract) throw new Error('Contract not initialized');
    try {
      const tx = await contract.registerProduct(
        productData.name,
        productData.variety,
        productData.quantity,
        productData.farmLocation,
        Math.floor(new Date(productData.harvestDate).getTime() / 1000),
        productData.qualityGrade,
        productData.dataHash
      );
      toast({ title: "Transaction Submitted", description: "Registering product on blockchain..." });
      const receipt = await tx.wait();
      let productId = 0;
      const blockNumber = receipt.blockNumber || 0;
      const transactionHash = receipt.hash || tx.hash;
      if (receipt.logs && receipt.logs.length > 0) {
        const eventLog = receipt.logs.find((log: any) => {
          try {
            const parsed = contract.interface.parseLog(log);
            return parsed?.name === 'ProductRegistered';
          } catch {
            return false;
          }
        });
        if (eventLog) {
          const parsed = contract.interface.parseLog(eventLog);
          productId = Number(parsed?.args.productId);
        }
      }
      toast({ title: "Success!", description: `Product registered on blockchain with ID: ${productId}` });
      return { productId, blockNumber, transactionHash };
    } catch (error: any) {
      console.error('Error registering product:', error);
      toast({ title: "Registration Failed", description: error.message || "Failed to register product", variant: "destructive" });
      throw error;
    }
  };

  const transferProduct = async (productId: number, to: string, newStatus: number, location: string, transactionType: string, additionalData: string) => {
    if (!contract) throw new Error('Contract not initialized');
    try {
      const tx = await contract.transferProduct(productId, to, newStatus, location, transactionType, additionalData);
      toast({ title: "Transaction Submitted", description: "Transferring product..." });
      await tx.wait();
      toast({ title: "Success", description: "Product transferred successfully!" });
    } catch (error: any) {
      console.error('Error transferring product:', error);
      toast({ title: "Transfer Failed", description: error.message || "Failed to transfer product", variant: "destructive" });
      throw error;
    }
  };

  const getProduct = async (productId: number) => {
    if (!contract) throw new Error('Contract not initialized');
    return await contract.getProduct(productId);
  };

  const getProductTransactions = async (productId: number) => {
    if (!contract) throw new Error('Contract not initialized');
    return await contract.getProductTransactions(productId);
  };

  const getProductsByFarmer = async (farmerAddress: string) => {
    if (!contract) throw new Error('Contract not initialized');
    return await contract.getProductsByFarmer(farmerAddress);
  };

  const isProductAuthentic = async (productId: number, dataHash: string) => {
    if (!contract) throw new Error('Contract not initialized');
    return await contract.isProductAuthentic(productId, dataHash);
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) disconnectWallet();
        else setAccount(accounts[0]);
      });
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  useEffect(() => {
    refreshStakeholder();
  }, [refreshStakeholder]);

  const listenForProductRegistered = (callback: (productId: number, farmer: string, blockNumber: number) => void) => {
    if (!contract) return;
    const filter = contract.filters.ProductRegistered();
    contract.on(filter, (productId, name, farmer, harvestDate, event) => {
      callback(Number(productId), farmer, event.blockNumber);
    });
    return () => {
      contract.removeAllListeners(filter);
    };
  };

  const value: Web3ContextType = {
    account,
    provider,
    signer,
    contract,
    chainId,
    isConnected,
    isLoading,
    stakeholder,
    connectWallet,
    disconnectWallet,
    switchNetwork,
    getNetworkName: () => (chainId ? getNetworkName(chainId) : 'Not Connected'),
    registerStakeholder,
    registerProduct,
    transferProduct,
    getProduct,
    getProductTransactions,
    getProductsByFarmer,
    isProductAuthentic,
    listenForProductRegistered,
    refreshStakeholder,
    getStakeholderByAddress,
    getProductCount,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) throw new Error('useWeb3 must be used within a Web3Provider');
  return context;
};
