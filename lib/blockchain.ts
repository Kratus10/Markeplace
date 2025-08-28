import { ethers } from 'ethers';

// Cache providers to avoid recreating them
const providerCache = new Map();

interface ProviderOptions {
  apiKey?: string;
  network?: string;
}

/**
 * Get an Ethers.js provider for a given cryptocurrency
 * @param currency Cryptocurrency symbol (ETH, BTC, USDT, etc.)
 * @param options Optional provider configuration
 * @returns Ethers.js provider instance
 */
export function getEtherscanProvider(currency: string, options: ProviderOptions = {}): ethers.JsonRpcProvider {
  const cacheKey = `${currency}:${options.network || 'mainnet'}`;
  
  // Return cached provider if available
  if (providerCache.has(cacheKey)) {
    return providerCache.get(cacheKey);
  }

  let rpcUrl = '';
  
  switch (currency) {
    case 'ETH':
      rpcUrl = `https://mainnet.infura.io/v3/${options.apiKey || process.env.INFURA_API_KEY}`;
      break;
    case 'BSC':
    case 'BNB':
      rpcUrl = 'https://bsc-dataseed.binance.org/';
      break;
    case 'MATIC':
      rpcUrl = 'https://polygon-rpc.com/';
      break;
    case 'USDT':
      // USDT exists on multiple chains, default to Ethereum
      rpcUrl = `https://mainnet.infura.io/v3/${options.apiKey || process.env.INFURA_API_KEY}`;
      break;
    default:
      throw new Error(`Unsupported currency: ${currency}`);
  }

  if (!rpcUrl) {
    throw new Error('RPC URL not configured for this currency');
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  providerCache.set(cacheKey, provider);
  return provider;
}
