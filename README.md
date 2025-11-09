# AgriChain

A blockchain-based agricultural supply chain transparency platform that enables end-to-end tracking of products from farm to consumer. Built with React, Hardhat, and Supabase, AgriChain provides immutable product records, real-time verification, and complete supply chain visibility.

## 🌾 Overview

AgriChain revolutionizes agricultural supply chain management by leveraging blockchain technology to create an immutable, transparent record of every product's journey. From the moment a farmer harvests their crop to when it reaches the consumer, every step is recorded on the blockchain, ensuring authenticity, traceability, and trust.

### Key Features

- **Blockchain-Based Product Registration**: Farmers register products directly on-chain with immutable records
- **End-to-End Supply Chain Tracking**: Visual timeline showing product journey from Farmer → Distributor → Retailer → Consumer
- **Product Verification**: Consumers can verify product authenticity using product ID and data hash
- **Role-Based Access Control**: Four stakeholder roles (Farmer, Distributor, Retailer, Consumer) with specific permissions
- **Real-Time Dashboard**: Role-specific dashboards with product management, transfer tracking, and transaction history
- **QR Code Integration**: Scan QR codes to quickly access product information
- **Smart Contract Integration**: Solidity smart contracts deployed on Ethereum/Polygon networks
- **Supabase Backend**: Fast product search and indexing with blockchain verification

## 🛠️ Tech Stack

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

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **MetaMask** browser extension - [Install](https://metamask.io/)
- **Git** for version control

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd trace-root
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

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

### 4. Start Local Blockchain

In a separate terminal, start the Hardhat local network:

```bash
npx hardhat node
```

This will start a local Ethereum node on `http://127.0.0.1:8545` with 20 test accounts pre-funded with 10,000 ETH each.

### 5. Deploy Smart Contract

In another terminal, deploy the contract to the local network:

```bash
npm run deploy:local
```

This will:
- Compile the smart contract
- Deploy it to the local Hardhat network
- Save the contract address to `src/contracts/deployed-contract.json`

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### 7. Connect MetaMask

1. Open MetaMask extension
2. Click the network dropdown and select "Add Network"
3. Add the local network:
   - Network Name: `Localhost 8545`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `1337`
   - Currency Symbol: `ETH`
4. Import one of the test accounts from Hardhat (check the terminal output for private keys)
5. Connect your wallet in the application

## 📁 Project Structure

```
trace-root/
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
│   │   └── Scanner.tsx    # QR scanner page
│   ├── contracts/         # Contract ABIs and addresses
│   ├── constants/         # Constants and configurations
│   └── integrations/      # Third-party integrations
│       └── supabase/      # Supabase client and types
├── hardhat.config.cjs     # Hardhat configuration
├── vite.config.ts         # Vite configuration
└── package.json           # Dependencies and scripts
```

## 🎯 Usage Guide

### For Farmers

1. **Sign Up**: Create an account and select "Farmer" role
2. **Connect Wallet**: Connect your MetaMask wallet
3. **Register on Blockchain**: Register as a stakeholder on the blockchain
4. **Register Products**: 
   - Go to "Register Product" tab
   - Fill in product details (name, variety, quantity, location, etc.)
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
   - See detailed stakeholder information

## 🔧 Available Scripts

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

## 🌐 Network Configuration

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

## 📚 Smart Contract

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
transferProduct(productId, to, status, ...)   // Transfer product
getProduct(productId)                          // Get product details
isProductAuthentic(productId, dataHash)        // Verify authenticity
addDistributorDetails(productId, name, org)     // Add distributor info
addRetailerDetails(productId, name, org)       // Add retailer info
```

## 🚢 Deployment

### Frontend Deployment

The frontend can be deployed to any static hosting service:

**Vercel:**
```bash
npm install -g vercel
vercel
```

**Netlify:**
```bash
npm run build
# Upload dist/ folder to Netlify
```

**Other Platforms:**
- Build the project: `npm run build`
- Deploy the `dist/` folder to your hosting service

### Smart Contract Deployment

1. **Configure Network**: Update `hardhat.config.cjs` with network settings
2. **Set Environment Variables**: Add `PRIVATE_KEY` and RPC URLs to `.env`
3. **Deploy**: Run `npm run deploy:sepolia` or `npm run deploy:mumbai`
4. **Update Contract Address**: Update `src/contracts/deployed-contract.json` with new address

## 🔒 Security Considerations

- **Private Keys**: Never commit private keys to version control
- **Environment Variables**: Keep sensitive data in `.env` file (already in `.gitignore`)
- **Smart Contract Audits**: Consider professional audits before mainnet deployment
- **Access Control**: Verify role-based permissions in smart contract
- **Input Validation**: All user inputs are validated on both frontend and smart contract

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Smart contracts developed with [Hardhat](https://hardhat.org/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Database powered by [Supabase](https://supabase.com/)

## 📞 Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

---

**AgriChain** - Bringing transparency to agricultural supply chains, one block at a time. 🌾
