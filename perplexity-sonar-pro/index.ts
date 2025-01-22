import { z } from 'zod'
import { Agent } from '@openserv-labs/sdk'
import 'dotenv/config'
import { PerplexityClient } from './client'

if (!process.env.PERPLEXITY_API_KEY) {
  throw new Error('PERPLEXITY_API_KEY environment variable is required')
}

const perplexityClient = new PerplexityClient(process.env.PERPLEXITY_API_KEY)

// Create the agent
const agent = new Agent({
  systemPrompt: 'You are an agent that searches for information using Perplexity Sonar Pro API',
})

// Add search capability
agent.addCapability({
  name: 'search',
  description: 'Search for information using Perplexity Sonar Pro API',
  schema: z.object({
    query: z.string()
  }),
  async run({ args }) {
    const result = await perplexityClient.search(args.query)
    const citations = result.citations || []
    let content = result.choices[0].message.content

    if (citations.length > 0) {
      content += `\n\Citations:\n${citations.map((url, index) => `[${index + 1}] ${url}`).join('\n')}`
    }

    return content
  }
})

// Start the agent's HTTP server
agent.start().catch(error => {
  console.error('Error starting agent:', error)
})
