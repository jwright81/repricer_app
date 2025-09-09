export * from './types';
export * from './adapter';
export { EbayConfig, BaseEbayAdapter } from './base';
export { MockEbayAdapter } from './mock';
export { FindingApiEbayAdapter } from './finding';
export { BuyBrowseApiEbayAdapter } from './buyBrowse';

import { EbayAdapter } from './adapter';
import { EbayConfig } from './base';
import { MockEbayAdapter } from './mock';
import { FindingApiEbayAdapter } from './finding';
import { BuyBrowseApiEbayAdapter } from './buyBrowse';

/**
 * Factory that returns the appropriate adapter implementation.
 * Set `EBAY_ADAPTER_VARIANT` to `mock`, `finding` (default) or `buy-browse`.
 */
export function createEbayAdapter(
  config: EbayConfig,
  opts: { variant?: 'mock' | 'finding' | 'buy-browse' } = {}
): EbayAdapter {
  const variant = opts.variant || process.env.EBAY_ADAPTER_VARIANT;
  switch (variant) {
    case 'mock':
      return new MockEbayAdapter();
    case 'buy-browse':
      return new BuyBrowseApiEbayAdapter(config);
    case 'finding':
    default:
      return new FindingApiEbayAdapter(config);
  }
}
