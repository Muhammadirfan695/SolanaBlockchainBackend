import { Command } from 'commander';
import { TradeWatcher } from '../lib/websocket/TradeWatcher';
import { MongoDB } from '../lib/db/mongodb';
import { RedisCache } from '../lib/db/redis';
import { CONFIG } from '../config';

const program = new Command();
const tradeWatcher = TradeWatcher.getInstance();
const mongodb = MongoDB.getInstance();
const redisCache = RedisCache.getInstance();

program
  .name('whalesx-cli')
  .description('WhalesX Copy Trading CLI')
  .version('0.1.0');

program
  .command('start')
  .description('Start the copy trading service')
  .option('-w, --wallet <address>', 'Wallet address to watch')
  .option('-c, --config <path>', 'Path to config file')
  .action(async (options) => {
    try {
      // Initialize connections
      await mongodb.connect();
      console.log('✓ MongoDB connected');

      // Start watching wallets
      if (options.wallet) {
        await tradeWatcher.startWatching(options.wallet);
        console.log(`✓ Started watching wallet: ${options.wallet}`);
      }

      // Keep process alive
      process.stdin.resume();
      console.log('Copy trading service is running...');
    } catch (error) {
      console.error('Error starting service:', error);
      process.exit(1);
    }
  });

program
  .command('stop')
  .description('Stop watching a wallet')
  .argument('<address>', 'Wallet address to stop watching')
  .action(async (address) => {
    try {
      await tradeWatcher.stopWatching(address);
      console.log(`✓ Stopped watching wallet: ${address}`);
    } catch (error) {
      console.error('Error stopping watch:', error);
      process.exit(1);
    }
  });

program
  .command('status')
  .description('Show copy trading status')
  .action(async () => {
    try {
      const configs = await redisCache.getAllConfigs();
      console.table(configs.map(c => ({
        wallet: c.walletAddress,
        active: c.isActive,
        strategy: c.tradeName
      })));
    } catch (error) {
      console.error('Error getting status:', error);
      process.exit(1);
    }
  });

program.parse();