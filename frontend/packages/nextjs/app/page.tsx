"use client";

import { CONTRACT_ADDRESSES } from "./config";
import { useAccount } from "wagmi";
import { Address } from "~~/components/scaffold-eth";
import { useState, useEffect } from "react";
import BalancesTable from "../components/BalancesTable";
import Bridge from "../components/Bridge";
import { getHolders } from "../lib/getHolders";
const Home = () => {
  const [holders, setHolders] = useState<string[]>([]);

  useEffect(() => {
    const fetchHolders = async () => {
      const chainAHolders = await getHolders("chainA");
      const chainBHolders = await getHolders("chainB");

      // Merge holders from both chains (remove duplicates)
      const uniqueHolders = Array.from(new Set([...chainAHolders, ...chainBHolders]));
      setHolders(uniqueHolders);
    };

    fetchHolders();
  }, []);

  return (
    <div className="flex flex-col items-center p-10">
      <h1 className="text-4xl font-bold mb-4">Token Transfer Protocol Bridge</h1>
      <p className="mb-6 text-lg">Manage your token balances across two chains</p>

      <div className="bg-base-300 p-6 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Contract Addresses</h2>
        <ul>
          <li>
            <strong>Chain A Token:</strong> {CONTRACT_ADDRESSES.chainA.token}
          </li>
          <li>
            <strong>Chain B Token:</strong> {CONTRACT_ADDRESSES.chainB.token}
          </li>
        </ul>
      </div>

      <div className="mt-10 w-full max-w-4xl mx-auto">
        <Bridge />
      </div>

      <div className="mt-10 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-4">Balances</h2>
        <BalancesTable holders={holders} />
      </div>

    </div>
  );
};

export default Home;
