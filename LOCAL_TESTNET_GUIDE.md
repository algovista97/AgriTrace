# Local Testnet Setup Guide

This guide will help you set up and run the DApp on a local blockchain network (Hardhat) for development and testing.

## Prerequisites

- Node.js (v16 or higher)
- MetaMask browser extension
- Git

## Quick Start

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Start Local Blockchain

Open a new terminal and start the Hardhat local network:

```bash
npx hardhat node
```

This will:
- Start a local blockchain on `http://127.0.0.1:8545`
- Create 20 test accounts with 10,000 ETH each
- Display the accounts and private keys

**Keep this terminal running** - it's your local blockchain!

### 3. Deploy Smart Contract

In another terminal, deploy the contract to your local network:

```bash
npx hardhat run scripts/deploy-local.js --network localhost
```

Copy the deployed contract address and update it in `src/hooks/useWeb3.tsx`:

```javascript
const CONTRACT_ADDRESSES = {
  localhost: '0xYourDeployedContractAddress', // Replace with actual address
  // ... other networks
};
```

### 4. Configure MetaMask

#### Add Local Network:
1. Open MetaMask
2. Click network dropdown (top of MetaMask)
3. Click "Add network" → "Add a network manually"
4. Enter these details:
   - **Network name**: Localhost 8545
   - **New RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 1337
   - **Currency symbol**: ETH
5. Click "Save"

#### Import Test Account:
1. In MetaMask, click account circle → "Add account or hardware wallet" → "Import account"
2. Copy any private key from the Hardhat terminal (starts with `0x`)
3. Paste and import
4. You now have 10,000 test ETH!

### 5. Start Frontend

```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:5173` and connect your MetaMask wallet.

## Testing the DApp

### 1. Connect Wallet
- Click "Connect Wallet" 
- Select the localhost network in MetaMask
- Approve the connection

### 2. Register as Stakeholder
- Go to Dashboard
- Fill in stakeholder registration form
- Choose your role (Farmer, Distributor, etc.)
- Submit transaction via MetaMask

### 3. Register Products (Farmers only)
- Navigate to product registration
- Fill in product details
- Submit transaction
- Get a product ID and QR code

### 4. Transfer Products (Distributors/Retailers)
- Scan QR code or enter product ID
- Update status and location
- Submit transfer transaction

### 5. Verify Products (Consumers)
- Scan QR code
- View complete product history
- Verify authenticity on blockchain

## Network Information

| Parameter | Value |
|-----------|-------|
| **Network Name** | Localhost 8545 |
| **RPC URL** | http://127.0.0.1:8545 |
| **Chain ID** | 1337 |
| **Currency** | ETH |
| **Explorer** | N/A (Local only) |

## Troubleshooting

### "Contract not deployed" error
- Make sure Hardhat node is running
- Redeploy contract: `npx hardhat run scripts/deploy-local.js --network localhost`
- Update contract address in `useWeb3.tsx`

### MetaMask connection issues
- Ensure you're on the Localhost 8545 network
- Clear MetaMask activity tab (Settings → Advanced → Clear activity tab data)
- Restart MetaMask

### Transactions failing
- Check you have enough test ETH
- Ensure MetaMask is connected to localhost:8545
- Try refreshing the page

### Frontend not updating
- Restart the development server
- Clear browser cache
- Check browser console for errors

## Development Commands

```bash
# Start local blockchain
npx hardhat node

# Deploy to local network
npx hardhat run scripts/deploy-local.js --network localhost

# Run tests
npx hardhat test

# Compile contracts
npx hardhat compile

# Start frontend
npm run dev
```

## Contract Interaction

The DApp automatically detects the network and:
- ✅ **Localhost (1337)**: Connects to your deployed contract
- ✅ **Sepolia (11155111)**: Connects to testnet contract
- ✅ **Mumbai (80001)**: Connects to polygon testnet
- ✅ **Demo Mode**: Falls back when contract not deployed

## Next Steps

Once you've tested locally:
1. Deploy to Sepolia or Mumbai testnet (see `DEPLOYMENT_GUIDE.md`)
2. Update contract addresses for testnets
3. Test with real testnet tokens
4. Deploy to mainnet for production

---

**Happy Testing! 🚀**

For issues, check the browser console and MetaMask for error messages.
