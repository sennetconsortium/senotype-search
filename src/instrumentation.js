import log from 'xac-loglevel';
import ENVS from './lib/envs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Code here runs once when the Node.js server starts
    log.setConfig({ level: ENVS.logLevel });
    log.info('Server initialized', ENVS.logLevel);
    log.setPath(log.getConfigPath());
  }
}
