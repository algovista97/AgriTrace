# 🌾 AgriTrace

**AgriTrace** is a blockchain-powered agricultural supply chain traceability system.  
It enables **farmers, distributors, retailers, and consumers** to track and verify agricultural product authenticity and journey using **Ethereum smart contracts**, **Supabase**, and a modern React frontend.

---

## 🚀 Features

- **Blockchain-backed product registration and tracking** - Every product is registered on-chain with immutable records
- **Role-based dashboards** - Customized interfaces for Farmer, Distributor, Retailer, and Consumer roles
- **MetaMask wallet integration** - Seamless Web3 authentication and transaction signing
- **Product verification using on-chain data hash** - Consumers can verify product authenticity instantly
- **Dynamic UI updates for each supply chain stage** - Visual timeline showing product journey from farm to consumer
- **Real-time stakeholder details** - View complete information about each participant in the supply chain
- **QR code scanning** - Quick product verification via QR codes
- Built with **Hardhat (Solidity)**, **React + TypeScript**, and **Supabase**

---

## 🧠 Why AgriTrace Was Built

In modern agriculture, product authenticity and supply chain transparency are major challenges.  

AgriTrace ensures:

- **Farmers** can prove the origin of produce and establish trust with buyers
- **Distributors** and **retailers** handle verified items with complete traceability
- **Consumers** can trace every product's complete journey from farm to table
- **All data is immutable and verified on-chain** - preventing fraud and ensuring authenticity

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React + TypeScript + Vite |
| Backend | Supabase (PostgreSQL + Auth) |
| Blockchain | Solidity + Hardhat + Ethers.js |
| Network | Ethereum Sepolia Testnet / Localhost |
| Deployment | Vercel / Netlify |
| Version Control | Git + GitHub |

---

## 🧩 Versions Used

| Tool | Version |
|------|----------|
| Node.js | 18.x or higher |
| npm | 9.x or higher |
| Hardhat | ^2.26.3 |
| Solidity | ^0.8.19 |
| React | ^18.3.1 |
| Vite | ^5.4.19 |
| TypeScript | ^5.8.3 |
| Supabase-js | ^2.57.4 |
| Ethers.js | ^6.15.0 |

---

## ⚙️ Local Setup Instructions

### 1️⃣ **Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/AgriTrace.git
cd AgriTrace
```

### 2️⃣ **Install dependencies**

```bash
npm install
```

This will install all required packages including React, Hardhat, Ethers.js, Supabase client, and UI components.

### 3️⃣ **Environment Configuration**

Create a `.env` file in the root directory:

```env
# Supabase Configuration (Optional - app works without it)
VITE_USE_SUPABASE=false
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Network Configuration (Optional - for testnet deployment)
SEPOLIA_RPC_URL=https://rpc.sepolia.org
MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY=your_private_key_for_deployment
```

**Note:** The application works in demo mode without Supabase. For full functionality, set up a Supabase project and add your credentials.

### 4️⃣ **Start Local Blockchain**

Open a new terminal window and run:

```bash
npx hardhat node
```

This starts a local Ethereum node on `http://127.0.0.1:8545` with 20 test accounts pre-funded with 10,000 ETH each. Keep this terminal running.

### 5️⃣ **Deploy Smart Contract**

In another terminal window, run:

```bash
npm run deploy:local
```

This will:
- Compile the Solidity contracts
- Deploy the `SupplyChain.sol` contract to your local network
- Save the contract address to `src/contracts/deployed-contract.json`

You should see output like:
```
SupplyChain deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### 6️⃣ **Configure MetaMask**

1. Open MetaMask browser extension
2. Click the network dropdown (usually shows "Ethereum Mainnet")
3. Select "Add Network" → "Add a network manually"
4. Enter the following details:
   - **Network Name:** Localhost 8545
   - **RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `1337`
   - **Currency Symbol:** `ETH`
   - **Block Explorer URL:** (leave empty)
5. Click "Save"

### 7️⃣ **Import Test Account**

1. In the Hardhat node terminal, you'll see a list of accounts with private keys
2. Copy one of the private keys (starts with `0x`)
3. In MetaMask, click the account icon → "Import Account"
4. Paste the private key and click "Import"
5. You now have a test account with 10,000 ETH!

### 8️⃣ **Start Development Server**

```bash
npm run dev
```

The application will be available at `http://localhost:8080`

---

## 📖 Usage Guide

### For Farmers

