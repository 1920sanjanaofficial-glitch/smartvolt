export type CategoryType = 
  | 'Batteries'
  | 'Power Equipment'
  | 'Solar Products'
  | 'Electrical Accessories'
  | 'Other Electrical Equipment';

export interface ProductSpecification {
  nominalVoltage: number; // in Volts
  operatingVoltageMin?: number;
  operatingVoltageMax?: number;
  continuousPowerWatts: number; // in Watts
  surgePowerWatts?: number;
  capacityAh?: number; // in Ah (if battery)
  batteryChemistry?: 'LiFePO4' | 'Li-ion' | 'Lead-Acid' | 'Tubular' | 'VRLA' | 'NiMH' | 'N/A';
  connectorType: string; // e.g. Anderson SB50, M8 Bolt, Terminal Posts, XT60, MC4
  efficiencyPercent: number; // e.g. 92%
  cycleLife?: number; // e.g. 4000
  warrantyMonths: number;
  weightKg?: number;
  hsnCode: string;
}

export interface ProductReview {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  createdAt: string;
  isVerifiedPurchase: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: CategoryType;
  subcategory: string;
  description: string;
  price: number; // INR
  mrp: number;
  imageUrl: string;
  specifications: ProductSpecification;
  stockQuantity: number;
  isFeatured?: boolean;
  reviews: ProductReview[];
  averageRating: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  unitPrice: number;
  quantity: number;
  voltageStr: string;
  wattageStr: string;
  warrantyMonths: number;
  imageUrl: string;
}

export interface Order {
  id: string; // e.g. SV-1042
  userId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  deliveryMethod: 'shipping' | 'shop_pickup';
  items: OrderItem[];
  subtotal: number;
  gstAmount: number; // 18% standard GST (9% CGST + 9% SGST)
  deliveryCharge: number;
  discountAmount: number;
  couponCode?: string;
  totalAmount: number;
  paymentMethod: 'upi' | 'qr_code' | 'card_netbanking' | 'cash_pickup';
  paymentStatus: 'pending' | 'successful' | 'failed' | 'refunded';
  transactionId?: string;
  orderStatus: 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  invoiceId: string;
}

export interface Invoice {
  id: string; // e.g. INV-2026-1042
  orderId: string;
  orderNumber: string;
  invoiceDate: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  subtotal: number;
  cgstAmount: number;
  sgstAmount: number;
  totalTax: number;
  deliveryCharge: number;
  discountAmount: number;
  finalAmount: number;
  paymentStatus: 'successful' | 'pending';
  paymentMethod: string;
  transactionId: string;
  items: OrderItem[];
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  isActive: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  role: 'customer' | 'admin';
}

export interface NotificationLog {
  id: string;
  orderId: string;
  channel: 'whatsapp' | 'sms';
  recipient: string;
  status: 'delivered' | 'ready_for_dispatch' | 'sent';
  messageText: string;
  timestamp: string;
  directLink?: string;
}

export interface SmartRecommendationQuery {
  requiredVoltage: number;
  requiredPowerWatts: number;
  batteryCapacityAh?: number;
  connectorType?: string;
  batteryChemistry?: string;
  applicationUsage?: string;
  requiredBackupHours?: number;
  budget?: number;
}

export interface CompatibilityCheck {
  isCompatible: boolean;
  voltageCompatible: boolean;
  powerCompatible: boolean;
  chemistryCompatible: boolean;
  connectorCompatible: boolean;
  stockAvailable: boolean;
  backupHoursEstimated: number;
  compatibilityScore: number; // 0-100
  notes: string[];
}
