import { isDevelopment } from '../config/environment';
import { MockTradeExecutor } from './MockTradeExecutor';
import { TradeExecutor } from './TradeExecutor';

export class TradeExecutorFactory {
  static getExecutor() {
    if (isDevelopment) {
      return new MockTradeExecutor();
    }
    return new TradeExecutor();
  }
}