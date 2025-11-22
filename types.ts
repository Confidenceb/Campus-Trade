
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

export enum ListingStatus {
  AVAILABLE = 'AVAILABLE',
  SOLD = 'SOLD',
  RENTED = 'RENTED'
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
  contactInfo: string; // Hidden in UI, used for backend ref
  imageUrl: string;
  createdAt: Date;
  status: ListingStatus;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isSystemMessage?: boolean; // For warnings or automated updates
}

export interface Conversation {
  id: string;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  participants: string[]; // User IDs
  otherUserName: string;
  lastMessage: string;
  lastMessageDate: Date;
  unreadCount: number;
  messages: Message[];
}

export interface Review {
  id: string;
  reviewerName: string;
  rating: number; // 1-5
  comment: string;
  date: Date;
}

export interface Notification {
  id: string;
  type: 'alert' | 'message' | 'success';
  title: string;
  message: string;
  isRead: boolean;
  date: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  avatarUrl?: string;
  savedListingIds: string[]; // For Wishlist
  // Extended Profile
  username?: string;
  course?: string;
  faculty?: string;
  level?: string;
  bio?: string;
  phoneNumber?: string;
  // Trust & Safety
  rating?: number;
  reviews?: Review[];
  notifications?: Notification[];
  conversations?: Conversation[];
}
