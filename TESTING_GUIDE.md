# Blockchain-Only DApp Testing Guide

## Overview
This DApp now uses ONLY blockchain as the single source of truth. No more demo/fake systems - all operations require real blockchain transactions.

## Prerequisites
- MetaMask installed and connected
- Smart contract deployed on your chosen network (localhost/Sepolia/Mumbai)
- Test tokens for gas fees
- Stakeholder registration completed

## What Changed - Summary

### ✅ Removed (No longer exists):
- Old `ProductRegistration` component (database-only)
- Old `Dashboard` component (mixed database/blockchain) 
- All demo/mock contract functionality
- `BlockchainSimulator` component
- All fallback/demo modes

### ✅ Kept & Enhanced:
- `BlockchainProductRegistration` (real MetaMask transactions only)
- `BlockchainProductSearch` (blockchain-first with Supabase indexing)  
- `BlockchainDashboard` (smart contract data only)
- Product indexer (listens for blockchain events)
- Network switching (localhost/Sepolia/Mumbai)

## How It Works Now

1. **Registration**: Always requires MetaMask transaction with gas
2. **Search**: Queries smart contract first, uses indexed data for fast results
3. **Dashboard**: Displays only blockchain data via contract calls
4. **Persistence**: Products persist after reload (stored on blockchain)
5. **No Demo Mode**: If contract not deployed, app shows error instead of fake data

## Testing Scenarios

### 1. Product Registration Test

**Objective**: Verify products are registered on-chain with real gas transactions

**Steps**:
1. Navigate to Dashboard → Register Product tab
2. Fill in product details:
   - Product Name: "Test Organic Tomatoes"
   - Variety: "Cherry"
   - Quantity: 100
   - Farm Location: "California Test Farm"
   - Harvest Date: Today's date
   - Quality Grade: A
3. Click "Register Product on Blockchain"
4. **Verify MetaMask popup appears** requesting gas payment
5. Approve the transaction in MetaMask
6. Wait for transaction confirmation
7. **Expected Result**: 
   - Status shows: Submitting → Confirming → Indexing → Completed
   - Product ID, Block Number, and Transaction Hash displayed
   - Success toast with product ID

### 2. Transaction Confirmation Test

**Objective**: Ensure registration waits for blockchain confirmation

**Steps**:
1. After submitting registration (from Test 1)
2. **Check transaction status indicators**:
   - "Submitting to blockchain..." with spinner
   - "Waiting for confirmation..." with clock icon
   - "Indexing product..." with spinner
   - "Product registered successfully!" with checkmark
3. **Expected Result**: Each stage completes before proceeding to next

### 3. Search by Product ID Test

**Objective**: Verify blockchain-first search functionality

**Steps**:
1. Navigate to Dashboard → Search Products tab
2. Select "Search by ID" button
3. Enter the Product ID from Test 1
4. Click search button
5. **Expected Result**:
   - Product found and displayed with all details
   - Shows blockchain data (not cached/indexed data)
   - "Verify on Chain" button works

### 4. Search by Product Name Test

**Objective**: Test name-based search functionality

**Steps**:
1. In Search Products tab
2. Select "Search by Name" button  
3. Enter "Tomatoes" (or part of your product name)
4. Click search button
5. **Expected Result**:
   - All products containing "Tomatoes" are found
   - Results show blockchain data
   - Performance reasonable (may be slower than ID search)

### 5. Persistence Test (Critical)

**Objective**: Confirm products persist after browser reload

**Steps**:
1. Register a product (Test 1)
2. Note the Product ID
3. **Reload the entire browser page** (F5 or Ctrl+R)
4. Reconnect MetaMask if needed
5. Navigate to Dashboard → My Products tab
6. **Expected Result**: 
   - Registered product appears in "My Products"
   - All product details match original registration
   - Product shows correct blockchain ID

### 6. Cross-Session Verification Test

**Objective**: Verify products persist across browser sessions

**Steps**:
1. Register product and note Product ID
2. **Close browser completely**
3. Reopen browser and navigate to DApp
4. Connect MetaMask
5. Search for product by ID (from step 1)
6. **Expected Result**: Product found with all original data

### 7. On-Chain Verification Test

**Objective**: Confirm product authenticity verification

**Steps**:
1. Find any product via search
2. Click "Verify on Chain" button
3. **Expected Result**:
   - "Verification Successful" toast appears
   - Confirms blockchain data matches displayed data

### 8. Network Explorer Verification

**Objective**: Verify transactions appear on block explorer

**Steps** (for Sepolia/Mumbai only):
1. Register a product
2. Copy the transaction hash from result
3. Go to appropriate explorer:
   - Sepolia: https://sepolia.etherscan.io
   - Mumbai: https://mumbai.polygonscan.com
4. Paste transaction hash in search
5. **Expected Result**: Transaction found with contract interaction

## Troubleshooting

### Registration Issues
- **"Registration Failed"**: Check gas balance, network connection
- **MetaMask not appearing**: Refresh page, check MetaMask is unlocked
- **Transaction stuck**: Check network congestion, increase gas price

### Search Issues  
- **"No products found"**: Verify product was registered on same network
- **"Blockchain not connected"**: Reconnect MetaMask, check network
- **Slow search by name**: Normal behavior, searches multiple IDs

### Persistence Issues
- **Products disappear after reload**: Check network consistency, contract deployment
- **Wrong network**: Ensure same network used for registration and retrieval

## Expected Behaviors

### ✅ Correct Behaviors
- MetaMask popup for every registration (mandatory)
- Real gas fees deducted from wallet
- Products persist permanently after reload
- Search finds registered products from blockchain
- Verification confirms authenticity via smart contract
- Transaction hashes work in block explorers

### ❌ Wrong Behaviors (Should NOT happen anymore)
- Registration without MetaMask popup (removed)
- No gas fees charged (removed) 
- Products disappear after reload (should never happen)
- Demo/fake data (completely removed)

## Error Handling

If smart contract is not deployed on the selected network, the DApp will show clear error messages and refuse to operate instead of falling back to demo mode.

## Success Criteria

The DApp passes testing if:
1. ✅ ALL registrations require MetaMask approval and gas (no exceptions)
2. ✅ Products persist permanently after browser reload/restart  
3. ✅ Search finds products by both ID and name from blockchain
4. ✅ Verification confirms product authenticity via smart contract
5. ✅ Transaction hashes are valid on block explorer
6. ✅ No demo/fake data ever appears
7. ✅ Clear errors shown if contract not deployed