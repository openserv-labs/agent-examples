import 'dotenv/config'

import { getTools, type ToolBase } from '@goat-sdk/core'
import { erc20, USDC } from '@goat-sdk/plugin-erc20'
import { sendETH } from '@goat-sdk/wallet-evm'
import { viem } from '@goat-sdk/wallet-viem'
import { Agent, type Capability } from '@openserv-labs/sdk'
import fs from 'node:fs'
import path from 'node:path'
import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { mainnet } from 'viem/chains'
import type { z } from 'zod'

if (!process.env.WALLET_PRIVATE_KEY) {
  throw new Error('WALLET_PRIVATE_KEY is not set')
}

if (!process.env.RPC_PROVIDER_URL) {
  throw new Error('RPC_PROVIDER_URL is not set')
}

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set')
}

if (!process.env.OPENSERV_API_KEY) {
  throw new Error('OPENSERV_API_KEY is not set')
}

const erc20Plugin = erc20({
  tokens: [
    USDC,
    {
      name: 'OpenServ',
      symbol: 'SERV',
      decimals: 18,
      chains: {
        [mainnet.id]: {
          contractAddress: '0x40e3d1A4B2C47d9AA61261F5606136ef73E28042'
        }
      }
    },
    {
      name: 'Virtual Protocol',
      symbol: 'VIRTUAL',
      decimals: 18,
      chains: {
        [mainnet.id]: {
          contractAddress: '0x44ff8620b8cA30902395A7bD3F2407e1A091BF73'
        }
      }
    }
  ]
})

const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`)

const walletClient = createWalletClient({
  account,
  transport: http(process.env.RPC_PROVIDER_URL),
  chain: mainnet
})

const goatAgent = new Agent({
  systemPrompt: fs.readFileSync(path.join(__dirname, './system.md'), 'utf8')
})

const toCapability = (tool: ToolBase) => {
  return {
    name: tool.name,
    description: tool.description,
    schema: tool.parameters,
    async run({ args }) {
      const response = await tool.execute(args)

      if (typeof response === 'object') {
        return JSON.stringify(response, null, 2)
      }

      return response.toString()
    }
  } as Capability<typeof tool.parameters>
}

async function main() {
  const wallet = viem(walletClient)

  const tools = await getTools({
    wallet,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    plugins: [sendETH(), erc20Plugin]
  })

  const address = wallet.getAddress()

  // here we need to override the tools that need to be executed with the address
  // to pass the address of the wallet to the tool
  // otherwise gpt is hallucinating the address
  const transferTool = tools.find(tool => tool.name === 'transfer')

  if (transferTool) {
    transferTool.execute = async ({ args }) => {
      const result = await transferTool.execute({ ...args, to: address })
      return `Transaction sent: ${result}`
    }
  }

  const getBalanceTool = tools.find(tool => tool.name === 'get_balance')

  if (getBalanceTool) {
    getBalanceTool.execute = async () => {
      const balance = await wallet.balanceOf(address)
      return `${balance.value} ${balance.symbol}`
    }
  }

  try {
    const capabilities = tools.map(toCapability) as [Capability<z.ZodTypeAny>, ...Capability<z.ZodTypeAny>[]]

    goatAgent.addCapabilities(capabilities)

    await goatAgent.start()
  } catch (error) {
    console.error(error)
  }
}

main()
