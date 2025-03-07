import Conf from 'conf';

const config = new Conf({
  projectName: 'whalesx-cli',
  schema: {
    rpcEndpoint: {
      type: 'string',
      default: 'https://api.mainnet-beta.solana.com'
    },
    maxRetries: {
      type: 'number',
      default: 3
    },
    defaultPriorityFee: {
      type: 'number',
      default: 0.000001
    },
    logLevel: {
      type: 'string',
      enum: ['debug', 'info', 'warn', 'error'],
      default: 'info'
    }
  }
});

export default config;