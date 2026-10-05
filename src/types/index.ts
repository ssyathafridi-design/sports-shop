export type SportCategory = 
  | 'All'
  | 'Footwear & Spikes'
  | 'Basketball'
  | 'Tennis & Rackets'
  | 'Strength & Gym'
  | 'Soccer & Football'
  | 'Apparel & Recovery';

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  category: SportCategory;
  brand: string;
  description: string;
  specifications: {
    weight?: string;
    material: string;
    warranty: string;
    origin?: string;
  };
  retailPrice: number;
  costPrice: number;
  stockLevel: number;
  reservedStock: number;
  minThreshold: number;
  warehouseBin: string;
  supplier: string;
  image: string;
  rating: number;
  reviewsCount: number;
  isFeatured?: boolean;
  sizes?: string[];
  colors?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export type PaymentMethod = 'card' | 'apple_pay' | 'google_pay' | 'paypal' | 'bank_wire';

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PaymentDetails {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  brand: 'visa' | 'mastercard' | 'amex' | 'discover' | 'generic';
}

export type CardDetails = PaymentDetails;

export interface PaymentTransaction {
  id: string;
  date: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: 'authorized' | 'captured' | 'refunded';
  tokenMask: string;
  transactionHash: string;
  authCode: string;
  threeDSecureVerified: boolean;
  cardBrand?: string;
  last4?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  payment: PaymentTransaction;
  fulfillmentStatus: 'processing' | 'ready_for_dispatch' | 'shipped' | 'delivered';
  trackingNumber: string;
}

export type MovementType = 
  | 'SALE'
  | 'RESTOCK'
  | 'MANUAL_AUDIT'
  | 'DAMAGE_WRITE_OFF'
  | 'TRANSFER';

export interface StockMovement {
  id: string;
  timestamp: string;
  productId: string;
  productName: string;
  sku: string;
  type: MovementType;
  quantityDelta: number;
  previousStock: number;
  newStock: number;
  reason: string;
  operator: string;
  referenceId?: string; // Order ID or PO Number
}

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitCost: number;
  total: number;
}

export interface PurchaseOrder {
  poNumber: string;
  date: string;
  supplier: string;
  items: PurchaseOrderItem[];
  totalCost: number;
  status: 'DRAFT' | 'ORDERED' | 'RECEIVED' | 'CANCELLED';
  expectedDelivery: string;
}
