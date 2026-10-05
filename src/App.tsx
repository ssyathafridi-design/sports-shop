import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { SecurePaymentGateway } from './components/SecurePaymentGateway';
import { OrderReceiptModal } from './components/OrderReceiptModal';
import { InventoryDashboard } from './components/InventoryDashboard';
import { AdjustStockModal } from './components/AdjustStockModal';
import { NewProductModal } from './components/NewProductModal';
import { PurchaseOrderModal } from './components/PurchaseOrderModal';
import { OrdersLedger } from './components/OrdersLedger';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { activeView } = useShop();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* Universal Navigation Header */}
      <Navbar />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'storefront' && (
          <>
            <HeroBanner />
            <ProductGrid />
          </>
        )}

        {activeView === 'inventory' && (
          <InventoryDashboard />
        )}

        {activeView === 'orders' && (
          <OrdersLedger />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <SecurePaymentGateway />
      <OrderReceiptModal />
      <AdjustStockModal />
      <NewProductModal />
      <PurchaseOrderModal />
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
