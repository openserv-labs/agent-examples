# Goat Agent Example

This example demonstrates how to create an AI agent that can interact with blockchain using the OpenServ SDK. The agent is capable of performing various blockchain operations like checking balances, sending transactions, and interacting with tokens.

## Features

- Get account balances (ETH and tokens)
- Send transactions
- Interact with ERC20 tokens (including USDC and SERV tokens)
- Automated blockchain operations through AI

## Prerequisites

- Node.js installed
- An Ethereum wallet private key
- RPC provider URL (e.g., Infura, Alchemy)
- OpenAI API key
- OpenServ API key

## Running the Agent

Start the agent in development mode:
```bash
npm run dev
```

The agent will start and be ready to handle blockchain interactions through natural language commands based on the system prompt defined in `system.md`.

## Configuration

- The agent's behavior is defined in `system.md`
- Token configurations, blockchain interactions and capabilities are set up in `index.ts`
- The agent uses the Viem wallet client for Ethereum interactions
- Supported tokens include USDC and SERV (OpenServ token)
