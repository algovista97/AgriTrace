import { useState } from 'react';
import crypto from 'crypto-js';

interface BlockchainTransaction {
  id: string;
  productId: string;
  fromStakeholder?: string;
  toStakeholder: string;
  transactionType: string;
  location: string;
  timestamp: Date;
  data: any;
  hash: string;
  previousHash: string;
}

class BlockchainSimulator {
  private chain: BlockchainTransaction[] = [];

  constructor() {
    this.createGenesisBlock();
  }

  private createGenesisBlock() {
    const genesisBlock: BlockchainTransaction = {
      id: 'genesis',
      productId: 'genesis',
      toStakeholder: 'system',
      transactionType: 'genesis',
      location: 'blockchain',
      timestamp: new Date(),
      data: { message: 'Genesis block for AgriChain' },
      hash: this.calculateHash('genesis', new Date(), { message: 'Genesis block' }),
      previousHash: '0'
    };
    
    this.chain.push(genesisBlock);
  }

  private calculateHash(id: string, timestamp: Date, data: any): string {
    const previousHash = this.getLatestBlock()?.hash || '0';
    return crypto.SHA256(id + timestamp.toISOString() + JSON.stringify(data) + previousHash).toString();
  }

  private getLatestBlock(): BlockchainTransaction | undefined {
    return this.chain[this.chain.length - 1];
  }

  public addTransaction(transaction: Omit<BlockchainTransaction, 'hash' | 'previousHash'>): string {
    const previousHash = this.getLatestBlock()?.hash || '0';
    const hash = this.calculateHash(transaction.id, transaction.timestamp, transaction.data);
    
    const blockchainTransaction: BlockchainTransaction = {
      ...transaction,
      hash,
      previousHash
    };
    
    this.chain.push(blockchainTransaction);
    return hash;
  }

  public getChain(): BlockchainTransaction[] {
    return this.chain;
  }

  public getTransactionsByProduct(productId: string): BlockchainTransaction[] {
    return this.chain.filter(block => block.productId === productId);
  }

  public isChainValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Verify hash integrity
      const expectedHash = this.calculateHash(currentBlock.id, currentBlock.timestamp, currentBlock.data);
      if (currentBlock.hash !== expectedHash) {
        return false;
      }

      // Verify chain linkage
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

// Singleton instance
const blockchainInstance = new BlockchainSimulator();

export const useBlockchain = () => {
  const [isValid, setIsValid] = useState(true);

  const addTransaction = (transaction: Omit<BlockchainTransaction, 'hash' | 'previousHash'>) => {
    const hash = blockchainInstance.addTransaction(transaction);
    setIsValid(blockchainInstance.isChainValid());
    return hash;
  };

  const getTransactionsByProduct = (productId: string) => {
    return blockchainInstance.getTransactionsByProduct(productId);
  };

  const getFullChain = () => {
    return blockchainInstance.getChain();
  };

  const verifyChain = () => {
    const valid = blockchainInstance.isChainValid();
    setIsValid(valid);
    return valid;
  };

  return {
    addTransaction,
    getTransactionsByProduct,
    getFullChain,
    verifyChain,
    isValid
  };
};

export type { BlockchainTransaction };