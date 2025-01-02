import 'dotenv/config'

import dexScreenerAnalyticsAgent from './dexscreener-analytics'

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
