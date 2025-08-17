import { createPublicClient, createWalletClient, http, defineChain } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'

/**
 * 定义 Anvil 本地链配置
 * 链 ID: 31337 (0x7a69)
 */
const anvilChain = defineChain({
  id: 31337,
  name: 'Anvil Local',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: { http: ['http://localhost:8545'] },
    public: { http: ['http://localhost:8545'] },
  },
})

/**
 * 创建公共客户端
 * 连接到 Anvil 本地节点
 */
export const publicClient = createPublicClient({
  chain: anvilChain,
  transport: http('http://localhost:8545')
})

/**
 * 使用 Anvil 私钥创建账户
 * 这是 Anvil 默认的第一个账户私钥
 */
const account = privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80')

/**
 * 创建钱包客户端
 */
export const walletClient = createWalletClient({
  account,
  chain: anvilChain,
  transport: http('http://localhost:8545')
})