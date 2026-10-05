import React, { useState } from 'react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, Check, AlertTriangle, Eye, Shield } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setSelectedProduct } = useShop();
  const [isAddedRecently, setIsAddedRecently] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isLowStock = product.stockLevel > 0 && product.stockLevel <= product.minThreshold;
  const isOutOfStock = product.stockLevel === 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;

    const res = addToCart(product, 1, product.sizes?.[0], product.colors?.[0]);
    if (res.success) {
      setIsAddedRecently(true);
      setTimeout(() => setIsAddedRecently(false), 1800);
    }
  };

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="group flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:border-slate-400 hover:shadow-md transition-all duration-200"
    >
      {/* Product Image Slot (~70% of upper visual area) */}
      <div className="relative aspect-4/3 bg-slate-100 overflow-hidden flex items-center justify-center">
        {!imageError ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-slate-400 bg-slate-100">
            <Shield className="w-10 h-10 mb-2 stroke-1 text-slate-400" />
            <span className="text-xs font-mono-numbers">{product.sku}</span>
          </div>
        )}

        {/* Hover Quick Actions */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
          <span className="text-xs text-white font-medium flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>Inspect Specs</span>
          </span>
          <span className="text-xs text-slate-200 font-mono-numbers">{product.warehouseBin}</span>
        </div>
      </div>

      {/* Product Content & Metadata */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line (No pill badge sandwich - clean unboxed typography) */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-medium uppercase tracking-wider text-slate-600 truncate max-w-[150px]">
              {product.category}
            </span>
            
            {/* Live Inventory Status as Clean Text */}
            {isOutOfStock ? (
              <span className="text-rose-600 font-semibold font-mono-numbers">
                Sold Out
              </span>
            ) : isLowStock ? (
              <span className="text-amber-700 font-semibold font-mono-numbers flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-600 inline" />
                Only {product.stockLevel} Left
              </span>
            ) : (
              <span className="text-slate-600 font-mono-numbers">
                {product.stockLevel} In Stock
              </span>
            )}
          </div>

          <h3 className="font-semibold text-slate-900 text-base leading-snug line-clamp-2 group-hover:text-slate-700 transition-colors mb-2">
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action row */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div>
            <span className="text-lg font-bold font-mono-numbers text-slate-900">
              ${product.retailPrice.toFixed(2)}
            </span>
            <div className="text-[11px] text-slate-600 font-mono-numbers">
              SKU: {product.sku.split('-').slice(0, 2).join('-')}
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isOutOfStock
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : isAddedRecently
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
            }`}
            aria-label={`Add ${product.name} to cart`}
          >
            {isAddedRecently ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : isOutOfStock ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
