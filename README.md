Cross-Chain Bridge for Tokens

This project implements a Burn & Mint style cross-chain bridge for tokenized assets. The bridge operates across two EVM-compatible blockchains (running on Anvil testnets) and uses Kafka for backend message processing to coordinate token burns and mints across chains.

Project Features

    * Burn & Mint Workflow: Tokens are burned on Chain A and minted on Chain B.
    * Kafka Backend:
        * Producer: Publishes TokenBurned events from Chain A.
        * Consumer: Consumes events and triggers mint operations on Chain B.
    * Cross-Chain Synchronization: Ensures token balances are synchronized between chains.

Prerequisites

    Node.js: Ensure you have Node.js 16+ installed.

    Foundry: Install Foundry for interacting with the contracts.

    `curl -L https://foundry.paradigm.xyz | bash`
    `foundryup`

    Docker: Install Docker to run Kafka and Zookeeper.

    Cast CLI: A command-line tool for Ethereum JSON-RPC interactions.

    `foundryup install cast`

Setup
1. Clone the Repository

`git clone <repository-url>`
`cd <repository-name>`

2. Install Dependencies

Install Node.js dependencies for the Kafka backend:

`npm install`

Install OpenZeppelin contracts for Foundry:

`forge install OpenZeppelin/openzeppelin-contracts`

How to Run
1. Start Anvil Testnets

Run two separate instances of Anvil for Chain A and Chain B:

    Chain A:

`anvil --port 8545` (--port is optional, default is 8545)

    Chain B:

`anvil --port 8546`

2. Deploy Contracts
Deploy Token Contracts:

For each chain, deploy the token contracts:

`forge script script/DeployToken.s.sol:DeployToken --rpc-url http://127.0.0.1:8545 --private-key <PRIVATE_KEY> --broadcast`
`forge script script/DeployToken.s.sol:DeployToken --rpc-url http://127.0.0.1:8546 --private-key <PRIVATE_KEY> --broadcast`

Deploy Bridge Contracts:

Deploy bridge contracts on each chain and set ownership to the Bridge contract:

`forge script script/DeployBridge.s.sol:DeployBridge --rpc-url http://127.0.0.1:8545 --private-key <PRIVATE_KEY> --broadcast`
`forge script script/DeployBridge.s.sol:DeployBridge --rpc-url http://127.0.0.1:8546 --private-key <PRIVATE_KEY> --broadcast`

3. Spin Up Kafka and Zookeeper

Start Kafka and Zookeeper with Docker Compose:

`docker-compose up -d`

Create Kafka topics:

`docker exec -it nttp-mvp-kafka-1 kafka-topics --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic token-burned`
`docker exec -it nttp-mvp-kafka-1 kafka-topics --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic token-mint`

Verify topics:

`docker exec -it nttp-mvp-kafka-1 kafka-topics --list --bootstrap-server localhost:9092`

You should see the following topics:

    * token-burned
    * token-mint

Running the Bridge Backend
Start Kafka Producer

The producer listens for TokenBurned events on Chain A and publishes them to Kafka:

`node backend/producer.mjs`

Start Kafka Consumer

The consumer listens for TokenBurned events on Kafka and triggers the mint function on Chain B:

`node backend/consumer.mjs`

Testing the Bridge
1. Get Tokens

Mint tokens on Chain A for testing:

`cast send <TokenAddressOnChainA> "mint(address,uint256)" <YourWalletAddress> 1000000000000000000 --rpc-url http://127.0.0.1:8545 --private-key <PRIVATE_KEY>`

Verify your balance:

`cast call <TokenAddressOnChainA> "balanceOf(address)" <YourWalletAddress> --rpc-url http://127.0.0.1:8545`

2. Burn Tokens

Burn tokens on Chain A to trigger the bridge workflow:

`cast send <BridgeAddressOnChainA> "burn(uint256,string)" 1000000000000000000 "ChainB" --rpc-url http://127.0.0.1:8545 --private-key <PRIVATE_KEY>`

3. Mint Tokens

The consumer automatically mints tokens on Chain B. Verify your balance on Chain B:

`cast call <TokenAddressOnChainB> "balanceOf(address)" <YourWalletAddress> --rpc-url http://127.0.0.1:8546`