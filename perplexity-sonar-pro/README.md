# Perplexity Sonar Pro Agent

An AI agent that leverages Perplexity's API to perform web search with source citations. This agent can search the web and provide detailed insights with referenced sources.

## Features

- Web search with Perplexity Sonar Pro API
- Source citations for search results
- Simple query interface

## Example Queries

```
"What are the latest developments in AI?"
"Tell me about renewable energy technologies"
"Explain quantum computing basics"
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables:
```bash
cp .env.example .env
```

3. Run the agent:
```bash
npm run dev
```

## Environment Variables

```env
OPENSERV_API_KEY=your_openserv_api_key_here
PERPLEXITY_API_KEY=your_perplexity_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

## Usage

The agent provides a simple search capability that returns detailed responses with source citations. Each search result includes:
- Comprehensive answer to your query
- Citations with links to source materials

## API Reference

This agent uses the Perplexity Sonar Pro API. For more details about the API, visit the [Perplexity documentation](https://docs.perplexity.ai/api-reference).