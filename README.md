# AgriTrace

A blockchain-based agricultural traceability platform connecting farmers, distributors, retailers, and consumers with verified product flow and origin tracking.

## Overview

AgriTrace revolutionizes agricultural supply chain management by leveraging blockchain technology to create an immutable, transparent record of every product's journey. From the moment a farmer harvests their crop to when it reaches the consumer, every step is recorded on the blockchain, ensuring authenticity, traceability, and trust.

The platform enables stakeholders across the supply chain to register products, track their movement, and verify authenticity using cryptographic hashes. Consumers can verify product origin and authenticity by checking blockchain records, building confidence in the food they purchase.

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling and development
- **TailwindCSS** for styling
- **Shadcn/ui** for UI components
- **React Router** for navigation
- **Ethers.js 6** for Web3 integration

### Blockchain
- **Solidity 0.8.19** for smart contracts
- **Hardhat** for development environment
- **Ethers.js** for contract interactions
- **MetaMask** for wallet connection
- **Ethereum/Polygon** networks (Localhost, Sepolia, Mumbai)

### Backend
- **Supabase** (PostgreSQL) for product indexing
- **Real-time synchronization** between blockchain and database
- **REST API** for fast product searches

## Setup & Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- MetaMask browser extension
- Git for version control

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/AgriTrace.git
   cd AgriTrace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory:
   ```env
   # Supabase Configuration (optional - works without it)
   VITE_USE_SUPABASE=false
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Network Configuration (optional)
   SEPOLIA_RPC_URL=your_sepolia_rpc_url
   MUMBAI_RPC_URL=your_mumbai_rpc_url
   PRIVATE_KEY=your_private_key_for_deployment
   ```

4. **Start Local Blockchain**

   In a separate terminal:
   ```bash
   npx hardhat node
   ```

   This starts a local Ethereum node on `http://127.0.0.1:8545` with 20 test accounts pre-funded with 10,000 ETH each.

5. **Deploy Smart Contract**

   In another terminal:
   ```bash
   npm run deploy:local
   ```

   This compiles and deploys the contract to the local network, saving the address to `src/contracts/deployed-contract.json`.

6. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:8080`

7. **Connect MetaMask**

   - Open MetaMask extension
   - Add network: Localhost 8545
     - RPC URL: `http://127.0.0.1:8545`
     - Chain ID: `1337`
     - Currency Symbol: `ETH`
   - Import one of the test accounts from Hardhat (check terminal output for private keys)
   - Connect your wallet in the application

## Usage Guide

### For Farmers

1. **Sign Up**: Create an account and select "Farmer" role
2. **Connect Wallet**: Connect your MetaMask wallet
3. **Register on Blockchain**: Register as a stakeholder on the blockchain
4. **Register Products**: 
   - Go to "Register Product" tab
   - Fill in product details (name, variety, quantity, location, harvest date, quality grade)
   - Generate a data hash (or use provided hash)
   - Submit transaction via MetaMask
5. **Transfer Products**: Transfer products to distributors when ready

### For Distributors

1. **Sign Up**: Create an account with "Distributor" role
2. **Connect Wallet**: Connect MetaMask and register on blockchain
3. **Receive Products**: Accept product transfers from farmers
4. **Add Details**: Add distributor details to products
5. **Transfer to Retailers**: Transfer products to retailers

### For Retailers

1. **Sign Up**: Create an account with "Retailer" role
2. **Connect Wallet**: Connect MetaMask and register on blockchain
3. **Receive Products**: Accept product transfers from distributors
4. **Add Details**: Add retailer details to products
5. **Sell Products**: Mark products as sold when purchased

### For Consumers

1. **Sign Up**: Create an account with "Consumer" role
2. **Connect Wallet**: Connect MetaMask and register on blockchain
3. **Verify Products**: 
   - Enter product ID and data hash
   - Verify authenticity against blockchain records
   - View complete supply chain timeline
   - See detailed stakeholder information (name, organization, location from signup data)

## Project Structure

