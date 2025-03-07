import { NextResponse } from 'next/server'
import { TradeExecutor } from '@/lib/trading/TradeExecutor'
import { RPCManager } from '@/lib/trading/RPCManager'

export async function POST(req: Request) {
  try {
    const { traderAddress, amount, side } = await req.json()
    
    const executor = TradeExecutor.getInstance()
    const result = await executor.executeCopyTrade(traderAddress, amount, side)

    return NextResponse.json({ success: result })
  } catch (error) {
    console.error('Trade execution error:', error)
    return NextResponse.json({ error: 'Trade execution failed' }, { status: 500 })
  }
}