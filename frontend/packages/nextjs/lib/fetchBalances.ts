import { ethers } from "ethers";
import { CONTRACT_ADDRESSES, RPC_URLS } from "../app/config";

export async function fetchBalances(address: string) {
    const providerA = new ethers.JsonRpcProvider(RPC_URLS.chainA);
    const providerB = new ethers.JsonRpcProvider(RPC_URLS.chainB);

    const tokenContractA = new ethers.Contract(
        CONTRACT_ADDRESSES.chainA.token,
        ["function balanceOf(address) view returns (uint256)"],
        providerA
    );

    const tokenContractB = new ethers.Contract(
        CONTRACT_ADDRESSES.chainB.token,
        ["function balanceOf(address) view returns (uint256)"],
        providerB
    );

    try {
        const [balanceA, balanceB] = await Promise.all([
            tokenContractA.balanceOf(address),
            tokenContractB.balanceOf(address),
        ]);

        return {
            balanceA: ethers.formatUnits(balanceA, 18), // Assuming 18 decimals
            balanceB: ethers.formatUnits(balanceB, 18),
        };
    } catch (error) {
        console.error(`Error fetching balances for address: ${address}`, error);
        return {
            balanceA: "0",
            balanceB: "0",
        };
    }
}
