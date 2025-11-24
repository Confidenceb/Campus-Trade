
import { Category, Condition, Listing, ListingType, ListingStatus, Notification, Review, Conversation } from "./types";

export const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    title: 'Casio FX-991EX Calculator',
    description: 'Barely used scientific calculator, essential for Engineering exams. Comes with the original cover.',
    type: ListingType.BUY,
    price: 8500,
    category: Category.ELECTRONICS,
    condition: Condition.LIKE_NEW,
    sellerName: 'David O.',
    university: 'Unilag',
    contactInfo: '08123456789',
    imageUrl: 'https://picsum.photos/seed/calc/400/300',
    createdAt: new Date(),
    status: ListingStatus.AVAILABLE,
    isFeatured: true
  },
  {
    id: '2',
    title: 'Medical Lab Coat (Size M)',
    description: 'Standard medical lab coat. Clean and ironed. Needed for BIO 101 practicals.',
    type: ListingType.RENT,
    rentPrice: 500,
    rentDuration: 'per day',
    category: Category.LAB_GEAR,
    condition: Condition.GOOD,
    sellerName: 'Sarah K.',
    university: 'LUTH / Unilag',
    contactInfo: 'sarah.k@student.unilag.edu.ng',
    imageUrl: 'https://picsum.photos/seed/coat/400/300',
    createdAt: new Date(),
    status: ListingStatus.AVAILABLE
  },
  {
    id: '3',
    title: 'Samsung A12 -> iPhone X',
    description: 'Want to swap my Samsung A12 (64GB) for an iPhone X. I will add cash on top.',
    type: ListingType.SWAP,
    swapRequest: 'iPhone X or XR',
    category: Category.ELECTRONICS,
    condition: Condition.GOOD,
    sellerName: 'Emmanuel J.',
    university: 'Yabatech',
    contactInfo: '09087654321',
    imageUrl: 'https://picsum.photos/seed/phone/400/300',
    createdAt: new Date(),
    status: ListingStatus.AVAILABLE
  },
  {
    id: '4',
    title: 'GST 102 Textbook',
    description: 'Philosophy and Logic textbook. No missing pages. Highlighted key points for easier reading.',
    type: ListingType.BUY,
    price: 1500,
    category: Category.TEXTBOOKS,
    condition: Condition.FAIR,
    sellerName: 'Chidinma',
    university: 'Unilag',
    contactInfo: '07011223344',
    imageUrl: 'https://picsum.photos/seed/book/400/300',
    createdAt: new Date(),
    status: ListingStatus.AVAILABLE
  },
  {
    id: '5',
    title: 'Mini Refrigerator',
    description: 'Moving out of the hostel. Selling my bedside fridge. Cools perfectly.',
    type: ListingType.BUY,
    price: 45000,
    category: Category.HOSTEL,
    condition: Condition.GOOD,
    sellerName: 'Tobi',
    university: 'LASU',
    contactInfo: '08099887766',
    imageUrl: 'https://picsum.photos/seed/fridge/400/300',
    createdAt: new Date(),
    status: ListingStatus.SOLD
  },
  {
    id: '6',
    title: 'Drafting Board',
    description: 'A3 Drafting board for architecture or engineering students. Need it for just a weekend project?',
    type: ListingType.RENT,
    rentPrice: 1000,
    rentDuration: 'per weekend',
    category: Category.STATIONERY,
    condition: Condition.LIKE_NEW,
    sellerName: 'Ahmed',
    university: 'Unilag',
    contactInfo: 'ahmed.eng@gmail.com',
    imageUrl: 'https://picsum.photos/seed/board/400/300',
    createdAt: new Date(),
    status: ListingStatus.RENTED
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'alert',
    title: 'Price Drop Alert',
    message: 'The price for "Casio FX-991EX" has dropped by 10%!',
    isRead: false,
    date: new Date()
  },
  {
    id: '2',
    type: 'message',
    title: 'New Message',
    message: 'Sarah K. replied to your inquiry about the Lab Coat.',
    isRead: false,
    date: new Date(Date.now() - 3600000) // 1 hour ago
  },
  {
    id: '3',
    type: 'success',
    title: 'Listing Approved',
    message: 'Your "GST 102 Textbook" is now live on the marketplace.',
    isRead: true,
    date: new Date(Date.now() - 86400000) // 1 day ago
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    reviewerName: 'Tunde A.',
    rating: 5,
    comment: 'Item was exactly as described. Smooth transaction at Senate building.',
    date: new Date(Date.now() - 86400000 * 2)
  },
  {
    id: '2',
    reviewerName: 'Bisi O.',
    rating: 4,
    comment: 'Good seller, but arrived 10 mins late. Item is perfect though.',
    date: new Date(Date.now() - 86400000 * 5)
  },
  {
    id: '3',
    reviewerName: 'Emeka',
    rating: 5,
    comment: 'Saved me so much money on this textbook! Thanks.',
    date: new Date(Date.now() - 86400000 * 10)
  }
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv1',
    listingId: '2',
    listingTitle: 'Medical Lab Coat',
    listingImage: 'https://picsum.photos/seed/coat/100/100',
    participants: ['user-123', 'seller-2'],
    otherUserName: 'Sarah K.',
    otherUserUniversity: 'Unilag',
    lastMessage: 'Yes, it is available for pickup at Jaja Hall.',
    lastMessageDate: new Date(Date.now() - 3600000),
    unreadCount: 1,
    messages: [
      {
        id: 'm1',
        senderId: 'user-123',
        text: 'Hi, is this still available for rent tomorrow?',
        timestamp: new Date(Date.now() - 7200000)
      },
      {
        id: 'm2',
        senderId: 'seller-2',
        text: 'Yes, it is available for pickup at Jaja Hall.',
        timestamp: new Date(Date.now() - 3600000)
      }
    ]
  },
  {
    id: 'conv2',
    listingId: '3',
    listingTitle: 'Samsung A12 Swap',
    listingImage: 'https://picsum.photos/seed/phone/100/100',
    participants: ['user-123', 'seller-3'],
    otherUserName: 'Emmanuel J.',
    otherUserUniversity: 'Yabatech',
    lastMessage: 'How much cash are you adding?',
    lastMessageDate: new Date(Date.now() - 86400000),
    unreadCount: 0,
    messages: [
      {
        id: 'm1',
        senderId: 'user-123',
        text: 'I have an iPhone X. Clean.',
        timestamp: new Date(Date.now() - 90000000)
      },
      {
        id: 'm2',
        senderId: 'seller-3',
        text: 'How much cash are you adding?',
        timestamp: new Date(Date.now() - 86400000)
      }
    ]
  }
];

export const FAQS = [
  {
    question: "How do I ensure a safe trade?",
    answer: "Always chat within the app using our AI-monitored system. For expensive items, use our Escrow payment option. Meet in open, public places on campus like the Senate Building, Faculty entrances, or libraries."
  },
  {
    question: "What is Escrow Payment?",
    answer: "Escrow protects both buyer and seller. The buyer pays CampusTrade, we hold the money, and only release it to the seller once the buyer confirms they received the item in good condition."
  },
  {
    question: "How do I become a Verified Student?",
    answer: "Go to your profile settings and click 'Verify'. You will need to upload a clear picture of your valid School ID card and Matric Number."
  },
  {
    question: "Can I sell items from outside Unilag?",
    answer: "Yes! While we started in Unilag, we support students from LASU, Yabatech, and other nearby institutions. Just select your school when listing."
  }
];