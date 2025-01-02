# OpenServ Agent Examples

A collection of autonomous AI agents built with the @openserv-labs/sdk framework. Each agent demonstrates different capabilities and use cases.

## Available Agents

### [DexScreener Analytics](src/dexscreener-analytics)

An agent that provides real-time token analytics using DexScreener's API. Filter and analyze tokens by various criteria like volume, market cap, liquidity, and age.

Example query:

```
"Show me tokens with >$1M 24h volume and market cap between $1M-$25M created in the last 30 days"
```

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/openserv-labs/agent-examples.git
cd agent-examples
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env and add your API keys
```

4. Run the agents:

```bash
npm start
```

## Project Structure

```
/
├── src/
│   ├── index.ts                    # Main entry point
│   └── dexscreener-analytics/      # DexScreener agent
│       ├── index.ts                # Agent implementation
│       └── README.md               # Agent documentation
├── .env.example                    # Example environment file
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
