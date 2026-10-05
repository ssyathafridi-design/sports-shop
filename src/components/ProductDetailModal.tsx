import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  ShoppingBag, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  Box, 
  Truck, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart } = useShop();

  const [selectedSize, setSelectedSize] = useState<string>(() => {
    return selectedProduct?.sizes?.[0] || '';
  });
  const [selectedColor, setSelectedColor] = useState<string>(() => {
    return selectedProduct?.colors?.[0] || '';
  });
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  if (!selectedProduct) return null;

  const isLowStock = selectedProduct.stockLevel > 0 && selectedProduct.stockLevel <= selectedProduct.minThreshold;
  const isOutOfStock = selectedProduct.stockLevel === 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    const res = addToCart(selectedProduct, quantity, selectedSize, selectedColor);
    if (res.success) {
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 2000);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
      onClick={() => setSelectedProduct(null)}
    >
      <div 
        className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-700 bg-white/90 hover:bg-white rounded-full transition-colors border border-slate-200 shadow-xs"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Product Showcase Photo & Warehouse Tag */}
          <div className="bg-slate-100 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-200">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-200/60 shadow-inner flex items-center justify-center">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Warehouse & Inventory Metadata Strip */}
            <div className="mt-6 pt-4 border-t border-slate-200/80 space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between font-mono-numbers">
                <span className="text-slate-600">Warehouse Bin</span>
                <span className="font-semibold text-slate-900">{selectedProduct.warehouseBin}</span>
              </div>
              <div className="flex items-center justify-between font-mono-numbers">
                <span className="text-slate-600">SKU Code</span>
                <span className="font-semibold text-slate-900">{selectedProduct.sku}</span>
              </div>
              <div className="flex items-center justify-between font-mono-numbers">
                <span className="text-slate-600">Barcode (UPC)</span>
                <span className="font-semibold text-slate-900">{selectedProduct.barcode}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="font-semibold tracking-wider uppercase text-slate-600">
                  {selectedProduct.category}
                </span>
                
                {isOutOfStock ? (
                  <span className="text-rose-600 font-semibold font-mono-numbers">
                    Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="text-amber-700 font-semibold font-mono-numbers flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 inline" />
                    Low Stock: {selectedProduct.stockLevel} units remaining
                  </span>
                ) : (
                  <span className="text-emerald-700 font-medium font-mono-numbers flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600 inline" />
                    In Stock: {selectedProduct.stockLevel} units available
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold font-display text-slate-900 mb-2">
                {selectedProduct.name}
              </h2>

              {/* Price & Unit Details */}
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl font-extrabold font-mono-numbers text-slate-900">
                  ${selectedProduct.retailPrice.toFixed(2)}
                </span>
                <span className="text-xs text-slate-600 font-mono-numbers">
                  MSRP Tax Inc. at Checkout
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {selectedProduct.description}
              </p>

              {/* Size Selector */}
              {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-700">Select Size / Variant</span>
                    <span className="text-slate-600">Competition standard</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          selectedSize === size
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                <div className="mb-6">
                  <div className="text-xs font-semibold text-slate-700 mb-2">
                    Colorway: <span className="font-normal text-slate-600">{selectedColor || selectedProduct.colors[0]}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${
                          selectedColor === color
                            ? 'bg-slate-900 text-white border-slate-900 font-medium'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Technical Specifications Matrix */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6 space-y-2 text-xs">
                <div className="font-semibold text-slate-800 mb-1">Technical Specifications</div>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  {selectedProduct.specifications.weight && (
                    <div>
                      <span className="text-slate-600">Spec Weight: </span>
                      <span className="font-medium text-slate-800 font-mono-numbers">{selectedProduct.specifications.weight}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-600">Material: </span>
                    <span className="font-medium text-slate-800">{selectedProduct.specifications.material}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">Warranty: </span>
                    <span className="font-medium text-slate-800">{selectedProduct.specifications.warranty}</span>
                  </div>
                  {selectedProduct.specifications.origin && (
                    <div>
                      <span className="text-slate-600">Craft Origin: </span>
                      <span className="font-medium text-slate-800">{selectedProduct.specifications.origin}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Quantity and Primary Action */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center gap-3">
                
                {/* Quantity Stepper */}
                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-3 py-2 text-sm font-bold font-mono-numbers text-slate-900 min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(selectedProduct.stockLevel, q + 1))}
                    disabled={quantity >= selectedProduct.stockLevel || isOutOfStock}
                    className="px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Primary Buy CTA */}
                <button
                  onClick={handleAdd}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3 px-6 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    isOutOfStock
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      : justAdded
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-md'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Shopping Bag</span>
                    </>
                  ) : isOutOfStock ? (
                    <span>Sold Out · Reorder in Progress</span>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag · ${(selectedProduct.retailPrice * quantity).toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-between text-[11px] text-slate-600 mt-4 px-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
                  <span>256-Bit Encrypted Checkout</span>
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-slate-700" />
                  <span>Free Shipping over $150</span>
                </span>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
