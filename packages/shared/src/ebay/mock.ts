import { EbayAdapter } from './adapter';
import { OAuthTokens, Listing, CompetitorListing } from './types';

/**
 * Simple in-memory mock implementation used for tests and local development.
 */
export class MockEbayAdapter implements EbayAdapter {
  private listings: Listing[] = [
    { id: '1', title: 'Mock Listing', price: 10, currency: 'USD', shippingPrice: 2 }
  ];
  private competitors: CompetitorListing[] = [
    { id: 'c1', title: 'Competitor 1', seller: 'seller1', price: 9, shippingPrice: 1 }
  ];

  async exchangeCodeForToken(): Promise<OAuthTokens> {
    return {
      accessToken: 'mock_access',
      refreshToken: 'mock_refresh',
      expiresIn: 3600
    };
  }

  async getActiveListings(): Promise<Listing[]> {
    return this.listings;
  }

  async searchCompetitorListings(): Promise<CompetitorListing[]> {
    return this.competitors;
  }

  async updateListingPrice(
    _accessToken: string,
    listingId: string,
    price: number
  ): Promise<void> {
    const listing = this.listings.find((l) => l.id === listingId);
    if (listing) {
      listing.price = price;
    }
  }
}
