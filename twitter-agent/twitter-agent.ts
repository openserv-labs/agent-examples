import dotenv from 'dotenv'
dotenv.config()

import { Agent } from '@openserv-labs/sdk'
import fs from 'node:fs'
import path from 'node:path'
import { z } from 'zod'

// if (!process.env.OPENAI_API_KEY) {
//   throw new Error('OPENAI_API_KEY environment variable is required')
// }

const marketingManager = new Agent({
  systemPrompt: fs.readFileSync(path.join(__dirname, './system.md'), 'utf8'),
  apiKey: process.env.OPENSERV_API_KEY,
//   openaiApiKey: process.env.OPENAI_API_KEY
})

marketingManager
  .addCapabilities([
    {
      name: 'getTwitterAccount',
      description: 'Gets the Twitter account for the current user',
      schema: z.object({}),
      async run({ action }) {
        console.log('getTwitterAccount capability called');
        try {
          const details = await this.callIntegration({
            workspaceId: action!.workspace.id,
            integrationId: 'twitter-v2',
            details: {
              endpoint: '/2/users/me',
              method: 'GET'
            }
          })
          return details.output.data.username
        } catch (error) {
          console.error('Error getting Twitter account:', error);
          return 'Error: Unable to access Twitter account. Please check your Twitter integration permissions.';
        }
      }
    },
    {
      name: 'checkTwitterPermissions',
      description: 'Checks if the Twitter integration has the necessary permissions',
      schema: z.object({}),
      async run({ action }) {
        console.log('checkTwitterPermissions capability called');
        try {
          // Try to get account info as a permission check
          const details = await this.callIntegration({
            workspaceId: action!.workspace.id,
            integrationId: 'twitter-v2',
            details: {
              endpoint: '/2/users/me',
              method: 'GET'
            }
          });
          
          return JSON.stringify({
            status: 'success',
            message: 'Twitter integration is properly configured with necessary permissions.',
            username: details.output.data.username
          });
        } catch (error: any) {
          console.error('Twitter permission check failed:', error);
          return JSON.stringify({
            status: 'error',
            message: 'Twitter integration is missing required permissions. Please check your OpenServ Twitter integration settings.',
            error: error.message || 'Unknown error'
          });
        }
      }
    },
    {
      name: 'sendMarketingTweet',
      description: 'Sends a marketing tweet to Twitter',
      schema: z.object({
        tweetText: z.string()
      }),
      async run({ args, action }) {
        console.log('sendMarketingTweet capability called');
        console.log('Action type:', action?.type);
        
        // Add timestamp to make each tweet unique and avoid duplication errors
        const timestamp = new Date().toISOString();
        const uniqueTweetText = `${args.tweetText} [${timestamp}]`;
        
        try {
          const response = await this.callIntegration({
            workspaceId: action!.workspace.id,
            integrationId: 'twitter-v2',
            details: {
              endpoint: '/2/tweets',
              method: 'POST',
              data: {
                text: uniqueTweetText
              }
            }
          });

          try {
            const error = JSON.parse(JSON.parse(response.output.message));
            
            // Handle specific 403 Forbidden error
            if (error.status === 403) {
              console.error('Twitter API Error: 403 Forbidden -', error.detail || error.message);
              return `Twitter API Error: ${error.detail || error.message}. This is likely due to Twitter's API restrictions. The tweet was not posted.`;
            }
            
            return `Error ${error.status}: ${error.message}`;
          } catch (e) {
            const output = response.output.data;
            return output.text;
          }
        } catch (error: any) {
          console.error('Error sending tweet:', error);
          
          // Check if it's a 403 error in the catch block
          if (error.message && error.message.includes('403')) {
            console.error('Twitter API Error: 403 Forbidden - You are not permitted to perform this action');
            return `Twitter API Error: You are not permitted to perform this action. This is likely due to Twitter's API restrictions. The tweet was not posted.`;
          }
          
          return `Error: Unable to send tweet. Please check your Twitter integration permissions. Details: ${error.message || 'Unknown error'}`;
        }
      }
    },
    {
      name: 'createSummaryDocument',
      description: 'Creates a summary document based on the provided information',
      schema: z.object({
        title: z.string().optional(),
        content: z.string(),
        format: z.enum(['markdown', 'text']).optional().default('markdown')
      }),
      async run({ args }) {
        console.log('createSummaryDocument capability called');
        const { title, content, format } = args;
        
        if (format === 'markdown') {
          return `# ${title || 'Summary Document'}\n\n${content}`;
        } else {
          return `${title || 'Summary Document'}\n\n${content}`;
        }
      }
    }
  ])
  .start()
  .then(() => {
    console.log('Twitter Marketing Agent started successfully!')
  })
  .catch(error => {
    console.error('Error in agent:', error);
    process.exit(1);
  });