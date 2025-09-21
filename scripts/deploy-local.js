const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying SupplyChain contract to local network...");

  // Get the contract factory
  const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");

  // Deploy the contract
  console.log("📦 Deploying contract...");
  const supplyChain = await SupplyChain.deploy();

  // Wait for deployment to finish
  await supplyChain.waitForDeployment();

  const contractAddress = await supplyChain.getAddress();
  
  console.log("✅ SupplyChain contract deployed successfully!");
  console.log("📍 Contract address:", contractAddress);
  console.log("🌐 Network:", hre.network.name);
  console.log("⛽ Gas used: Check transaction receipt");

  // Update the contract address in the frontend
  console.log("\n🔧 Next steps:");
  console.log("1. Copy the contract address above");
  console.log("2. Update CONTRACT_ADDRESSES.localhost in src/hooks/useWeb3.tsx");
  console.log("3. Restart your frontend development server");
  console.log("4. Connect MetaMask to localhost:8545");
  
  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deployer: (await hre.ethers.getSigners())[0].address,
    timestamp: new Date().toISOString(),
    chainId: hre.network.config.chainId
  };
  
  console.log("\n📋 Deployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  return contractAddress;
}

main()
  .then((contractAddress) => {
    console.log(`\n🎉 Deployment complete! Contract address: ${contractAddress}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });