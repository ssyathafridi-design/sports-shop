import React from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, ShieldCheck, Box, PackageCheck, Layers } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    cartItemCount, 
    setIsCartOpen,
    products 
  } = useShop();

  const lowStockCount = products.filter(p => p.stockLevel <= p.minThreshold).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Zone 1: Brand title, one line, single text element wordmark */}
          <div className="flex items-center">
            <button
              onClick={() => setActiveView('storefront')}
              className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 font-display hover:text-slate-700 transition-colors text-left"
            >
              VANGUARD ATHLETICS
            </button>
          </div>

          {/* Zone 2: 4 nav links, single-line text */}
          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <button
              onClick={() => setActiveView('storefront')}
              className={`transition-colors py-1 ${
                activeView === 'storefront'
                  ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Equipment Catalog
            </button>

            <button
              onClick={() => setActiveView('inventory')}
              className={`flex items-center gap-1.5 transition-colors py-1 ${
                activeView === 'inventory'
                  ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Inventory Management</span>
              {lowStockCount > 0 && (
                <span className="font-mono-numbers text-xs bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded font-semibold">
                  {lowStockCount} alert{lowStockCount > 1 ? 's' : ''}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveView('orders')}
              className={`transition-colors py-1 ${
                activeView === 'orders'
                  ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Order & Invoices
            </button>
          </nav>

          {/* Zone 3: Primary actions */}
          <div className="flex items-center gap-3">
            {/* View Switcher for mobile */}
            <div className="flex md:hidden items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveView('storefront')}
                className={`p-1.5 rounded text-xs font-medium ${
                  activeView === 'storefront' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
                title="Storefront"
              >
                <Layers className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveView('inventory')}
                className={`p-1.5 rounded text-xs font-medium relative ${
                  activeView === 'inventory' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
                title="Inventory System"
              >
                <Box className="w-4 h-4" />
                {lowStockCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full" />
                )}
              </button>
            </div>

            {/* Quick Switch to Inventory Management Console */}
            <button
              onClick={() => setActiveView(activeView === 'inventory' ? 'storefront' : 'inventory')}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              <Box className="w-3.5 h-3.5 text-slate-600" />
              <span>{activeView === 'inventory' ? 'View Storefront' : 'Manage Inventory'}</span>
            </button>

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              <span className="font-mono-numbers bg-slate-800 text-white text-xs px-2 py-0.5 rounded font-bold border border-slate-700">
                {cartItemCount}
              </span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
