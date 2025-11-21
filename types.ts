export enum ListingType {
  BUY = 'BUY',
  SWAP = 'SWAP',
  RENT = 'RENT'
}

export enum Condition {
  NEW = 'Brand New',
  LIKE_NEW = 'Like New',
  GOOD = 'Good',
  FAIR = 'Fair',
  POOR = 'Poor'
}

export enum Category {
  TEXTBOOKS = 'Textbooks',
  ELECTRONICS = 'Electronics',
  FASHION = 'Fashion',
  HOSTEL = 'Hostel Essentials',
  LAB_GEAR = 'Lab & Scientific',
  STATIONERY = 'Stationery',
  OTHER = 'Other'
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  type: ListingType;
  price?: number; // For BUY
  swapRequest?: string; // For SWAP
  rentPrice?: number; // For RENT
  rentDuration?: string; // For RENT (e.g., 'per day', 'per week')
  category: Category;
  condition: Condition;
  sellerName: string;
  contactInfo: string;
  imageUrl: string;
  createdAt: Date;
}
