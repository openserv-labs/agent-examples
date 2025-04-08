# Twitter Marketing Agent

An AI marketing manager with capabilities to post tweets through the OpenServ Twitter integration. This agent can craft and send marketing tweets based on your business objectives.

## Features

- Post marketing tweets directly to Twitter
- Get current Twitter account information
- AI-driven marketing expertise
- Professional yet approachable tone

## Example Interactions

```
"Draft a tweet about our new product launch"
"Create an engaging tweet about our upcoming webinar"
"Post a tweet about our holiday promotion"
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

3. Add your API keys to the .env file:
```
OPENSERV_API_KEY=your_openserv_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

4. Run the agent:
```bash
npm run dev
```

## Twitter Integration

This agent requires Twitter API integration to be set up in your OpenServ workspace. The integration ID used is 'twitter-v2'.

## Capabilities

The agent provides two main capabilities:
- **getTwitterAccount**: Retrieves the current Twitter username
- **sendMarketingTweet**: Posts a marketing tweet with the provided text

## Marketing Expertise

The agent is designed to follow marketing best practices, including:
- Crafting engaging and persuasive copy
- Maintaining brand voice and values
- Data-driven approach to marketing content
- Strategic alignment with business goals 