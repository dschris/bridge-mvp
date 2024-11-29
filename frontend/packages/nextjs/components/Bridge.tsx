"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { RPC_URLS, CONTRACT_ADDRESSES } from "../app/config";

const Bridge = () => {
    const [amount, setAmount] = useState<string>("");

    const handleBurn = async () => {
        const provider = new ethers.JsonRpcProvider(RPC_URLS.chainA);
        const signer = await provider.getSigner();
        const bridgeContract = new ethers.Contract(
            CONTRACT_ADDRESSES.chainA.bridge,
            ["function burn(uint256, string)"],
            signer
        );

        try {
            const tx = await bridgeContract.burn(
                ethers.parseUnits(amount, 18),
                "ChainB"
            );
            await tx.wait();
            alert("Burn successful!");
        } catch (error) {
            console.error("Burn transaction failed:", error);
            alert("Burn transaction failed.");
        }
    };

    return (
        <div className="mt-6 flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-4">Bridge Tokens</h2>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input input-bordered w-full max-w-xs"
                placeholder="Enter amount to bridge"
            />
            <button onClick={handleBurn} className="btn btn-primary mt-4">
                Burn Tokens
            </button>
        </div>
    );
};

export default Bridge;
