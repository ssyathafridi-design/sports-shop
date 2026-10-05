import React from 'react';
import { HERO_BANNER_IMAGE } from '../data/initialProducts';
import { ArrowDown, ShieldCheck, Zap, Lock, Truck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const HeroBanner: React.FC = () => {
  const { setSelectedCategory, products } = useShop();

  const totalInStock = products.reduce((acc, p) => acc + p.stockLevel, 0);

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-slate-950 text-white overflow-hidden border-b border-slate-800">
      {/* Background Hero Image with Measured Gradient Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_BANNER_IMAGE}
          alt="Elite athletes sprinting under stadium floodlights"
          className="w-full h-full object-cover object-center opacity-45 transform scale-102"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-2xl">
          
          {/* Natural human kicker */}
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-emerald-400 mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>2026 Competition Gear Standard</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400 font-mono-numbers">{totalInStock} Verified Units Live</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-white text-balance leading-none mb-6">
            Precision Gear for Maximum Output.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-xl">
            Tournament-grade footwear, composites, and conditioning hardware. Synchronized with our live warehouse inventory ledger and protected by bank-level 256-bit payment encryption.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-10">
            <button
              onClick={scrollToCatalog}
              className="px-6 py-3.5 text-sm font-semibold text-slate-950 bg-white hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2 shadow-lg"
            >
              <span>Explore Equipment</span>
              <ArrowDown className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setSelectedCategory('Footwear & Spikes');
                scrollToCatalog();
              }}
              className="px-5 py-3.5 text-sm font-medium text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
            >
              Carbon Spikes & Racing
            </button>
          </div>

          {/* Adjacent Quantitative Proof Strip */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-800/80 max-w-lg">
            <div>
              <div className="text-2xl font-bold font-mono-numbers text-white">256-Bit</div>
              <div className="text-xs text-slate-400 mt-0.5">AES Encrypted Gateway</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono-numbers text-white">100%</div>
              <div className="text-xs text-slate-400 mt-0.5">Real-Time Stock Sync</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono-numbers text-white">24h</div>
              <div className="text-xs text-slate-400 mt-0.5">Dock Dispatch Target</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
