import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { MovementType, Product } from '../types';
import { X, Box, AlertTriangle, Check, RefreshCw } from 'lucide-react';

export const AdjustStockModal: React.FC = () => {
  const { productToAdjust, setProductToAdjust, adjustStock } = useShop();

  const [adjustmentType, setAdjustmentType] = useState<MovementType>('RESTOCK');
  const [quantityDelta, setQuantityDelta] = useState<number>(10);
  const [reason, setReason] = useState<string>('Routine supplier restock');
  const [operator, setOperator] = useState<string>('Inventory Lead (Terminal 01)');

  if (!productToAdjust) return null;

  const currentStock = productToAdjust.stockLevel;
  
  // Calculate preview stock
  const effectiveDelta = adjustmentType === 'DAMAGE_WRITE_OFF' 
    ? -Math.abs(quantityDelta)
    : adjustmentType === 'RESTOCK'
    ? Math.abs(quantityDelta)
    : quantityDelta; // For MANUAL_AUDIT or TRANSFER

  const resultingStock = Math.max(0, currentStock + effectiveDelta);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantityDelta === 0) return;

    adjustStock(
      productToAdjust.id,
      effectiveDelta,
      adjustmentType,
      reason,
      operator
    );

    setProductToAdjust(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold font-display uppercase tracking-wide">
              Adjust Inventory Stock Level
            </h3>
          </div>
          <button
            onClick={() => setProductToAdjust(null)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Target Product Summary */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-3">
            <img
              src={productToAdjust.image}
              alt=""
              className="w-12 h-12 object-cover rounded-lg border border-slate-200 bg-white shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-900 truncate text-sm">
                {productToAdjust.name}
              </h4>
              <div className="flex items-center gap-2 text-slate-500 font-mono-numbers mt-0.5">
                <span>SKU: {productToAdjust.sku}</span>
                <span>·</span>
                <span>Bin: {productToAdjust.warehouseBin}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-500 uppercase">Current Stock</div>
              <div className="text-base font-bold font-mono-numbers text-slate-900">
                {currentStock} units
              </div>
            </div>
          </div>

          {/* Adjustment Type Selector */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Adjustment Movement Type</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setAdjustmentType('RESTOCK');
                  setReason('Routine supplier restock shipment received');
                }}
                className={`py-2 px-3 rounded-lg border text-center font-medium transition-all ${
                  adjustmentType === 'RESTOCK'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                + Restock
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdjustmentType('DAMAGE_WRITE_OFF');
                  setReason('Damaged in warehouse / defective return write-off');
                }}
                className={`py-2 px-3 rounded-lg border text-center font-medium transition-all ${
                  adjustmentType === 'DAMAGE_WRITE_OFF'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                - Write-off
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdjustmentType('MANUAL_AUDIT');
                  setReason('Physical warehouse cycle count discrepancy reconciliation');
                }}
                className={`py-2 px-3 rounded-lg border text-center font-medium transition-all ${
                  adjustmentType === 'MANUAL_AUDIT'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Audit / Count
              </button>
            </div>
          </div>

          {/* Quantity Input */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Quantity to {adjustmentType === 'DAMAGE_WRITE_OFF' ? 'Deduct' : 'Add/Adjust'}
            </label>
            <input
              type="number"
              min="1"
              required
              value={quantityDelta}
              onChange={(e) => setQuantityDelta(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-mono-numbers font-semibold focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          {/* Resulting Stock Preview Card */}
          <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between font-mono-numbers text-xs">
            <span className="text-slate-600">Calculated Stock After Entry:</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 line-through">{currentStock}</span>
              <span className="text-slate-400">→</span>
              <span className="font-bold text-sm text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
                {resultingStock} units
              </span>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Reason for Adjustment / Note</label>
            <input
              type="text"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          {/* Operator */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Operator Signature</label>
            <input
              type="text"
              required
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex gap-2">
            <button
              type="button"
              onClick={() => setProductToAdjust(null)}
              className="flex-1 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Commit Stock Change</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
