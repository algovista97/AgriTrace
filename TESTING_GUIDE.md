# DApp Testing Guide: Blockchain-First Product Registration & Search

## Overview
This guide walks you through testing the blockchain-first functionality of the DApp, ensuring products are stored on-chain and persist after reload.

## Pre-requisites
- MetaMask installed and connected
- Test network configured (Sepolia, Mumbai, or Local)
- Test ETH/MATIC for gas fees
- Stakeholder registration completed

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
- MetaMask popup for every registration
- Real gas fees deducted
- Products persist after reload
- Search finds registered products  
- Verification confirms authenticity
- Transaction hashes work in explorers

### ❌ Wrong Behaviors (Report if observed)
- Registration without MetaMask popup
- No gas fees charged
- Products disappear after reload
- Search only finds cached data
- Verification always fails
- Fake transaction hashes

## Demo Mode Fallback

If blockchain connection fails, the app enters demo mode:
- Registration simulates transactions (no real gas)
- Search uses mock data
- Products don't persist
- This is expected behavior for testing without proper network setup

## Success Criteria

The DApp passes testing if:
1. ✅ All registrations require MetaMask approval and gas
2. ✅ Products persist after browser reload/restart
3. ✅ Search finds products by both ID and name
4. ✅ Verification confirms product authenticity
5. ✅ Transaction hashes are valid on block explorer
6. ✅ No products are lost or corrupted