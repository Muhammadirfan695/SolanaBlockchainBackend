import chalk from 'chalk';
import config from './config';

export class Logger {
  static debug(message: string, ...args: any[]) {
    if (config.get('logLevel') === 'debug') {
      console.log(chalk.gray(`[DEBUG] ${message}`), ...args);
    }
  }

  static info(message: string, ...args: any[]) {
    if (['debug', 'info'].includes(config.get('logLevel') as string)) {
      console.log(chalk.blue(`[INFO] ${message}`), ...args);
    }
  }

  static warn(message: string, ...args: any[]) {
    if (['debug', 'info', 'warn'].includes(config.get('logLevel') as string)) {
      console.log(chalk.yellow(`[WARN] ${message}`), ...args);
    }
  }

  static error(message: string, ...args: any[]) {
    console.error(chalk.red(`[ERROR] ${message}`), ...args);
  }

  static success(message: string, ...args: any[]) {
    console.log(chalk.green(`[SUCCESS] ${message}`), ...args);
  }
}