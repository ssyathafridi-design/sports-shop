import React from 'react';
import { useShop } from '../context/ShopContext';
import { X, Trash2, ShieldCheck, ArrowRight, ShoppingBag, Package } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartQuantity, 
    removeFromCart, 
    cartTotal,
    cartItemCount,
    setIsCheckoutOpen
  } = useShop();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 150;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);
  const progressPercent = Math.min(100, (cartTotal / freeShippingThreshold) * 100);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-slate-900" />
              <h2 className="text-lg font-bold font-display text-slate-900">
                Equipment Bag
              </h2>
              <span className="font-mono-numbers text-xs text-slate-500">
                ({cartItemCount} item{cartItemCount === 1 ? '' : 's'})
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 text-xs">
            {remainingForFreeShipping > 0 ? (
              <div className="text-slate-600 mb-1.5">
                Add <span className="font-semibold text-slate-900 font-mono-numbers">${remainingForFreeShipping.toFixed(2)}</span> more to qualify for <span className="font-semibold text-slate-900">Free Express Dispatch</span>
              </div>
            ) : (
              <div className="text-emerald-700 font-semibold mb-1.5 flex items-center gap-1">
                <span>Free Express Dispatch Unlocked!</span>
              </div>
            )}
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-slate-900 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-slate-100">
            {cart.length > 0 ? (
              cart.map(item => {
                const maxStock = item.product.stockLevel;
                return (
                  <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="py-4 flex gap-4">
                    {/* Thumbnail */}
                    <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover object-center"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                            className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                            title="Remove item"
                            aria-label={`Remove ${item.product.name} from cart`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Variants */}
                        <div className="text-xs text-slate-500 mt-0.5 space-x-2">
                          {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                          {item.selectedColor && <span>· {item.selectedColor}</span>}
                        </div>

                        <div className="text-[11px] text-slate-600 font-mono-numbers mt-0.5">
                          Bin: {item.product.warehouseBin}
                        </div>
                      </div>

                      {/* Quantity Stepper & Price */}
                      <div className="flex items-center justify-between mt-2 pt-1">
                        <div className="flex items-center border border-slate-200 rounded bg-white">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedSize)}
                            className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 text-xs font-mono-numbers font-semibold text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedSize)}
                            disabled={item.quantity >= maxStock}
                            className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-sm font-bold font-mono-numbers text-slate-900">
                          ${(item.product.retailPrice * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <Package className="w-12 h-12 stroke-1 mb-3 text-slate-300" />
                <p className="text-sm font-semibold text-slate-700 mb-1">Your equipment bag is empty</p>
                <p className="text-xs text-slate-500 mb-6">Explore our competition gear to add technical sports equipment.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  Browse Equipment
                </button>
              </div>
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 space-y-4">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono-numbers font-semibold text-slate-900">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="font-mono-numbers">
                    {remainingForFreeShipping === 0 ? 'FREE' : '$12.00'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>Sales Tax (Estimated 8.25%)</span>
                  <span className="font-mono-numbers">${(cartTotal * 0.0825).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span className="font-mono-numbers">
                    ${(cartTotal + (remainingForFreeShipping === 0 ? 0 : 12.00) + (cartTotal * 0.0825)).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>PCI-DSS Level 1 · 256-Bit SSL Encryption</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