1. **Sign Up**: Navigate to the app and create an account with "Farmer" role
2. **Connect Wallet**: Click "Connect Wallet" and select your MetaMask account
3. **Register on Blockchain**: Click "Register" to register as a stakeholder on the blockchain
4. **Register Products**: 
   - Go to "Register Product" tab
   - Fill in product details:
     - Product name (e.g., "Organic Tomatoes")
     - Variety (e.g., "Cherry")
     - Quantity (e.g., 100 kg)
     - Farm location
     - Harvest date
     - Quality grade
   - Click "Register Product on Blockchain"
   - Confirm the transaction in MetaMask
5. **Transfer Products**: When ready, transfer products to distributors using the transfer function

### For Distributors

1. **Sign Up**: Create an account with "Distributor" role
2. **Connect Wallet**: Connect MetaMask and register on blockchain
3. **Receive Products**: Accept product transfers from farmers
4. **Add Details**: Add your distributor details (name, organization) to products
5. **Transfer to Retailers**: Transfer products to retailers when ready

### For Retailers

1. **Sign Up**: Create an account with "Retailer" role
2. **Connect Wallet**: Connect MetaMask and register on blockchain
3. **Receive Products**: Accept product transfers from distributors
4. **Add Details**: Add your retailer details (name, organization) to products
5. **Sell Products**: Mark products as "Sold" when purchased by consumers

### For Consumers

1. **Sign Up**: Create an account with "Consumer" role
2. **Connect Wallet**: Connect MetaMask and register on blockchain (optional for verification)
3. **Verify Products**: 
   - Enter product ID and data hash, OR
   - Scan QR code using the scanner page
   - View complete supply chain timeline
   - See detailed stakeholder information:
     - Name, organization, and location (from signup data)
     - Wallet addresses
     - Registration/transfer dates
     - Status indicators (Completed/Pending)

---

## 📁 Project Structure

```
AgriTrace/
├── contracts/                    # Solidity smart contracts
│   └── SupplyChain.sol          # Main supply chain contract
├── scripts/                      # Deployment scripts
│   ├── deploy.cjs              # Main deployment script
│   └── deploy-local.js         # Local deployment helper
├── src/
│   ├── components/              # React components
│   │   ├── BlockchainDashboard.tsx           # Main dashboard
│   │   ├── BlockchainProductRegistration.tsx  # Product registration
│   │   ├── BlockchainProductSearch.tsx         # Product search
│   │   ├── BlockchainQRScanner.tsx            # QR scanner
│   │   ├── SupplyChainTimeline.tsx             # Visual timeline
│   │   ├── StakeholderDetails.tsx              # Stakeholder info
│   │   ├── MetaMaskAuth.tsx                    # Wallet connection
│   │   ├── Navigation.tsx                      # Top navigation
│   │   └── ui/                  # Shadcn/ui components
│   ├── hooks/                   # Custom React hooks
│   │   ├── useWeb3.tsx         # Web3/blockchain integration
│   │   ├── useAuth.tsx         # Authentication context
│   │   └── useProductIndexer.tsx # Product indexing
│   ├── pages/                   # Page components
│   │   ├── Auth.tsx            # Login/signup page
│   │   ├── Dashboard.tsx       # Main dashboard page
│   │   ├── Index.tsx           # Landing page
│   │   └── Scanner.tsx         # QR scanner page
│   ├── contracts/               # Contract ABIs and addresses
│   │   ├── deployed-contract.json
│   │   └── SupplyChain.json
│   ├── constants/               # Constants and configurations
│   │   └── roles.ts            # Role definitions
│   └── integrations/           # Third-party integrations
│       └── supabase/           # Supabase client and types
├── public/                      # Static assets
│   └── as-symbol.png           # Favicon
├── hardhat.config.cjs          # Hardhat configuration
├── vite.config.ts              # Vite configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

---

## 🛠️ Available Scripts

```bash
# Development
npm run dev              # Start development server (http://localhost:8080)
npm run build            # Build for production
npm run preview          # Preview production build locally

# Smart Contracts
npm run compile          # Compile Solidity contracts
npm run test             # Run Hardhat tests
npm run deploy:local     # Deploy to local Hardhat network
npm run deploy:sepolia   # Deploy to Sepolia testnet
npm run deploy:mumbai    # Deploy to Mumbai testnet (Polygon)

