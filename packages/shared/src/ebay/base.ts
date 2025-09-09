import { EbayAdapter } from './adapter';
import { OAuthTokens, Listing, CompetitorListing } from './types';

export interface EbayConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

/**
 * Base adapter with common OAuth, listing retrieval and price update logic.
 * Concrete implementations must provide competitor search behavior.
 */
export abstract class BaseEbayAdapter implements EbayAdapter {
  constructor(protected config: EbayConfig) {}

  async exchangeCodeForToken(
    code: string,
    redirectUri: string = this.config.redirectUri
  ): Promise<OAuthTokens> {
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri
    });

    const resp = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64')
      },
      body
    });

    if (!resp.ok) {
      throw new Error(`Token exchange failed: ${resp.status} ${resp.statusText}`);
    }

    const data = await resp.json();
    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in
    };
  }

  async getActiveListings(accessToken: string): Promise<Listing[]> {
    const resp = await fetch(
      'https://api.ebay.com/sell/inventory/v1/inventory_item?limit=50',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    if (!resp.ok) {
      throw new Error(`Listing retrieval failed: ${resp.status} ${resp.statusText}`);
    }
    const data = await resp.json();
    const items = data.inventoryItems || [];
    return items.map((item: any) => ({
      id: item.sku || item.inventoryItemGroupKey || '',
      title: item.product?.title ?? '',
      price: parseFloat(
        item.offer?.price?.value ?? item.product?.price?.value ?? '0'
      ),
      currency: item.offer?.price?.currency || item.product?.price?.currency || 'USD',
      shippingPrice: parseFloat(
        item.offer?.shippingOptions?.[0]?.shippingCost?.value ?? '0'
      )
    }));
  }

  abstract searchCompetitorListings(
    accessToken: string,
    keywords: string,
    opts?: { categoryId?: string; excludeSeller?: string }
  ): Promise<CompetitorListing[]>;

  async updateListingPrice(
    accessToken: string,
    listingId: string,
    price: number
  ): Promise<void> {
    const body = {
      price: {
        currency: 'USD',
        value: price.toFixed(2)
      }
    };
    const resp = await fetch(
      `https://api.ebay.com/sell/inventory/v1/offer/${listingId}/price`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    );
    if (!resp.ok) {
      throw new Error(`Price update failed: ${resp.status} ${resp.statusText}`);
    }
  }
}
