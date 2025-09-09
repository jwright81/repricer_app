export interface OAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}

export interface Listing {
  id: string;
  title: string;
  price: number;
  currency: string;
  shippingPrice: number;
}

export interface CompetitorListing {
  id: string;
  title: string;
  seller: string;
  price: number;
  shippingPrice: number;
  url?: string;
}
