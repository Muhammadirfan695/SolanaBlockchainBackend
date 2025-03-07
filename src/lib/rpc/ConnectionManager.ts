import { Connection, Commitment } from '@solana/web3.js'

export class ConnectionManager {
  private static instance: ConnectionManager
  private connections: Map<string, Connection>
  private healthChecks: Map<string, boolean>
  
  private constructor() {
    this.connections = new Map()
    this.healthChecks = new Map()
    this.initializeConnections()
  }

  static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager()
    }
    return ConnectionManager.instance
  }

  private initializeConnections() {
    const endpoints = [
      process.env.NEXT_PUBLIC_QUICKNODE_RPC!,
      process.env.NEXT_PUBLIC_BACKUP_RPC!
    ]

    endpoints.forEach(endpoint => {
      this.connections.set(
        endpoint,
        new Connection(endpoint, {
          commitment: 'processed',
          wsEndpoint: endpoint.replace('https', 'wss'),
          confirmTransactionInitialTimeout: 20000
        })
      )
      this.healthChecks.set(endpoint, true)
    })

    this.startHealthCheck()
  }

  private startHealthCheck() {
    setInterval(async () => {
      for (const [endpoint, connection] of this.connections) {
        try {
          const health = await connection.getHealth()
          this.healthChecks.set(endpoint, health === 'ok')
        } catch {
          this.healthChecks.set(endpoint, false)
        }
      }
    }, 5000)
  }

  async getOptimalConnection(): Promise<Connection> {
    const latencies = await Promise.all(
      Array.from(this.connections.entries()).map(async ([endpoint, conn]) => {
        if (!this.healthChecks.get(endpoint)) return [endpoint, Infinity]
        
        const start = performance.now()
        try {
          await conn.getSlot()
          return [endpoint, performance.now() - start]
        } catch {
          return [endpoint, Infinity]
        }
      })
    )

    const [fastestEndpoint] = latencies.reduce((a, b) => a[1] < b[1] ? a : b)
    return this.connections.get(fastestEndpoint)!
  }
}