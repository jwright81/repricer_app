import { BaseEbayAdapter } from './base';
import { CompetitorListing } from './types';

/**
 * Adapter using the modern Buy Browse API for competitor searches.
 * This variant is typically gated behind an environment flag.
 */
export class BuyBrowseApiEbayAdapter extends BaseEbayAdapter {
  async searchCompetitorListings(
    accessToken: string,
    keywords: string,
    opts: { categoryId?: string; excludeSeller?: string } = {}
  ): Promise<CompetitorListing[]> {
    const params = new URLSearchParams({ q: keywords, limit: '10' });
    if (opts.categoryId) params.set('category_ids', opts.categoryId);

    const url = `https://api.ebay.com/buy/browse/v1/item_summary/search?${params.toString()}`;
    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    if (!resp.ok) {
      throw new Error(`Competitor search failed: ${resp.status} ${resp.statusText}`);
    }
    const data = await resp.json();
    const items = data.itemSummaries || [];
    return items
      .filter(
        (item: any) => item.seller && item.seller.username !== opts.excludeSeller
      )
      .map((item: any) => ({
        id: item.itemId,
        title: item.title,
        seller: item.seller?.username,
        price: parseFloat(item.price?.value ?? '0'),
        shippingPrice: parseFloat(
          item.shippingOptions?.[0]?.shippingCost?.value ?? '0'
        ),
        url: item.itemWebUrl
      }));
  }
}
