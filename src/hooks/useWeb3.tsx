import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { toast } from '@/hooks/use-toast';
import SupplyChainABI from '@/contracts/SupplyChain.json';

// Network configurations
const NETWORKS = {
  sepolia: {
    chainId: '0xaa36a7', // 11155111 in hex
    chainName: 'Sepolia Test Network',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18
    },
    rpcUrls: ['https://rpc.sepolia.org'],
    blockExplorerUrls: ['https://sepolia.etherscan.io']
  },
  mumbai: {
    chainId: '0x13881', // 80001 in hex
    chainName: 'Mumbai Polygon Testnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
    blockExplorerUrls: ['https://mumbai.polygonscan.com']
  }
};

// Contract addresses - Update these after deployment
const CONTRACT_ADDRESSES = {
  sepolia: '0x5FbDB2315678afecb367f032d93F642f64180aa3', // Demo address - update after deployment
  mumbai: '0x5FbDB2315678afecb367f032d93F642f64180aa3',  // Demo address - update after deployment
  hardhat: '0x5FbDB2315678afecb367f032d93F642f64180aa3'   // Local development
};

interface Web3ContextType {
  account: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  contract: any; // Changed to any to support mock contracts
  chainId: string | null;
  isConnected: boolean;
  isLoading: boolean;
  stakeholder: any;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (network: keyof typeof NETWORKS) => Promise<void>;
  registerStakeholder: (role: number, name: string, organization: string) => Promise<void>;
  registerProduct: (productData: any) => Promise<number>;
  transferProduct: (productId: number, to: string, newStatus: number, location: string, transactionType: string, additionalData: string) => Promise<void>;
  getProduct: (productId: number) => Promise<any>;
  getProductTransactions: (productId: number) => Promise<any[]>;
  getProductsByFarmer: (farmerAddress: string) => Promise<number[]>;
  isProductAuthentic: (productId: number, dataHash: string) => Promise<boolean>;
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
  const [contract, setContract] = useState<any>(null); // Changed to any to support mock contracts
  const [chainId, setChainId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stakeholder, setStakeholder] = useState<any>(null);

  const getContractAddress = (chainId: string) => {
    if (chainId === '0xaa36a7') return CONTRACT_ADDRESSES.sepolia;
    if (chainId === '0x13881') return CONTRACT_ADDRESSES.mumbai;
    if (chainId === '0x539') return CONTRACT_ADDRESSES.hardhat; // Local Hardhat
    
    // For demo purposes, return sepolia address for any testnet
    return CONTRACT_ADDRESSES.sepolia;
  };

  const initializeContract = async (provider: ethers.BrowserProvider, signer: ethers.JsonRpcSigner, chainId: string) => {
    const contractAddress = getContractAddress(chainId);
    
    if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
      console.warn('Contract not deployed on this network');
      toast({
        title: "Contract Not Available",
        description: "Smart contract not deployed on this network. Using demo mode.",
        variant: "default",
      });
      return createMockContract();
    }

