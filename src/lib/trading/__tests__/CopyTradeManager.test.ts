import { CopyTradeManager, CopyTradeConfig } from '../CopyTradeManager';

describe('CopyTradeManager', () => {
  let manager: CopyTradeManager;
  
  const mockConfig: CopyTradeConfig = {
    tradeName: "Test Trade",
    walletAddress: "7nYB8ELLNCwmMQ5UKqH6qYaP6qkUJsGHvGKPvtZHD8L1",
    buyStrategy: 'exact',
    minOrderSize: 0.1,
    totalAllocation: 1.0,
    stopLossPercentage: 10,
    exitStrategies: [
      { profitPercentage: 20, sellPercentage: 50 }
    ],
    minBuyThreshold: 0.05,
    maxTokenAmount: 5,
    priorityFee: 'normal',
    briberyAmount: 0.001
  };

  beforeEach(() => {
    manager = CopyTradeManager.getInstance();
  });

  test('should add copy trade config', async () => {
    const result = await manager.addCopyTradeConfig(mockConfig);
    expect(result).toBe(true);
    
    const savedConfig = manager.getCopyTradeConfig(mockConfig.walletAddress);
    expect(savedConfig).toEqual(mockConfig);
  });

  test('should remove copy trade config', async () => {
    await manager.addCopyTradeConfig(mockConfig);
    const result = await manager.removeCopyTradeConfig(mockConfig.walletAddress);
    expect(result).toBe(true);
    
    const removedConfig = manager.getCopyTradeConfig(mockConfig.walletAddress);
    expect(removedConfig).toBeUndefined();
  });

  test('should update copy trade config', async () => {
    await manager.addCopyTradeConfig(mockConfig);
    
    const updatedConfig = {
      ...mockConfig,
      minOrderSize: 0.2
    };
    
    const result = await manager.updateCopyTradeConfig(updatedConfig);
    expect(result).toBe(true);
    
    const savedConfig = manager.getCopyTradeConfig(mockConfig.walletAddress);
    expect(savedConfig?.minOrderSize).toBe(0.2);
  });

  test('should execute copy trade', async () => {
    await manager.addCopyTradeConfig(mockConfig);
    
    const result = await manager.executeCopyTrade(
      mockConfig.walletAddress,
      {
        tokenAddress: "tokenAddress123",
        amount: 0.1,
        side: 'buy'
      }
    );
    
    expect(result).toBe(true);
  });
});