# Code Quality
npm run lint             # Run ESLint
```

---

## 🌐 Network Configuration

### Local Development
- **Chain ID**: 1337
- **RPC URL**: http://127.0.0.1:8545
- **Currency**: ETH
- **Explorer**: N/A (local network)

### Sepolia Testnet
- **Chain ID**: 11155111
- **RPC URL**: https://rpc.sepolia.org
- **Explorer**: https://sepolia.etherscan.io
- **Faucet**: https://sepoliafaucet.com/

### Mumbai Testnet (Polygon)
- **Chain ID**: 80001
- **RPC URL**: https://rpc-mumbai.maticvigil.com
- **Explorer**: https://mumbai.polygonscan.com
- **Faucet**: https://faucet.polygon.technology/

---

## 📜 Smart Contract

The main smart contract (`SupplyChain.sol`) provides:

- **Stakeholder Registration**: Register users with roles (Farmer, Distributor, Retailer, Consumer)
- **Product Registration**: Register products with complete metadata (name, variety, quantity, location, harvest date, quality grade)
- **Product Transfer**: Transfer products between stakeholders with status updates
- **Product Verification**: Verify product authenticity using cryptographic data hash
- **Transaction History**: Track all product movements with timestamps
- **Supply Chain Timeline**: View complete product journey with stakeholder details

### Key Functions

```solidity
// Stakeholder Management
registerStakeholder(role, name, organization)  // Register as stakeholder

// Product Management
registerProduct(name, variety, quantity, farmLocation, harvestDate, qualityGrade, dataHash)
transferProduct(productId, to, status, location, transactionType, additionalData)
getProduct(productId)                          // Get complete product details
isProductAuthentic(productId, dataHash)         // Verify authenticity

// Stakeholder Details
addDistributorDetails(productId, name, org)    // Add distributor info
addRetailerDetails(productId, name, org)        // Add retailer info
```

### Product Status Flow

```
Harvested (0) → AtDistributor (1) → AtRetailer (2) → Sold (3)
```

Each status change is recorded on-chain with timestamps and stakeholder information.

---

## 🚀 Deployment

### Frontend Deployment

#### Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Follow the prompts to link your project

#### Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload the `dist/` folder to Netlify, OR

3. Connect your GitHub repository for automatic deployments

#### Other Platforms

1. Build: `npm run build`
2. Deploy the `dist/` folder to your hosting service (AWS S3, Azure, etc.)

### Smart Contract Deployment

#### To Sepolia Testnet

1. **Get Sepolia ETH**: Visit [Sepolia Faucet](https://sepoliafaucet.com/) and request test ETH

2. **Configure Environment**:
   ```env
   SEPOLIA_RPC_URL=https://rpc.sepolia.org
   PRIVATE_KEY=your_private_key_here
   ```

3. **Deploy**:
   ```bash
   npm run deploy:sepolia
   ```

4. **Update Contract Address**: Copy the deployed address and update `src/contracts/deployed-contract.json`

5. **Verify on Etherscan**: Use Hardhat's verify plugin to verify the contract source code

#### To Mumbai Testnet (Polygon)

1. **Get Mumbai MATIC**: Visit [Polygon Faucet](https://faucet.polygon.technology/)

2. **Configure Environment**:
   ```env
   MUMBAI_RPC_URL=https://rpc-mumbai.maticvigil.com
   PRIVATE_KEY=your_private_key_here
   ```

3. **Deploy**:
   ```bash
   npm run deploy:mumbai
   ```

---

## 🔒 Security Considerations

- **Private Keys**: Never commit private keys to version control. Always use `.env` file (already in `.gitignore`)
- **Environment Variables**: Keep sensitive data in `.env` file and never share it publicly
- **Smart Contract Audits**: Consider professional audits before mainnet deployment
- **Access Control**: Verify role-based permissions in smart contract functions
- **Input Validation**: All user inputs are validated on both frontend and smart contract
- **Gas Optimization**: Contracts use efficient storage patterns to minimize gas costs

---

## 🧪 Testing

### Manual Testing

1. **Local Testing**:
   - Start Hardhat node: `npx hardhat node`
   - Deploy contract: `npm run deploy:local`
   - Run dev server: `npm run dev`
   - Test all user flows (registration, product creation, transfers, verification)

2. **Testnet Testing**:
   - Deploy to Sepolia: `npm run deploy:sepolia`
   - Test with real transactions (costs test ETH)
   - Verify on Etherscan

### Automated Testing

```bash
npm run test
```

Runs Hardhat test suite for smart contract functions.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test thoroughly
4. **Commit your changes**: `git commit -m 'Add some amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Code Style

- Follow TypeScript best practices
- Use ESLint for code quality
- Write clear, self-documenting code
- Add comments for complex logic

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

Developed as part of a blockchain-based agricultural transparency project. Built with React, Hardhat, and Supabase to bring transparency to agricultural supply chains.

Special thanks to:
- **Hardhat** team for the excellent development environment
- **Supabase** for backend infrastructure
- **Shadcn/ui** for beautiful UI components
- **Ethers.js** for Web3 integration

---

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check existing documentation in the `/docs` folder
- Review the smart contract code in `/contracts`

---

**AgriTrace** - Bringing transparency to agricultural supply chains, one block at a time. 🌾

---

*Last updated: 2025*
