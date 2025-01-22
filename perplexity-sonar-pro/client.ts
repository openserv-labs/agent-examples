import axios from 'axios'

interface ChatCompletionResponse {
  id: string
  model: string
  object: string
  created: number
  citations: string[]
  choices: {
    index: number
    finish_reason: string
    message: {
      role: string
      content: string
    }
    delta: {
      role: string
      content: string
    }
  }[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export class PerplexityClient {
  private apiKey: string
  private baseURL = 'https://api.perplexity.ai'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async search(query: string): Promise<ChatCompletionResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: 'sonar-pro',
          messages: [
            {
              role: 'system',
              content: 'Be precise and concise.'
            },
            {
              role: 'user',
              content: query
            }
          ],
          temperature: 0.2,
          top_p: 0.9,
          return_citations: true,
          return_related_questions: false,
          search_recency_filter: 'month'
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Perplexity API error: ${error.response?.data?.message || error.message}`)
      }
      throw error
    }
  }
}