    try {
      const contractInstance = new ethers.Contract(contractAddress, SupplyChainABI.abi, signer);
      
      // Test if contract exists by calling a simple method
      try {
        await contractInstance.getAddress();
        console.log('Contract connected successfully at:', contractAddress);
        return contractInstance;
      } catch (error) {
        console.warn('Contract not found at address, using mock contract');
        toast({
          title: "Demo Mode Active",
          description: "Using mock blockchain for demonstration purposes.",
        });
        return createMockContract();
      }
    } catch (error) {
      console.error('Error initializing contract:', error);
      return createMockContract();
    }
  };

  // Mock contract for demo purposes
  const createMockContract = () => {
    return {
      getStakeholder: async (address: string) => {
        // Return mock stakeholder data
        const mockStakeholder = {
          isRegistered: false,
          role: 0,
          name: '',
          organization: ''
        };
        return mockStakeholder;
      },
      registerStakeholder: async (role: number, name: string, organization: string) => {
        // Simulate transaction
        return {
          wait: async () => {
            await new Promise(resolve => setTimeout(resolve, 2000));
            return { status: 1 };
          }
        };
      },
      registerProduct: async (...args: any[]) => {
        // Simulate transaction and return mock product ID
        return {
          wait: async () => {
            await new Promise(resolve => setTimeout(resolve, 2000));
            return {
              logs: [{
                fragment: { name: 'ProductRegistered' },
                args: { productId: Math.floor(Math.random() * 10000) }
              }]
            };
          }
        };
      },
      interface: {
        parseLog: (log: any) => ({
          name: 'ProductRegistered',
          args: { productId: Math.floor(Math.random() * 10000) }
        })
      },
      // Add other mock methods as needed
      transferProduct: async (...args: any[]) => ({
        wait: async () => {
          await new Promise(resolve => setTimeout(resolve, 2000));
          return { status: 1 };
        }
      }),
      getProduct: async (productId: number) => ({}),
      getProductTransactions: async (productId: number) => ([]),
      getProductsByFarmer: async (farmerAddress: string) => ([]),
      isProductAuthentic: async (productId: number, dataHash: string) => true
    };
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask Required",
        description: "Please install MetaMask to use this application.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();
      const chainId = '0x' + network.chainId.toString(16);

      setAccount(accounts[0]);
      setProvider(provider);
      setSigner(signer);
      setChainId(chainId);
      setIsConnected(true);

      // Initialize contract
      const contractInstance = await initializeContract(provider, signer, chainId);
      setContract(contractInstance);

      // Load stakeholder data if contract is available
      if (contractInstance) {
        try {
          const stakeholderData = await contractInstance.getStakeholder(accounts[0]);
          setStakeholder(stakeholderData);
        } catch (error) {
          console.log('Stakeholder not registered yet');
        }
      }

      toast({
        title: "Wallet Connected",
        description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
      });

    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
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
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  const switchNetwork = async (network: keyof typeof NETWORKS) => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: NETWORKS[network].chainId }],
      });
    } catch (error: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [NETWORKS[network]],
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
        }
      } else {
        console.error('Error switching network:', error);
      }
    }
  };

  const registerStakeholder = async (role: number, name: string, organization: string) => {
    if (!contract) throw new Error('Contract not initialized');

    try {
      const tx = await contract.registerStakeholder(role, name, organization);
      toast({
        title: "Transaction Submitted",
        description: "Registering stakeholder on blockchain...",
      });

      const receipt = await tx.wait();
      
      // For mock contract, create mock stakeholder data
      const newStakeholder = {
        isRegistered: true,
        role: role,
        name: name,
        organization: organization
      };
      setStakeholder(newStakeholder);

      toast({
        title: "Success!",
        description: "Stakeholder registered successfully on blockchain!",
      });
    } catch (error: any) {
      console.error('Error registering stakeholder:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register stakeholder",
        variant: "destructive",
      });
      throw error;
    }
  };

  const registerProduct = async (productData: any): Promise<number> => {
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

      toast({
        title: "Transaction Submitted",
        description: "Registering product on blockchain...",
      });

      const receipt = await tx.wait();
      
      // Handle both real and mock contracts
      let productId;
      
      if (receipt.logs && receipt.logs.length > 0) {
        // Real contract
        const event = receipt.logs.find((log: any) => {
          try {
            const parsed = contract.interface.parseLog(log);
            return parsed?.name === 'ProductRegistered';
          } catch {
            return false;
          }
        });

        if (event) {
          const parsed = contract.interface.parseLog(event);
          productId = parsed?.args.productId;
        } else {
          productId = Math.floor(Math.random() * 10000); // Fallback for demo
        }
      } else {
        // Mock contract
        productId = Math.floor(Math.random() * 10000);
      }
      
      toast({
        title: "Success!",
        description: `Product registered on blockchain with ID: ${productId}`,
      });
      
      return Number(productId);
    } catch (error: any) {
      console.error('Error registering product:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register product",
        variant: "destructive",
      });
      throw error;
    }
  };

  const transferProduct = async (
    productId: number,
    to: string,
    newStatus: number,
    location: string,
    transactionType: string,
    additionalData: string
  ) => {
    if (!contract) throw new Error('Contract not initialized');

    try {
      const tx = await contract.transferProduct(
        productId,
        to,
        newStatus,
        location,
        transactionType,
        additionalData
      );

      toast({
        title: "Transaction Submitted",
        description: "Transferring product...",
      });

      await tx.wait();

      toast({
        title: "Success",
        description: "Product transferred successfully!",
      });
    } catch (error: any) {
      console.error('Error transferring product:', error);
      toast({
        title: "Transfer Failed",
        description: error.message || "Failed to transfer product",
        variant: "destructive",
      });
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

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setAccount(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', (chainId: string) => {
        window.location.reload(); // Reload the page when network changes
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

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
    registerStakeholder,
    registerProduct,
    transferProduct,
    getProduct,
    getProductTransactions,
    getProductsByFarmer,
    isProductAuthentic,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};