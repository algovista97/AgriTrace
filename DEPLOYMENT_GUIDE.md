# Blockchain Deployment Guide

## Quick Start (Demo Mode)

The application is currently running in **Demo Mode** with simulated blockchain transactions. This allows you to test all features without deploying to a real blockchain.

### Testing the Demo:

1. **Connect MetaMask**: Click "Connect Wallet" on the dashboard
2. **Register as Stakeholder**: 
   - Choose role (Farmer/Distributor/Retailer/Consumer)
   - Fill in name and organization
   - Click "Register" - transaction will simulate in 2 seconds
3. **Register Products** (Farmers only):
   - Fill in product details
   - Click "Register Product on Blockchain"
   - Product will get a simulated blockchain ID
4. **Scan QR Codes**: Use the scanner to verify products

## Real Blockchain Deployment (Optional)

To deploy on Sepolia testnet for real blockchain functionality:

### Prerequisites:
- MetaMask wallet with Sepolia ETH
- Get Sepolia ETH from faucet: https://sepoliafaucet.com/

### Steps:

1. **Get Sepolia Test ETH**:
   ```
   Visit: https://sepoliafaucet.com/
   Enter your MetaMask address
   Request test ETH
   ```

2. **Set up Private Key** (for deployment):
   ```bash
   # Create .env file in project root
   PRIVATE_KEY=your_private_key_here
   ```

3. **Deploy Contract**:
   ```bash
   npx hardhat run scripts/deploy.js --network sepolia
   ```

4. **Update Contract Address**:
   - Copy the deployed contract address from console
   - Update `CONTRACT_ADDRESSES.sepolia` in `src/hooks/useWeb3.tsx`

5. **Test Real Blockchain**:
   - Refresh the app
   - Connect MetaMask to Sepolia
   - All transactions will now be real and cost gas!

## Current Demo Features Working:

✅ **MetaMask Connection**: Connect/disconnect wallet  
✅ **Stakeholder Registration**: Register with different roles  
✅ **Product Registration**: Add products with blockchain simulation  
✅ **QR Code Generation**: Each product gets a unique QR code  
✅ **Role-based Access**: Different features for each stakeholder type  
✅ **Transaction Simulation**: 2-second simulated blockchain transactions  
✅ **Data Storage**: Uses Supabase for UI data, simulates blockchain data  

## Testing Path:

1. Go to `/dashboard`
2. Click "Connect Wallet" 
3. Select account in MetaMask
4. Choose "Farmer" role
5. Enter name: "Test Farm"
6. Enter organization: "Demo Farms Inc"
7. Click "Register" - should succeed in ~2 seconds
8. Navigate to product registration
9. Fill in product details
10. Click "Register Product" - should get product ID
11. Test QR scanner with generated QR codes

The app works fully in demo mode - all blockchain functionality is simulated!