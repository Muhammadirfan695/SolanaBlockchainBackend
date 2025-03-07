import { isDevelopment } from '../config/environment';
import { MockDatabase } from './MockDatabase';
import { MongoDB } from './mongodb';

export class DatabaseFactory {
  static getDatabase() {
    if (isDevelopment) {
      return MockDatabase.getInstance();
    }
    return MongoDB.getInstance();
  }
}