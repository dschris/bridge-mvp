"use client";

import { useState, useEffect } from "react";
import { ALIASES } from "../app/config";
import { fetchBalances } from "../lib/fetchBalances";

const BalancesTable = ({ holders }: { holders: string[] }) => {
    const [balances, setBalances] = useState<Record<string, any>>({});

    useEffect(() => {
        const loadBalances = async () => {
            const results: Record<string, any> = {};
            for (const holder of holders) {
                results[holder] = await fetchBalances(holder);
            }
            setBalances(results);
        };
        loadBalances();
    }, [holders]);

    return (
        <table className="table-auto w-full text-center mt-6 border-collapse border border-gray-500">
            <thead>
                <tr>
                    <th className="border border-gray-500 px-4 py-2">Alias</th>
                    <th className="border border-gray-500 px-4 py-2">Address</th>
                    <th className="border border-gray-500 px-4 py-2">Chain A Balance</th>
                    <th className="border border-gray-500 px-4 py-2">Chain B Balance</th>
                    <th className="border border-gray-500 px-4 py-2">Total Balance</th>
                </tr>
            </thead>
            <tbody>
                {holders.map((holder) => (
                    <tr key={holder}>
                        <td className="border border-gray-500 px-4 py-2">
                            {ALIASES[holder] || "Unknown"}
                        </td>
                        <td className="border border-gray-500 px-4 py-2">{holder}</td>
                        <td className="border border-gray-500 px-4 py-2">
                            {balances[holder]?.balanceA || "Loading..."}
                        </td>
                        <td className="border border-gray-500 px-4 py-2">
                            {balances[holder]?.balanceB || "Loading..."}
                        </td>
                        <td className="border border-gray-500 px-4 py-2">
                            {balances[holder]
                                ? (
                                    parseFloat(balances[holder].balanceA) +
                                    parseFloat(balances[holder].balanceB)
                                ).toFixed(4)
                                : "Loading..."}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default BalancesTable;
