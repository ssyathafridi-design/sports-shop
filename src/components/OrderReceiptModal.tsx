import React from 'react';
import { useShop } from '../context/ShopContext';
import { 
  CheckCircle2, 
  Printer, 
  ArrowRight, 
  ShieldCheck, 
  Box, 
  Package, 
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

export const OrderReceiptModal: React.FC = () => {
  const { 
    lastOrder, 
    isReceiptOpen, 
    setIsReceiptOpen, 
    setActiveView 
  } = useShop();

  const [copied, setCopied] = React.useState(false);

  if (!isReceiptOpen || !lastOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleGoToInventory = () => {
    setIsReceiptOpen(false);
    setActiveView('inventory');
  };

  const copyTxHash = () => {
    navigator.clipboard.writeText(lastOrder.payment.transactionHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Receipt Header Banner */}
        <div className="bg-slate-900 text-white p-6 sm:p-8 text-center relative">
          <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3 border border-emerald-500/30">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-display text-white mb-1">
            Payment Captured & Verified
          </h2>
          <p className="text-xs text-slate-300">
            Order <span className="font-mono-numbers font-bold text-white">{lastOrder.orderNumber}</span> has been confirmed. Stock was decremented from the warehouse ledger.
          </p>

          <div className="flex items-center justify-center gap-3 text-[11px] font-mono-numbers text-slate-400 mt-4">
            <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              Auth: {lastOrder.payment.authCode}
            </span>
            <span>·</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              3DS2 Verified
            </span>
            <span>·</span>
            <span className="text-emerald-400">
              Card (···{lastOrder.payment.last4})
            </span>
          </div>
        </div>

        {/* Receipt Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Transaction Cryptographic Proof */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5 font-mono-numbers">
            <div className="flex items-center justify-between text-slate-500">
              <span>Security Token</span>
              <span className="text-slate-800 font-semibold">{lastOrder.payment.tokenMask}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Gateway Hash</span>
              <button 
                onClick={copyTxHash}
                className="text-slate-800 hover:text-slate-950 flex items-center gap-1 font-semibold truncate max-w-[260px]"
                title="Copy Transaction Hash"
              >
                <span>{lastOrder.payment.transactionHash}</span>
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
              </button>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>Tracking Number</span>
              <span className="text-blue-600 font-semibold">{lastOrder.trackingNumber}</span>
            </div>
          </div>

          {/* Itemized Order Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Itemized Gear Receipt
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {lastOrder.items.map(item => (
                <div key={`${item.product.id}-${item.selectedSize}`} className="p-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.product.image} 
                      alt="" 
                      className="w-10 h-10 object-cover rounded bg-slate-100 border border-slate-200 shrink-0" 
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="font-semibold text-slate-900">{item.product.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono-numbers">
                        SKU: {item.product.sku} {item.selectedSize ? `· Size ${item.selectedSize}` : ''} · Qty: {item.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="font-bold font-mono-numbers text-slate-900">
                    ${(item.product.retailPrice * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}

              {/* Total Calculation */}
              <div className="p-3.5 bg-slate-50 space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono-numbers font-medium text-slate-900">${lastOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Tax (8.25%)</span>
                  <span className="font-mono-numbers font-medium text-slate-900">${lastOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-mono-numbers font-medium text-slate-900">
                    {lastOrder.shipping === 0 ? 'FREE' : `$${lastOrder.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Amount Charged</span>
                  <span className="font-mono-numbers text-emerald-700">${lastOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery & Dispatch Note */}
          <div className="flex items-start gap-3 p-4 bg-blue-50/60 border border-blue-200/80 rounded-xl text-xs text-blue-900">
            <Package className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Warehouse Fulfillment Triggered</div>
              <p className="text-blue-800 text-[11px] mt-0.5">
                Shipment routing to <strong>{lastOrder.customer.address}, {lastOrder.customer.city} {lastOrder.customer.postalCode}</strong>. Packing slip dispatched to warehouse bin stations.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 border border-slate-200"
            >
              <Printer className="w-4 h-4" />
              <span>Print Official Invoice</span>
            </button>

            {/* Crucial CTA: Let the user immediately view the updated stock ledger */}
            <button
              onClick={handleGoToInventory}
              className="flex-1 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Box className="w-4 h-4 text-emerald-400" />
              <span>Inspect Stock Deduction in Inventory Ledger</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
