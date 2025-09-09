import { BaseEbayAdapter } from './base';
import { CompetitorListing } from './types';

/**
 * Adapter using the legacy Finding API for competitor searches.
 */
export class FindingApiEbayAdapter extends BaseEbayAdapter {
  async searchCompetitorListings(
    _accessToken: string,
    keywords: string,
    opts: { categoryId?: string; excludeSeller?: string } = {}
  ): Promise<CompetitorListing[]> {
    const params = new URLSearchParams({
      'OPERATION-NAME': 'findItemsAdvanced',
      'RESPONSE-DATA-FORMAT': 'JSON',
      keywords,
      'paginationInput.entriesPerPage': '10'
    });
    if (opts.categoryId) params.set('categoryId', opts.categoryId);

    const endpoint = `https://svcs.ebay.com/services/search/FindingService/v1?${params.toString()}`;
    const resp = await fetch(endpoint, {
      headers: {
        'X-EBAY-SOA-SECURITY-APPNAME': this.config.clientId
      }
    });
    if (!resp.ok) {
      throw new Error(`Competitor search failed: ${resp.status} ${resp.statusText}`);
    }
    const data = await resp.json();
    const items =
      data?.findItemsAdvancedResponse?.[0]?.searchResult?.[0]?.item || [];
    return items
      .filter(
        (item: any) =>
          item.sellerInfo?.[0]?.sellerUserName?.[0] !== opts.excludeSeller
      )
      .map((item: any) => ({
        id: item.itemId?.[0],
        title: item.title?.[0],
        seller: item.sellerInfo?.[0]?.sellerUserName?.[0],
        price: parseFloat(
          item.sellingStatus?.[0]?.currentPrice?.[0]?.__value__ ?? '0'
        ),
        shippingPrice: parseFloat(
          item.shippingInfo?.[0]?.shippingServiceCost?.[0]?.__value__ ?? '0'
        ),
        url: item.viewItemURL?.[0]
      }));
  }
}
