import { ethers } from "ethers";
import { RPC_URLS, CONTRACT_ADDRESSES } from "../app/config";

export async function getHolders(chain: "chainA" | "chainB"): Promise<string[]> {
    const provider = new ethers.JsonRpcProvider(RPC_URLS[chain]);
    const tokenContract = new ethers.Contract(
        CONTRACT_ADDRESSES[chain].token,
        ["event Transfer(address indexed from, address indexed to, uint256 value)"],
        provider
    );

    // Query past Transfer events
    const events = await tokenContract.queryFilter("Transfer", 0, "latest");
    const holders = new Set<string>();

    events.forEach((event) => {
        const eventLog = event as ethers.EventLog;
        if (eventLog.args?.to !== ethers.ZeroAddress) {
            holders.add(eventLog.args.to);
        }
    });

    return Array.from(holders); // Return as an array
}