```
AgriTrace/
├── contracts/              # Solidity smart contracts
│   └── SupplyChain.sol     # Main supply chain contract
├── scripts/                # Deployment scripts
│   ├── deploy.cjs         # Main deployment script
│   └── deploy-local.js    # Local deployment script
├── src/
│   ├── components/         # React components
│   │   ├── BlockchainDashboard.tsx      # Main dashboard
│   │   ├── BlockchainProductRegistration.tsx
│   │   ├── BlockchainProductSearch.tsx
│   │   ├── MetaMaskAuth.tsx
│   │   ├── SupplyChainTimeline.tsx
│   │   ├── StakeholderDetails.tsx
│   │   └── ui/            # Shadcn/ui components
│   ├── hooks/             # Custom React hooks
│   │   ├── useWeb3.tsx    # Web3/blockchain integration
│   │   ├── useAuth.tsx    # Authentication
│   │   └── useProductIndexer.tsx
│   ├── pages/             # Page components
│   │   ├── Auth.tsx       # Login/signup page
│   │   ├── Dashboard.tsx  # Main dashboard page
│   │   ├── Index.tsx      # Landing page
│   │   └── Scanner.tsx   # QR scanner page
│   ├── contracts/         # Contract ABIs and addresses
│   ├── constants/         # Constants and configurations
│   └── integrations/      # Third-party integrations
│       └── supabase/      # Supabase client and types
├── public/                # Static assets
│   └── as-symbol.png      # Favicon
├── hardhat.config.cjs     # Hardhat configuration
├── vite.config.ts         # Vite configuration
└── package.json           # Dependencies and scripts
```

## Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Smart Contracts
npm run compile          # Compile Solidity contracts
npm run test             # Run Hardhat tests
npm run deploy:local     # Deploy to local network
npm run deploy:sepolia   # Deploy to Sepolia testnet
npm run deploy:mumbai    # Deploy to Mumbai testnet

# Code Quality
npm run lint             # Run ESLint
```

## Network Configuration

### Local Development
- **Chain ID**: 1337
- **RPC URL**: http://127.0.0.1:8545
- **Currency**: ETH

### Sepolia Testnet
- **Chain ID**: 11155111
- **RPC URL**: https://rpc.sepolia.org
- **Explorer**: https://sepolia.etherscan.io

### Mumbai Testnet (Polygon)
- **Chain ID**: 80001
- **RPC URL**: https://rpc-mumbai.maticvigil.com
- **Explorer**: https://mumbai.polygonscan.com

## Smart Contract

The main smart contract (`SupplyChain.sol`) provides:

- **Stakeholder Registration**: Register users with roles (Farmer, Distributor, Retailer, Consumer)
- **Product Registration**: Register products with complete metadata
- **Product Transfer**: Transfer products between stakeholders
- **Product Verification**: Verify product authenticity using data hash
- **Transaction History**: Track all product movements
- **Supply Chain Timeline**: View complete product journey with stakeholder details

### Key Functions

```solidity
registerStakeholder(role, name, organization)  // Register as stakeholder
registerProduct(name, variety, quantity, ...)  // Register new product
transferProduct(productId, to, status, ...)     // Transfer product
getProduct(productId)                          // Get product details
isProductAuthentic(productId, dataHash)         // Verify authenticity
addDistributorDetails(productId, name, org)     // Add distributor info
addRetailerDetails(productId, name, org)        // Add retailer info
```

## Deployment

### Frontend Deployment

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
1. Build the project: `npm run build`
2. Upload the `dist/` folder to Netlify
3. Or connect your GitHub repository for automatic deployments

**Other Platforms:**
- Build: `npm run build`
- Deploy the `dist/` folder to your hosting service

### Smart Contract Deployment

1. **Configure Network**: Update `hardhat.config.cjs` with network settings
2. **Set Environment Variables**: Add `PRIVATE_KEY` and RPC URLs to `.env`
3. **Deploy**: Run `npm run deploy:sepolia` or `npm run deploy:mumbai`
4. **Update Contract Address**: Update `src/contracts/deployed-contract.json` with new address

## Security Considerations

- **Private Keys**: Never commit private keys to version control
- **Environment Variables**: Keep sensitive data in `.env` file (already in `.gitignore`)
- **Smart Contract Audits**: Consider professional audits before mainnet deployment
- **Access Control**: Verify role-based permissions in smart contract
- **Input Validation**: All user inputs are validated on both frontend and smart contract

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

Developed as part of a blockchain-based agricultural transparency project. Built with React, Hardhat, and Supabase to bring transparency to agricultural supply chains.

---

**AgriTrace** - Bringing transparency to agricultural supply chains, one block at a time. 🌾
