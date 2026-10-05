import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  StockMovement, 
  PurchaseOrder, 
  SportCategory, 
  CustomerDetails, 
  PaymentDetails,
  MovementType
} from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';

interface ShopContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  stockMovements: StockMovement[];
  purchaseOrders: PurchaseOrder[];
  activeView: 'storefront' | 'inventory' | 'orders';
  setActiveView: (view: 'storefront' | 'inventory' | 'orders') => void;
  
  // Filters & Search
  selectedCategory: SportCategory;
  setSelectedCategory: (cat: SportCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'stock-desc';
  setSortBy: (sort: 'featured' | 'price-asc' | 'price-desc' | 'stock-desc') => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;

  // Modals & Drawers
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isReceiptOpen: boolean;
  setIsReceiptOpen: (open: boolean) => void;
  lastOrder: Order | null;
  setLastOrder: (order: Order | null) => void;
  
  // Inventory actions & modals
  productToAdjust: Product | null;
  setProductToAdjust: (p: Product | null) => void;
  isNewProductModalOpen: boolean;
  setIsNewProductModalOpen: (open: boolean) => void;
  isPoModalOpen: boolean;
  setIsPoModalOpen: (open: boolean) => void;

  // Cart operations
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => { success: boolean; message: string };
  updateCartQuantity: (productId: string, quantity: number, size?: string) => void;
  removeFromCart: (productId: string, size?: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;

  // Checkout & Payment execution
  processOrder: (
    customer: CustomerDetails, 
    paymentDetails: PaymentDetails, 
    method: 'card' | 'apple_pay' | 'google_pay' | 'paypal' | 'bank_wire'
  ) => Promise<{ success: boolean; order?: Order; error?: string }>;

  // Inventory operations
  adjustStock: (
    productId: string, 
    delta: number, 
    type: MovementType, 
    reason: string, 
    operator?: string
  ) => void;
  addNewProduct: (productData: Omit<Product, 'id' | 'reservedStock'>) => void;
  createPurchaseOrder: (supplier: string, items: { productId: string; quantity: number }[]) => PurchaseOrder;
  receivePurchaseOrder: (poNumber: string) => void;
  exportInventoryCSV: () => void;
  resetDemoData: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'vanguard_sports_products_v2',
  ORDERS: 'vanguard_sports_orders_v2',
  MOVEMENTS: 'vanguard_sports_movements_v2',
  PURCHASE_ORDERS: 'vanguard_sports_pos_v2',
  CART: 'vanguard_sports_cart_v2',
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load products with fallback
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
      // Seed 1 initial fulfilled sample order so Order Ledger is populated
      return [
        {
          id: 'ord-initial-1',
          orderNumber: 'VG-984210',
          date: new Date(Date.now() - 86400000 * 2).toISOString(),
          customer: {
            fullName: 'Marcus Vance',
            email: 'marcus.vance@athletics.org',
            phone: '+1 (555) 392-8190',
            address: '742 Marathon Blvd, Suite 400',
            city: 'Portland',
            state: 'OR',
            postalCode: '97201',
            country: 'United States'
          },
          items: [
            {
              product: INITIAL_PRODUCTS[0],
              quantity: 1,
              selectedSize: 'US 10.0',
              selectedColor: 'Neon Volt / Carbon Core'
            }
          ],
          subtotal: 249.99,
          tax: 20.00,
          shipping: 0,
          total: 269.99,
          payment: {
            id: 'tx_sec_77a901bf',
            date: new Date(Date.now() - 86400000 * 2).toISOString(),
            amount: 269.99,
            currency: 'USD',
            method: 'card',
            status: 'captured',
            tokenMask: 'tok_live_8293••••••••4912',
            transactionHash: '0x8f2a93c7104b281fcae047b198c3924f5e718290',
            authCode: 'AUTH-99412',
            threeDSecureVerified: true,
            cardBrand: 'visa',
            last4: '4242'
          },
          fulfillmentStatus: 'shipped',
          trackingNumber: '1Z9999999999999999'
        }
      ];
    } catch {
      return [];
    }
  });

  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MOVEMENTS);
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'mov-001',
          timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
          productId: 'prod-001',
          productName: 'Vanguard Stratos Carbon Marathon Racing Shoes',
          sku: 'VAN-RUN-STRATOS-01',
          type: 'RESTOCK',
          quantityDelta: 15,
          previousStock: 0,
          newStock: 15,
          reason: 'Initial Inbound Shipment PO-1001',
          operator: 'H. Reynolds (Warehouse Supv)'
        },
        {
          id: 'mov-002',
          timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
          productId: 'prod-001',
          productName: 'Vanguard Stratos Carbon Marathon Racing Shoes',
          sku: 'VAN-RUN-STRATOS-01',
          type: 'SALE',
          quantityDelta: -1,
          previousStock: 15,
          newStock: 14,
          reason: 'Customer Order #VG-984210',
          operator: 'Automated Gateway Sync',
          referenceId: 'VG-984210'
        }
      ];
    } catch {
      return [];
    }
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PURCHASE_ORDERS);
      if (saved) return JSON.parse(saved);
      return [
        {
          poNumber: 'PO-2026-081',
          date: new Date(Date.now() - 86400000 * 4).toISOString(),
          supplier: 'Apex Athletic Equipment Inc',
          items: [
            {
              productId: 'prod-002',
              productName: 'Apex Championship Composite Leather Basketball',
              sku: 'VAN-BB-COMP-OFFICIAL',
              quantity: 25,
              unitCost: 28.50,
              total: 712.50
            }
          ],
          totalCost: 712.50,
          status: 'ORDERED',
          expectedDelivery: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
        }
      ];
    } catch {
      return [];
    }
  });

  // UI state
  const [activeView, setActiveView] = useState<'storefront' | 'inventory' | 'orders'>('storefront');
  const [selectedCategory, setSelectedCategory] = useState<SportCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'stock-desc'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  
  const [productToAdjust, setProductToAdjust] = useState<Product | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [isPoModalOpen, setIsPoModalOpen] = useState(false);

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MOVEMENTS, JSON.stringify(stockMovements));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [stockMovements]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PURCHASE_ORDERS, JSON.stringify(purchaseOrders));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [purchaseOrders]);

  // Cart operations
  const addToCart = (product: Product, quantity = 1, size?: string, color?: string) => {
    const currentProduct = products.find(p => p.id === product.id);
    if (!currentProduct) {
      return { success: false, message: 'Product not found' };
    }

    const currentCartItem = cart.find(
      item => item.product.id === product.id && item.selectedSize === size && item.selectedColor === color
    );
    const existingQty = currentCartItem ? currentCartItem.quantity : 0;
    const requestedTotal = existingQty + quantity;

    if (requestedTotal > currentProduct.stockLevel) {
      return { 
        success: false, 
        message: `Only ${currentProduct.stockLevel} units remaining in inventory.` 
      };
    }

    setCart(prev => {
      const matchIndex = prev.findIndex(
        item => item.product.id === product.id && item.selectedSize === size && item.selectedColor === color
      );
      if (matchIndex > -1) {
        const copy = [...prev];
        copy[matchIndex].quantity += quantity;
        return copy;
      }
      return [...prev, {
        product: currentProduct,
        quantity,
        selectedSize: size || (currentProduct.sizes ? currentProduct.sizes[0] : undefined),
        selectedColor: color || (currentProduct.colors ? currentProduct.colors[0] : undefined)
      }];
    });

    setIsCartOpen(true);
    return { success: true, message: 'Added to cart' };
  };

  const updateCartQuantity = (productId: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }

    const currentProduct = products.find(p => p.id === productId);
    if (!currentProduct) return;

    if (quantity > currentProduct.stockLevel) {
      quantity = currentProduct.stockLevel;
    }

    setCart(prev => prev.map(item => {
      if (item.product.id === productId && (!size || item.selectedSize === size)) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string, size?: string) => {
    setCart(prev => prev.filter(
      item => !(item.product.id === productId && (!size || item.selectedSize === size))
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.retailPrice * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Process checkout order & secure payment
  const processOrder = async (
    customer: CustomerDetails,
    paymentDetails: PaymentDetails,
    method: 'card' | 'apple_pay' | 'google_pay' | 'paypal' | 'bank_wire'
  ): Promise<{ success: boolean; order?: Order; error?: string }> => {
    // 1. Double check all stock before capturing payment
    for (const item of cart) {
      const p = products.find(prod => prod.id === item.product.id);
      if (!p || p.stockLevel < item.quantity) {
        return { 
          success: false, 
          error: `Item "${item.product.name}" stock depleted while in checkout. Available: ${p ? p.stockLevel : 0}` 
        };
      }
    }

    // 2. Simulate 256-bit tokenization and secure card/gateway capture
    const orderNum = `VG-${Math.floor(100000 + Math.random() * 900000)}`;
    const txId = `tx_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 6)}`;
    const txHash = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const authCode = `AUTH-${Math.floor(10000 + Math.random() * 90000)}`;

    const subtotal = cartTotal;
    const tax = Number((subtotal * 0.0825).toFixed(2));
    const shipping = subtotal > 150 ? 0 : 12.00; // Free shipping over $150
    const total = Number((subtotal + tax + shipping).toFixed(2));

    const cardClean = paymentDetails.cardNumber.replace(/\s+/g, '');
    const last4 = cardClean.length >= 4 ? cardClean.slice(-4) : '8821';

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      date: new Date().toISOString(),
      customer,
      items: [...cart],
      subtotal,
      tax,
      shipping,
      total,
      payment: {
        id: txId,
        date: new Date().toISOString(),
        amount: total,
        currency: 'USD',
        method,
        status: 'captured',
        tokenMask: `tok_sec_pci_${last4}_${Math.random().toString(36).substring(2, 8)}`,
        transactionHash: txHash,
        authCode,
        threeDSecureVerified: true,
        cardBrand: paymentDetails.brand || 'visa',
        last4
      },
      fulfillmentStatus: 'processing',
      trackingNumber: `VG-TRACK-${Math.floor(100000000 + Math.random() * 900000000)}`
    };

    // 3. Atomically decrement stock for all purchased items
    const newMovements: StockMovement[] = [];
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const cartMatch = cart.find(ci => ci.product.id === p.id);
        if (cartMatch) {
          const oldStock = p.stockLevel;
          const newStock = Math.max(0, p.stockLevel - cartMatch.quantity);
          newMovements.push({
            id: `mov-${Date.now()}-${p.id}`,
            timestamp: new Date().toISOString(),
            productId: p.id,
            productName: p.name,
            sku: p.sku,
            type: 'SALE',
            quantityDelta: -cartMatch.quantity,
            previousStock: oldStock,
            newStock: newStock,
            reason: `Order ${orderNum} checkout deduction`,
            operator: 'Gateway Auto-Deduct',
            referenceId: orderNum
          });
          return {
            ...p,
            stockLevel: newStock
          };
        }
        return p;
      });
    });

    // 4. Update audit logs
    if (newMovements.length > 0) {
      setStockMovements(prev => [...newMovements, ...prev]);
    }

    // 5. Store order
    setOrders(prev => [newOrder, ...prev]);
    setLastOrder(newOrder);
    setCart([]);
    setIsCheckoutOpen(false);
    setIsReceiptOpen(true);

    return { success: true, order: newOrder };
  };

  // Inventory adjustment (restock, loss/damage, cycle count)
  const adjustStock = (
    productId: string, 
    delta: number, 
    type: MovementType, 
    reason: string, 
    operator = 'Admin Inventory Specialist'
  ) => {
    let affectedProduct: Product | undefined;
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        affectedProduct = p;
        const newStock = Math.max(0, p.stockLevel + delta);
        return { ...p, stockLevel: newStock };
      }
      return p;
    }));

    if (affectedProduct) {
      const prevStock = affectedProduct.stockLevel;
      const newStock = Math.max(0, prevStock + delta);
      const movement: StockMovement = {
        id: `mov-${Date.now()}`,
        timestamp: new Date().toISOString(),
        productId,
        productName: affectedProduct.name,
        sku: affectedProduct.sku,
        type,
        quantityDelta: delta,
        previousStock: prevStock,
        newStock: newStock,
        reason: reason || 'Inventory manual reconciliation',
        operator
      };
      setStockMovements(prev => [movement, ...prev]);
    }
  };

  // Add new product SKU
  const addNewProduct = (productData: Omit<Product, 'id' | 'reservedStock'>) => {
    const newId = `prod-${Date.now().toString().slice(-6)}`;
    const newProduct: Product = {
      ...productData,
      id: newId,
      reservedStock: 0,
      image: productData.image || '/src/assets/images/product_running_shoes_1791180872520.jpg'
    };

    setProducts(prev => [newProduct, ...prev]);

    const initialMovement: StockMovement = {
      id: `mov-${Date.now()}`,
      timestamp: new Date().toISOString(),
      productId: newId,
      productName: newProduct.name,
      sku: newProduct.sku,
      type: 'RESTOCK',
      quantityDelta: newProduct.stockLevel,
      previousStock: 0,
      newStock: newProduct.stockLevel,
      reason: 'New SKU catalog onboarding',
      operator: 'Catalog Admin'
    };

    setStockMovements(prev => [initialMovement, ...prev]);
  };

  // Purchase Order generation
  const createPurchaseOrder = (supplier: string, items: { productId: string; quantity: number }[]): PurchaseOrder => {
    const poNum = `PO-2026-${Math.floor(100 + Math.random() * 900)}`;
    const poItems = items.map(item => {
      const p = products.find(prod => prod.id === item.productId);
      const unitCost = p ? p.costPrice : 50;
      return {
        productId: item.productId,
        productName: p ? p.name : 'Unknown Product',
        sku: p ? p.sku : 'SKU-UNKNOWN',
        quantity: item.quantity,
        unitCost,
        total: Number((unitCost * item.quantity).toFixed(2))
      };
    });

    const totalCost = Number(poItems.reduce((acc, curr) => acc + curr.total, 0).toFixed(2));
    const newPo: PurchaseOrder = {
      poNumber: poNum,
      date: new Date().toISOString(),
      supplier,
      items: poItems,
      totalCost,
      status: 'ORDERED',
      expectedDelivery: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0]
    };

    setPurchaseOrders(prev => [newPo, ...prev]);
    return newPo;
  };

  // Receive Purchase Order into stock
  const receivePurchaseOrder = (poNumber: string) => {
    const po = purchaseOrders.find(p => p.poNumber === poNumber);
    if (!po || po.status === 'RECEIVED') return;

    const newMovements: StockMovement[] = [];

    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const poItem = po.items.find(item => item.productId === p.id);
        if (poItem) {
          const oldStock = p.stockLevel;
          const newStock = oldStock + poItem.quantity;
          newMovements.push({
            id: `mov-${Date.now()}-${p.id}`,
            timestamp: new Date().toISOString(),
            productId: p.id,
            productName: p.name,
            sku: p.sku,
            type: 'RESTOCK',
            quantityDelta: poItem.quantity,
            previousStock: oldStock,
            newStock,
            reason: `PO ${po.poNumber} stock arrival received`,
            operator: 'Receiving Dock Lead',
            referenceId: po.poNumber
          });
          return { ...p, stockLevel: newStock };
        }
        return p;
      });
    });

    setStockMovements(prev => [...newMovements, ...prev]);

    setPurchaseOrders(prev => prev.map(p => {
      if (p.poNumber === poNumber) {
        return { ...p, status: 'RECEIVED' };
      }
      return p;
    }));
  };

  // CSV Export
  const exportInventoryCSV = () => {
    const headers = ['SKU', 'Barcode', 'Product Name', 'Category', 'Stock Level', 'Min Threshold', 'Unit Cost ($)', 'Retail Price ($)', 'Asset Value ($)', 'Bin Location', 'Supplier'];
    const rows = products.map(p => [
      `"${p.sku}"`,
      `"${p.barcode}"`,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.category}"`,
      p.stockLevel,
      p.minThreshold,
      p.costPrice.toFixed(2),
      p.retailPrice.toFixed(2),
      (p.stockLevel * p.costPrice).toFixed(2),
      `"${p.warehouseBin}"`,
      `"${p.supplier}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Vanguard_Inventory_Ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset to default sample catalog
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.MOVEMENTS);
    localStorage.removeItem(STORAGE_KEYS.PURCHASE_ORDERS);
    localStorage.removeItem(STORAGE_KEYS.CART);
    setProducts(INITIAL_PRODUCTS);
    setCart([]);
    window.location.reload();
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        orders,
        stockMovements,
        purchaseOrders,
        activeView,
        setActiveView,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        inStockOnly,
        setInStockOnly,
        selectedProduct,
        setSelectedProduct,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isReceiptOpen,
        setIsReceiptOpen,
        lastOrder,
        setLastOrder,
        productToAdjust,
        setProductToAdjust,
        isNewProductModalOpen,
        setIsNewProductModalOpen,
        isPoModalOpen,
        setIsPoModalOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartItemCount,
        processOrder,
        adjustStock,
        addNewProduct,
        createPurchaseOrder,
        receivePurchaseOrder,
        exportInventoryCSV,
        resetDemoData
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
