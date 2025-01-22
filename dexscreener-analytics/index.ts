import 'dotenv/config'

import { Agent } from '@openserv-labs/sdk'
import { z } from 'zod'
import axios from 'axios'

interface BoostedToken {
  url: string
  chainId: string
  tokenAddress: string
  amount: number
  totalAmount: number
  description?: string
}

interface TokenPair {
  chainId: string
  dexId: string
  url: string
  baseToken: {
    name: string
    symbol: string
  }
  priceUsd?: string
  liquidity: {
    usd: number
  }
  volume: {
    h24: number
  }
  priceChange: {
    h24: number
  }
  marketCap?: number
  pairCreatedAt: number
  info?: {
    websites?: Array<{ url: string }>
    socials?: Array<{
      platform: string
      url: string
    }>
  }
}

const dexScreenerAnalyticsAgent = new Agent({
  systemPrompt: 'You are a helpful assistant that provides up to date information about tokens.'
})

dexScreenerAnalyticsAgent.addCapability({
  name: 'filterTokens',
  description: 'Filter tokens by specific criteria',
  schema: z.object({
    chain: z.string().optional().describe('Filter tokens by blockchain (e.g., "solana", "ethereum", "bsc")'),
    minVolume24h: z.number().optional().describe('Minimum 24-hour trading volume in USD'),
    minLiquidity: z.number().optional().describe('Minimum liquidity in USD'),
    minMarketCap: z.number().optional().describe('Minimum market capitalization in USD'),
    maxMarketCap: z.number().optional().describe('Maximum market capitalization in USD'),
    maxAgeDays: z.number().optional().describe('Maximum age of the token pair in days')
  }),
  async run({ args }) {
    try {
      // Get the top boosted tokens
      const response = await axios.get('https://api.dexscreener.com/token-boosts/top/v1')
      const boostedTokens = response.data as BoostedToken[]

      // Filter by chain if specified
      const filteredBoostedTokens =
        (args.chain ?? '').trim() !== ''
          ? boostedTokens.filter(token => token.chainId.toLowerCase() === args.chain!.toLowerCase())
          : boostedTokens

      // Get detailed information for each boosted token
      const detailedTokens = await Promise.all(
        filteredBoostedTokens.map(async token => {
          try {
            const pairResponse = await axios.get(`https://api.dexscreener.com/latest/dex/tokens/${token.tokenAddress}`)
            const pair = pairResponse.data.pairs?.[0] as TokenPair
            if (!pair) return null

            const now = Date.now()
            const maxAgeMs = args.maxAgeDays ? args.maxAgeDays * 24 * 60 * 60 * 1000 : Number.POSITIVE_INFINITY

            const meetsVolume = !args.minVolume24h || (pair.volume?.h24 && pair.volume.h24 >= args.minVolume24h)
            const meetsLiquidity =
              !args.minLiquidity || (pair.liquidity?.usd && pair.liquidity.usd >= args.minLiquidity)
            const meetsMinMcap = !args.minMarketCap || (pair.marketCap && pair.marketCap >= args.minMarketCap)
            const meetsMaxMcap = !args.maxMarketCap || (pair.marketCap && pair.marketCap <= args.maxMarketCap)
            const meetsAge = !args.maxAgeDays || (pair.pairCreatedAt && now - pair.pairCreatedAt <= maxAgeMs)

            if (meetsVolume && meetsLiquidity && meetsMinMcap && meetsMaxMcap && meetsAge) {
              const details = {
                name: pair.baseToken.name,
                symbol: pair.baseToken.symbol,
                chain: pair.chainId,
                dex: pair.dexId,
                liquidity: pair.liquidity?.usd ? `$${pair.liquidity.usd.toLocaleString()}` : 'N/A',
                price: pair.priceUsd ? `$${Number.parseFloat(pair.priceUsd).toFixed(6)}` : 'N/A',
                marketCap: pair.marketCap ? `$${pair.marketCap.toLocaleString()}` : 'N/A',
                volume24h: pair.volume?.h24 ? `$${pair.volume.h24.toLocaleString()}` : 'N/A',
                priceChange24h: pair.priceChange?.h24 ? `${pair.priceChange.h24.toFixed(2)}%` : 'N/A',
                age: pair.pairCreatedAt
                  ? `${Math.floor((now - pair.pairCreatedAt) / (24 * 60 * 60 * 1000))} days`
                  : 'N/A',
                website: pair.info?.websites?.[0]?.url || 'N/A',
                twitter: pair.info?.socials?.find(social => social.platform === 'twitter')?.url || 'N/A',
                dexScreenerUrl: pair.url
              }
              return details
            }
            return null
          } catch (error) {
            console.error(`Error fetching details for token ${token.tokenAddress}:`, error)
            return null
          }
        })
      )

      const validTokens = detailedTokens.filter(token => token !== null)

      return JSON.stringify(validTokens, null, 2)
    } catch (error) {
      console.error('Error filtering tokens:', error)
      return 'Error filtering tokens. Please try again later.'
    }
  }
})

dexScreenerAnalyticsAgent
  .process({
    messages: [
      {
        role: 'user',
        content:
          // 'Provide a list of tokens that have >$1m 24hr volume, have market cap between 1 and 25 million and are <30 days old'
          'Find tokens with >$10M market cap and positive 24h price change'
      }
    ]
  })
  .then(response => {
    console.log(response.choices[0].message.content)
  })

