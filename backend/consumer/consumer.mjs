import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import { ethers } from 'ethers';
import kafka from 'kafka-node';

// Kafka setup
const client = new kafka.KafkaClient({ kafkaHost: process.env.KAFKA_BROKER });
const consumer = new kafka.Consumer(
    client,
    [{ topic: 'token-burned', partition: 0 }],
    { autoCommit: true }
);

// Ethers.js setup for Chain B
const providerB = new ethers.JsonRpcProvider(process.env.ANVIL_B_RPC_URL);
const walletB = new ethers.Wallet(process.env.ANVIL_PRIVATE_KEY, providerB);
const bridgeContractB = new ethers.Contract(
    process.env.ANVIL_BRIDGE_CA,
    ['function mint(address to, uint256 amount, string memory sourceChain) external'],
    walletB
);

// Listen for messages on `token-burned`
consumer.on('message', async (message) => {
    const { from, amount, targetChain } = JSON.parse(message.value);
    console.log(`Processing TokenBurned for ${amount} tokens from ${from}`);

    try {
        const tx = await bridgeContractB.mint(from, amount, targetChain);
        console.log('Mint transaction sent:', tx.hash);

        await tx.wait();
        console.log('Mint transaction confirmed:', tx.hash);
    } catch (error) {
        console.error('Error minting tokens:', error);
    }
});

consumer.on('error', (err) => {
    console.error('Consumer error:', err);
});
