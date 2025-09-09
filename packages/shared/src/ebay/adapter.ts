import { OAuthTokens, Listing, CompetitorListing } from './types';

export interface EbayAdapter {
  exchangeCodeForToken(code: string, redirectUri: string): Promise<OAuthTokens>;
  getActiveListings(accessToken: string): Promise<Listing[]>;
  searchCompetitorListings(
    accessToken: string,
    keywords: string,
    opts?: { categoryId?: string; excludeSeller?: string }
  ): Promise<CompetitorListing[]>;
  updateListingPrice(
    accessToken: string,
    listingId: string,
    price: number
  ): Promise<void>;
}
