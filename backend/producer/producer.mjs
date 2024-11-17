import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import { ethers } from 'ethers';
import kafka from 'kafka-node';

// Kafka setup
const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BROKER });
const producer = new kafka.Producer(client);

// Ethers.js setup for Chain A
const providerA = new ethers.JsonRpcProvider(process.env.ANVIL_A_RPC_URL);

console.log('Connecting to RPC URL:', process.env.ANVIL_A_RPC_URL);

const bridgeContractA = new ethers.Contract(
    process.env.ANVIL_BRIDGE_CA,
    ['event TokenBurned(address indexed from, uint256 amount, string targetChain)'],
    providerA
);

console.log('Listening for TokenBurned events...');

bridgeContractA.on('TokenBurned', async (from, amount, targetChain, event) => {
    console.log(`TokenBurned: ${amount.toString()} tokens from ${from} targeting ${targetChain}`);

    // Publish to Kafka
    const payloads = [
        {
            topic: 'token-burned',
            messages: JSON.stringify({ from, amount: amount.toString(), targetChain }),
        },
    ];

    producer.send(payloads, (err, data) => {
        if (err) console.error('Error publishing to Kafka:', err);
        else console.log('Published to Kafka:', data);
    });
});

producer.on('error', (err) => {
    console.error('Producer error:', err);
});
