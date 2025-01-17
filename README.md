# OpenServ Agent Examples

A collection of autonomous AI agents built with the @openserv-labs/sdk framework. Each agent demonstrates different capabilities and use cases.

## Available Agents

### [DexScreener Analytics](src/dexscreener-analytics)

An agent that provides real-time token analytics using DexScreener's API. Filter and analyze tokens by various criteria like volume, market cap, liquidity, and age.

Example query:

```
"Show me tokens with >$1M 24h volume and market cap between $1M-$25M created in the last 30 days"
```

### [GOAT Wallet](src/goat-agent)

A wallet agent that can interact with the blockchain and perform transactions.

Example queries:

```
"How much ETH do I have in my wallet?"
"Send 0.1 ETH to the address 0x1234567890"
```

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/openserv-labs/agent-examples.git
cd agent-examples
```

2. Navigate to the agent directory you want to try:

```bash
cd src/dexscreener-analytics
```

3. Install dependencies:

```bash
npm install
```

4. Set up environment variables:

```bash
cp .env.example .env
# Edit .env and add your API keys
```

4. Run the agents:

```bash
npm run dev
```

## Project Structure

```
/
├── src/
│   ├── dexscreener-analytics/      # DexScreener analytics agent
│   │   ├── index.ts                # Agent implementation
│   │   ├── package.json            # Agent dependencies
│   │   └── tsconfig.json           # TypeScript config
│   │   └── .env.example            # Example environment file
│   └── goat-agent/                 # GOAT wallet agent
│       ├── index.ts                # Agent implementation
│       ├── package.json            # Agent dependencies
│       └── tsconfig.json           # TypeScript config
│       └── .env.example            # Example environment file
└── README.md                       # Main documentation
```

## Contributing

We welcome contributions! If you'd like to add a new agent example:

1. Create a new directory under `src/` with a descriptive name
2. Include a comprehensive README.md in your agent's directory
3. Follow the existing code structure and documentation patterns
4. Submit a pull request with your changes

## License

[MIT](https://choosealicense.com/licenses/mit/)
