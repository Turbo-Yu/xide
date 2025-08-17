import { useState, useEffect } from 'react'
import { createWalletClient, custom } from 'viem'
import { mainnet, sepolia } from 'viem/chains'

/**
 * 钱包连接组件
 * 使用 viem 库连接以太坊钱包
 */
export function WalletConnect() {
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [walletClient, setWalletClient] = useState<any>(null)

  /**
   * 检测可用的钱包
   */
  const detectWallets = () => {
    const wallets = []
    
    if (typeof window.ethereum !== 'undefined') {
      if (window.ethereum.isMetaMask) wallets.push('🦊 MetaMask')
      if (window.ethereum.isCoinbaseWallet) wallets.push('🟦 Coinbase Wallet')
      if (window.ethereum.isTrust) wallets.push('🛡️ Trust Wallet')
      if (window.ethereum.isImToken) wallets.push('🎯 imToken')
      if (wallets.length === 0) wallets.push('🔗 以太坊兼容钱包')
    }

    return wallets
  }

  /**
   * 连接钱包
   */
  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('❌ 未检测到以太坊钱包！请安装 MetaMask 或其他以太坊钱包')
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      // 创建钱包客户端
      const client = createWalletClient({
        chain: mainnet, // 可以根据需要改为 sepolia 或其他网络
        transport: custom(window.ethereum)
      })

      // 请求账户连接
      const [account] = await client.requestAddresses()
      
      // 获取网络信息
      const chainId = await client.getChainId()
      
      setAccount(account)
      setChainId(chainId)
      setWalletClient(client)

      // 监听账户变化
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          setAccount(null)
          setChainId(null)
          setWalletClient(null)
        } else {
          setAccount(accounts[0])
        }
      })

      // 监听链变化
      window.ethereum.on('chainChanged', (chainId: string) => {
        setChainId(parseInt(chainId, 16))
      })

    } catch (err: any) {
      setError(`❌ 连接失败: ${err.message}`)
    } finally {
      setIsConnecting(false)
    }
  }

  /**
   * 断开连接
   */
  const disconnectWallet = () => {
    setAccount(null)
    setChainId(null)
    setWalletClient(null)
    setError(null)
  }

  /**
   * 切换网络
   */
  const switchNetwork = async (targetChainId: number) => {
    if (!window.ethereum) return

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }]
      })
    } catch (err: any) {
      setError(`切换网络失败: ${err.message}`)
    }
  }

  const wallets = detectWallets()

  return (
    <div style={{ 
      padding: '1rem', 
      border: '1px solid #ddd', 
      borderRadius: '8px', 
      marginBottom: '1rem',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>🔗 钱包连接</h3>
      
      {error && (
        <div style={{ 
          color: 'red', 
          marginBottom: '1rem', 
          padding: '0.5rem', 
          border: '1px solid red', 
          borderRadius: '4px',
          backgroundColor: '#ffe6e6'
        }}>
          {error}
        </div>
      )}

      {wallets.length > 0 && (
        <div style={{ 
          color: 'green', 
          marginBottom: '1rem', 
          padding: '0.5rem', 
          border: '1px solid green', 
          borderRadius: '4px',
          backgroundColor: '#e6ffe6'
        }}>
          ✅ 检测到以太坊钱包: {wallets.join(', ')}
        </div>
      )}

      {!account ? (
        <button 
          onClick={connectWallet}
          disabled={isConnecting}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            backgroundColor: isConnecting ? '#ccc' : '#646cff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isConnecting ? 'not-allowed' : 'pointer',
            marginRight: '0.5rem'
          }}
        >
          {isConnecting ? '连接中...' : '连接以太坊钱包'}
        </button>
      ) : (
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <p><strong>账户地址:</strong> {account.substring(0, 10)}...{account.substring(-8)}</p>
            <p><strong>当前链 ID:</strong> {chainId}</p>
          </div>
          
          <button 
            onClick={disconnectWallet}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '0.5rem'
            }}
          >
            断开连接
          </button>

          <button 
            onClick={() => switchNetwork(1)}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              backgroundColor: '#44aa44',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '0.5rem'
            }}
          >
            切换到主网
          </button>

          <button 
            onClick={() => switchNetwork(11155111)}
            style={{
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              backgroundColor: '#4444aa',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            切换到 Sepolia
          </button>
        </div>
      )}
    </div>
  )
}