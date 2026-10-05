import React from 'react';
import { useShop } from '../context/ShopContext';
import { 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ShieldCheck, 
  ArrowRight,
  Printer
} from 'lucide-react';
import { Order } from '../types';

export const OrdersLedger: React.FC = () => {
  const { orders, setLastOrder, setIsReceiptOpen, setActiveView } = useShop();

  const handleViewReceipt = (order: Order) => {
    setLastOrder(order);
    setIsReceiptOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Accounting & Settlement
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Captured Orders & Digital Invoices
          </h1>
        </div>

        <button
          onClick={() => setActiveView('storefront')}
          className="px-4 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors self-start sm:self-auto"
        >
          Return to Storefront
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map(order => (
            <div 
              key={order.id} 
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base font-mono-numbers text-slate-900">
                        {order.orderNumber}
                      </span>
                      <span className="font-mono-numbers text-xs text-slate-500">
                        · {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600">
                      Customer: <strong className="text-slate-800">{order.customer.fullName}</strong> ({order.customer.email})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Captured Amount</div>
                    <div className="text-lg font-bold font-mono-numbers text-slate-900">
                      ${order.total.toFixed(2)}
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewReceipt(order)}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-600" />
                    <span>View Invoice</span>
                  </button>
                </div>
              </div>

              {/* Items and Settlement Details */}
              <div className="pt-4 grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                
                {/* Ordered Items (7 cols) */}
                <div className="md:col-span-7 space-y-2">
                  <div className="font-semibold text-slate-700 uppercase text-[10px] tracking-wider">
                    Purchased Equipment ({order.items.length} line items)
                  </div>
                  <div className="divide-y divide-slate-100">
                    {order.items.map(item => (
                      <div key={`${item.product.id}-${item.selectedSize}`} className="py-1.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={item.product.image}
                            alt=""
                            className="w-8 h-8 rounded object-cover border border-slate-200"
                            referrerPolicy="no-referrer"
                          />
                          <span className="font-medium text-slate-800">{item.product.name}</span>
                          <span className="text-slate-500 font-mono-numbers">
                            x{item.quantity} {item.selectedSize ? `(${item.selectedSize})` : ''}
                          </span>
                        </div>
                        <span className="font-mono-numbers text-slate-900 font-medium">
                          ${(item.product.retailPrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gateway Audit Details (5 cols) */}
                <div className="md:col-span-5 bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1 font-mono-numbers text-[11px]">
                  <div className="text-slate-500 uppercase text-[10px] font-sans font-bold mb-1">
                    Gateway Settlement Cryptography
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Payment Method:</span>
                    <span className="font-semibold uppercase text-slate-800">
                      {order.payment.cardBrand || order.payment.method} (···{order.payment.last4 || '8921'})
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Token Identifier:</span>
                    <span className="text-slate-800 truncate max-w-[170px]" title={order.payment.tokenMask}>
                      {order.payment.tokenMask}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Gateway Hash:</span>
                    <span className="text-slate-800 truncate max-w-[170px]" title={order.payment.transactionHash}>
                      {order.payment.transactionHash}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tracking Number:</span>
                    <span className="font-bold text-blue-600">{order.trackingNumber}</span>
                  </div>
                </div>

              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
            <FileText className="w-12 h-12 stroke-1 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-semibold text-slate-700 mb-1">No orders captured yet</p>
            <p className="text-xs text-slate-500 mb-4">Complete a checkout through the secure payment gateway to generate customer invoices.</p>
            <button
              onClick={() => setActiveView('storefront')}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Browse Equipment
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
