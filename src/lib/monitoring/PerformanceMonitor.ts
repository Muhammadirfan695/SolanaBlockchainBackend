export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, {
    count: number;
    totalTime: number;
    errors: number;
    lastTimestamp: number;
  }> = new Map();

  private constructor() {}

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startOperation(name: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      const metric = this.metrics.get(name) || {
        count: 0,
        totalTime: 0,
        errors: 0,
        lastTimestamp: startTime
      };
      
      metric.count++;
      metric.totalTime += duration;
      metric.lastTimestamp = endTime;
      
      this.metrics.set(name, metric);
    };
  }

  recordError(operation: string): void {
    const metric = this.metrics.get(operation);
    if (metric) {
      metric.errors++;
      this.metrics.set(operation, metric);
    }
  }

  getMetrics(): Record<string, {
    averageTime: number;
    errorRate: number;
    operationsPerSecond: number;
  }> {
    const result: Record<string, any> = {};
    
    for (const [operation, metric] of this.metrics.entries()) {
      const averageTime = metric.totalTime / metric.count;
      const errorRate = metric.errors / metric.count;
      const timeWindow = (Date.now() - metric.lastTimestamp) / 1000;
      const operationsPerSecond = metric.count / timeWindow;
      
      result[operation] = {
        averageTime,
        errorRate,
        operationsPerSecond
      };
    }
    
    return result;
  }

  reset(): void {
    this.metrics.clear();
  }
}