import React from 'react';
import { useShop } from '../context/ShopContext';
import { ShieldCheck, Truck, Lock, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView } = useShop();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-3">
            <span className="text-lg font-extrabold tracking-tight font-display text-white">
              VANGUARD ATHLETICS
            </span>
            <p className="text-xs text-slate-400 leading-relaxed">
              Precision competition footwear, composite balls, racket frames, and tournament strength equipment. Engineered for world-class output.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-emerald-400 font-mono-numbers">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Warehouse Inventory Live & Synced</span>
            </div>
          </div>

          {/* Equipment Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Equipment Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={() => setActiveView('storefront')} className="hover:text-white transition-colors">Footwear & Carbon Spikes</button></li>
              <li><button onClick={() => setActiveView('storefront')} className="hover:text-white transition-colors">Championship Basketballs</button></li>
              <li><button onClick={() => setActiveView('storefront')} className="hover:text-white transition-colors">Torayca Carbon Rackets</button></li>
              <li><button onClick={() => setActiveView('storefront')} className="hover:text-white transition-colors">Machined Iron Kettlebells</button></li>
              <li><button onClick={() => setActiveView('storefront')} className="hover:text-white transition-colors">Pebax Traction Cleats</button></li>
            </ul>
          </div>

          {/* Operations & Inventory */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Operations & Logistics
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={() => setActiveView('inventory')} className="hover:text-white transition-colors">Master Stock Ledger</button></li>
              <li><button onClick={() => setActiveView('inventory')} className="hover:text-white transition-colors">Stock Movements Audit Trail</button></li>
              <li><button onClick={() => setActiveView('inventory')} className="hover:text-white transition-colors">Supplier Purchase Orders</button></li>
              <li><button onClick={() => setActiveView('orders')} className="hover:text-white transition-colors">Captured Invoices & Settlements</button></li>
            </ul>
          </div>

          {/* Security & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Security Standard
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>PCI-DSS Level 1 Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>256-Bit SSL/TLS Cryptography</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>24-Hour Dock Dispatch Guarantee</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Vanguard Athletics Equipment Hub. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>ISO 9001 Facility Audited</span>
            <span>·</span>
            <button
              onClick={scrollToTop}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
