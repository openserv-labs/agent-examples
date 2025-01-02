# DexScreener Token Analytics Agent

An autonomous AI agent that provides real-time token analytics using DexScreener's API.

## Features

- Filter tokens by various criteria:
  - Trading volume
  - Market capitalization
  - Liquidity
  - Token age
  - Blockchain (Solana, Ethereum, BSC, etc.)
- Real-time data from DexScreener
- Formatted output with key metrics
- Natural language interface

## Capabilities

### filterTokens

Filter tokens based on specific criteria:

- `chain` - Filter tokens by blockchain (e.g., "solana", "ethereum", "bsc")
- `minVolume24h` - Minimum 24-hour trading volume in USD
- `minLiquidity` - Minimum liquidity in USD
- `minMarketCap` - Minimum market capitalization in USD
- `maxMarketCap` - Maximum market capitalization in USD
- `maxAgeDays` - Maximum age of the token pair in days

## Example Queries

```
"Show me tokens with >$1M 24h volume and market cap between $1M-$25M"
"List tokens on Solana with >$2000 liquidity created in the last 30 days"
"Find tokens with >$10M market cap and positive 24h price change"
```

## API Reference

The agent uses DexScreener's API endpoints:

- `/token-boosts/top/v1`: Get top boosted tokens
- `/latest/dex/tokens/{address}`: Get detailed token information

## Output Format

For each token that matches the criteria, the agent returns:

```json
{
  "name": "Token Name",
  "symbol": "TKN",
  "chain": "blockchain",
  "dex": "exchange",
  "price": "$0.123456",
  "marketCap": "$1,234,567",
  "volume24h": "$123,456",
  "priceChange24h": "12.34%",
  "age": "7 days",
  "website": "https://token-website.com",
  "twitter": "https://twitter.com/token",
  "dexScreenerUrl": "https://dexscreener.com/..."
}
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
