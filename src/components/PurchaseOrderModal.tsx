import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, FileText, Send, AlertTriangle, Check, Plus, Trash2 } from 'lucide-react';

export const PurchaseOrderModal: React.FC = () => {
  const { 
    isPoModalOpen, 
    setIsPoModalOpen, 
    products, 
    createPurchaseOrder 
  } = useShop();

  // Find products that are below or equal to threshold
  const lowStockItems = products.filter(p => p.stockLevel <= p.minThreshold);

  // Initial order items
  const [selectedSupplier, setSelectedSupplier] = useState<string>(() => {
    return lowStockItems.length > 0 ? lowStockItems[0].supplier : 'Apex Athletic Equipment Inc';
  });

  const [poItems, setPoItems] = useState<{ productId: string; quantity: number }[]>(() => {
    if (lowStockItems.length > 0) {
      return lowStockItems.map(p => ({
        productId: p.id,
        quantity: Math.max(10, (p.minThreshold * 3) - p.stockLevel)
      }));
    }
    return products.slice(0, 2).map(p => ({ productId: p.id, quantity: 15 }));
  });

  if (!isPoModalOpen) return null;

  const handleQuantityChange = (productId: string, qty: number) => {
    setPoItems(prev => prev.map(item => {
      if (item.productId === productId) {
        return { ...item, quantity: Math.max(1, qty) };
      }
      return item;
    }));
  };

  const handleRemoveItem = (productId: string) => {
    setPoItems(prev => prev.filter(item => item.productId !== productId));
  };

  const calculateTotal = () => {
    return poItems.reduce((acc, item) => {
      const p = products.find(prod => prod.id === item.productId);
      const cost = p ? p.costPrice : 0;
      return acc + (cost * item.quantity);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (poItems.length === 0) return;

    createPurchaseOrder(selectedSupplier, poItems);
    setIsPoModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold font-display uppercase tracking-wide">
              Procurement & Supplier Purchase Order (PO)
            </h3>
          </div>
          <button
            onClick={() => setIsPoModalOpen(false)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Select Supplier</label>
            <input
              type="text"
              required
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          {/* Reorder Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-800">Items to Reorder & Replenish</span>
              <span className="text-slate-500 font-mono-numbers">{poItems.length} line items</span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {poItems.length > 0 ? (
                poItems.map(item => {
                  const p = products.find(prod => prod.id === item.productId);
                  if (!p) return null;
                  const lineTotal = p.costPrice * item.quantity;

                  return (
                    <div key={item.productId} className="p-3 bg-white flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={p.image}
                          alt=""
                          className="w-9 h-9 object-cover rounded bg-slate-100 border border-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate">{p.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono-numbers flex items-center gap-1.5">
                            <span>SKU: {p.sku}</span>
                            <span>·</span>
                            <span className={p.stockLevel <= p.minThreshold ? 'text-amber-700 font-semibold' : ''}>
                              In Stock: {p.stockLevel} (Min: {p.minThreshold})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-[10px] text-slate-400">Unit Cost</div>
                          <div className="font-mono-numbers font-medium text-slate-700">${p.costPrice.toFixed(2)}</div>
                        </div>

                        <div className="w-20">
                          <label className="text-[10px] text-slate-400 block text-center">Order Qty</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value) || 1)}
                            className="w-full text-center px-2 py-1 bg-slate-50 border border-slate-200 rounded font-mono-numbers font-bold text-slate-900"
                          />
                        </div>

                        <div className="w-20 text-right">
                          <div className="text-[10px] text-slate-400">Line Total</div>
                          <div className="font-mono-numbers font-bold text-slate-900">${lineTotal.toFixed(2)}</div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.productId)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-slate-400">
                  No items in purchase order.
                </div>
              )}
            </div>
          </div>

          {/* PO Financial Summary Strip */}
          <div className="bg-slate-100 p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-mono-numbers">
            <div>
              <span className="text-slate-600">Expected Lead Time: </span>
              <strong className="text-slate-900">3-5 Business Days</strong>
            </div>
            <div>
              <span className="text-slate-600">Total Capital Outlay: </span>
              <strong className="text-base text-slate-900">${calculateTotal().toFixed(2)}</strong>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-slate-200 flex gap-2">
            <button
              type="button"
              onClick={() => setIsPoModalOpen(false)}
              className="flex-1 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={poItems.length === 0}
              className="flex-1 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <Send className="w-4 h-4 text-emerald-400" />
              <span>Issue PO & Dispatch to Supplier</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
