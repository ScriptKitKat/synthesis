const { ethers } = require("ethers");

const RPC_URL = "https://public.sepolia.rpc.status.network";
const PRIVATE_KEY = process.env.STATUS_PRIVATE_KEY; // same testnet key
const CONTRACT = "0x7de86Ef7A78C4128a964c0defC39D05d740306f2";

const ABI = [
  "function logReport(string memory topic, string memory briefingHash, uint256 spentUsd) public",
  "function getReportCount() public view returns (uint256)"
];

async function main() {
  const topic = process.argv[2];
  const hash = process.argv[3];
  const spent = parseInt(process.argv[4]);

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT, ABI, wallet);

  console.log("Logging report on-chain...");
  const tx = await contract.logReport(topic, hash, spent, {
    maxFeePerGas: 0,
    maxPriorityFeePerGas: 0,
    gasLimit: 200000,
    type: 2
  });

  const receipt = await tx.wait();
  console.log("TX hash:", receipt.hash);
  console.log("Status:", receipt.status === 1 ? "SUCCESS" : "FAILED");

  const count = await contract.getReportCount();
  console.log("Total reports on-chain:", count.toString());
}

main().catch(e => console.error("Error:", e.message));
