import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  Box, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  Download, 
  Plus, 
  RefreshCw, 
  FileText, 
  Search, 
  CheckCircle2, 
  ArrowUpRight, 
  Barcode, 
  Layers,
  Truck,
  RotateCcw
} from 'lucide-react';
import { Product } from '../types';

export const InventoryDashboard: React.FC = () => {
  const { 
    products, 
    stockMovements, 
    purchaseOrders,
    setProductToAdjust, 
    setIsNewProductModalOpen, 
    setIsPoModalOpen,
    receivePurchaseOrder,
    exportInventoryCSV,
    resetDemoData
  } = useShop();

  const [activeTab, setActiveTab] = useState<'ledger' | 'movements' | 'purchase_orders'>('ledger');
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<'all' | 'low' | 'out' | 'healthy'>('all');

  // KPI Calculations
  const totalStockUnits = products.reduce((sum, p) => sum + p.stockLevel, 0);
  const totalAssetValue = products.reduce((sum, p) => sum + (p.stockLevel * p.costPrice), 0);
  const totalRetailValue = products.reduce((sum, p) => sum + (p.stockLevel * p.retailPrice), 0);
  const lowStockProducts = products.filter(p => p.stockLevel <= p.minThreshold && p.stockLevel > 0);
  const outOfStockProducts = products.filter(p => p.stockLevel === 0);
  const avgMargin = products.length > 0
    ? (products.reduce((acc, p) => acc + ((p.retailPrice - p.costPrice) / p.retailPrice), 0) / products.length) * 100
    : 0;

  // Filtered Ledger Rows
  const filteredProducts = products.filter(p => {
    // Search
    if (ledgerSearch.trim()) {
      const q = ledgerSearch.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchBarcode = p.barcode.includes(q);
      const matchBin = p.warehouseBin.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchBarcode && !matchBin) return false;
    }
    // Category
    if (filterCategory !== 'All' && p.category !== filterCategory) return false;
    // Status
    if (filterStatus === 'low' && (p.stockLevel > p.minThreshold || p.stockLevel === 0)) return false;
    if (filterStatus === 'out' && p.stockLevel > 0) return false;
    if (filterStatus === 'healthy' && p.stockLevel <= p.minThreshold) return false;

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* SaaS Dashboard Top Bar Contract: Breadcrumb + Action Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Operations</span>
            <span aria-hidden="true">/</span>
            <span>Central Warehouse</span>
            <span aria-hidden="true">/</span>
            <span className="text-slate-900 font-bold">Inventory & Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Real-Time Inventory Management System
          </h1>
        </div>

        {/* Global Toolbar Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={resetDemoData}
            title="Reset catalog & orders to default state"
            className="px-3 py-2 text-xs font-medium text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Demo</span>
          </button>

          <button
            onClick={exportInventoryCSV}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsPoModalOpen(true)}
            className="px-3 py-2 text-xs font-semibold text-slate-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-amber-700" />
            <span>Generate Reorder PO</span>
          </button>

          <button
            onClick={() => setIsNewProductModalOpen(true)}
            className="px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>+ New SKU Onboarding</span>
          </button>
        </div>
      </div>

      {/* KPI Cards: High-Density Structured Metrics (No Pill Clutter) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-slate-600">Inventory Asset Value</span>
            <Box className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono-numbers text-slate-900">
            ${totalAssetValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-500 mt-1.5 font-mono-numbers">
            Retail potential: ${totalRetailValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-slate-600">Physical Stock Units</span>
            <Package className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold font-mono-numbers text-slate-900">
            {totalStockUnits} <span className="text-sm font-normal text-slate-500">Units</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1.5">
            Distributed across {products.length} distinct active SKUs
          </div>
        </div>

        {/* Metric 3: Low-Stock Alerts */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-slate-600">Replenishment Alerts</span>
            <AlertTriangle className={`w-4 h-4 ${lowStockProducts.length + outOfStockProducts.length > 0 ? 'text-amber-500' : 'text-slate-400'}`} />
          </div>
          <div className="text-2xl font-bold font-mono-numbers text-slate-900 flex items-baseline gap-2">
            <span>{lowStockProducts.length + outOfStockProducts.length}</span>
            <span className="text-xs font-normal text-slate-500">
              ({outOfStockProducts.length} depleted)
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1.5 font-mono-numbers">
            {lowStockProducts.length > 0 ? 'Action required: PO auto-queued' : 'Stock levels within safe tolerance'}
          </div>
        </div>

        {/* Metric 4: Gross Margin */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold uppercase tracking-wider text-slate-600">Average Gross Margin</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono-numbers text-slate-900">
            {avgMargin.toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1.5">
            Target benchmark: &gt; 50.0% markup
          </div>
        </div>

      </div>

      {/* Active Low-Stock Reorder Callout Banner (Adjacency to action) */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-amber-900">
                Replenishment Threshold Reached ({lowStockProducts.length + outOfStockProducts.length} items)
              </div>
              <div className="text-amber-800 text-[11px] mt-0.5">
                {lowStockProducts.map(p => p.name.split(' ')[0]).join(', ')} are at or below minimum warehouse safety stock.
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsPoModalOpen(true)}
            className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap self-start sm:self-auto"
          >
            Review & Issue Supplier Restock PO
          </button>
        </div>
      )}

      {/* Primary Sub-Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center space-x-6 text-sm">
          <button
            onClick={() => setActiveTab('ledger')}
            className={`py-3 font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'ledger'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Master Stock Ledger</span>
            <span className="font-mono-numbers text-xs bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-normal">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('movements')}
            className={`py-3 font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'movements'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Stock Audit Movements</span>
            <span className="font-mono-numbers text-xs bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-normal">
              {stockMovements.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('purchase_orders')}
            className={`py-3 font-semibold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'purchase_orders'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Supplier Purchase Orders</span>
            <span className="font-mono-numbers text-xs bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-normal">
              {purchaseOrders.length}
            </span>
          </button>
        </div>
      </div>

      {/* TAB 1: MASTER STOCK LEDGER */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          
          {/* Table Filters & Barcode Scan Bar */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={ledgerSearch}
                onChange={(e) => setLedgerSearch(e.target.value)}
                placeholder="Lookup SKU, barcode UPC, equipment name, or aisle bin location..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              {/* Category Filter */}
              <div className="flex items-center gap-1 text-slate-600">
                <span className="font-medium whitespace-nowrap">Sport:</span>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded px-2 py-1 font-medium text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Sports</option>
                  <option value="Footwear & Spikes">Footwear</option>
                  <option value="Basketball">Basketball</option>
                  <option value="Tennis & Rackets">Tennis</option>
                  <option value="Strength & Gym">Strength</option>
                  <option value="Soccer & Football">Soccer</option>
                  <option value="Apparel & Recovery">Apparel</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 text-slate-600">
                <span className="font-medium whitespace-nowrap">Status:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 rounded px-2 py-1 font-medium text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Levels</option>
                  <option value="healthy">Healthy Stock</option>
                  <option value="low">Low Stock Alerts</option>
                  <option value="out">Depleted / Zero</option>
                </select>
              </div>
            </div>
          </div>

          {/* High-Density Data Grid */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">SKU / Barcode</th>
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4">Location Bin</th>
                    <th className="py-3 px-4 text-right">Cost</th>
                    <th className="py-3 px-4 text-right">Retail</th>
                    <th className="py-3 px-4 text-right">Margin</th>
                    <th className="py-3 px-4 text-right">In Stock</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Ledger Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(p => {
                      const isLow = p.stockLevel > 0 && p.stockLevel <= p.minThreshold;
                      const isOut = p.stockLevel === 0;
                      const margin = ((p.retailPrice - p.costPrice) / p.retailPrice) * 100;

                      return (
                        <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                          {/* SKU & Barcode */}
                          <td className="py-3 px-4 font-mono-numbers">
                            <div className="font-semibold text-slate-900">{p.sku}</div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Barcode className="w-3 h-3 text-slate-400" />
                              <span>{p.barcode}</span>
                            </div>
                          </td>

                          {/* Product Name */}
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900 max-w-xs truncate">
                              {p.name}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {p.category} · {p.brand}
                            </div>
                          </td>

                          {/* Warehouse Location */}
                          <td className="py-3 px-4 font-mono-numbers text-slate-700 whitespace-nowrap">
                            {p.warehouseBin}
                          </td>

                          {/* Cost */}
                          <td className="py-3 px-4 text-right font-mono-numbers text-slate-600">
                            ${p.costPrice.toFixed(2)}
                          </td>

                          {/* Retail */}
                          <td className="py-3 px-4 text-right font-mono-numbers font-semibold text-slate-900">
                            ${p.retailPrice.toFixed(2)}
                          </td>

                          {/* Margin */}
                          <td className="py-3 px-4 text-right font-mono-numbers text-slate-600">
                            {margin.toFixed(0)}%
                          </td>

                          {/* In Stock */}
                          <td className="py-3 px-4 text-right font-mono-numbers font-bold">
                            <span className={isOut ? 'text-rose-600' : isLow ? 'text-amber-700' : 'text-slate-900'}>
                              {p.stockLevel}
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal ml-1">
                              / {p.minThreshold} min
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4 text-center">
                            {isOut ? (
                              <span className="font-mono-numbers text-[11px] text-rose-700 font-semibold">
                                Depleted
                              </span>
                            ) : isLow ? (
                              <span className="font-mono-numbers text-[11px] text-amber-700 font-semibold flex items-center justify-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-amber-600 inline" />
                                Low Alert
                              </span>
                            ) : (
                              <span className="font-mono-numbers text-[11px] text-emerald-700 font-medium">
                                Nominal
                              </span>
                            )}
                          </td>

                          {/* Action */}
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setProductToAdjust(p)}
                              className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors inline-flex items-center gap-1"
                            >
                              <RefreshCw className="w-3 h-3 text-slate-500" />
                              <span>Adjust</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400">
                        No equipment SKUs matching current search or filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT LEDGER & STOCK MOVEMENTS */}
      {activeTab === 'movements' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between text-xs">
            <div>
              <h3 className="font-bold text-slate-900">Chronological Inventory Movement Audit Trail</h3>
              <p className="text-slate-500">Immutable ledger recording every customer sale deduction, inbound shipment, and manual cycle audit.</p>
            </div>
            <div className="font-mono-numbers text-slate-500">
              Total Recorded Logs: {stockMovements.length}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Movement Type</th>
                  <th className="py-3 px-4">Product / SKU</th>
                  <th className="py-3 px-4 text-right">Qty Delta</th>
                  <th className="py-3 px-4 text-right">Prev → New</th>
                  <th className="py-3 px-4">Reason / Order Ref</th>
                  <th className="py-3 px-4">Authorized Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stockMovements.map(m => {
                  const isNegative = m.quantityDelta < 0;
                  return (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono-numbers text-slate-500 whitespace-nowrap">
                        {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} · {new Date(m.timestamp).toLocaleDateString()}
                      </td>

                      <td className="py-3 px-4 font-mono-numbers font-semibold">
                        <span className={
                          m.type === 'SALE' 
                            ? 'text-blue-700' 
                            : m.type === 'RESTOCK' 
                            ? 'text-emerald-700' 
                            : 'text-amber-700'
                        }>
                          {m.type}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 truncate max-w-xs">{m.productName}</div>
                        <div className="font-mono-numbers text-[11px] text-slate-400">{m.sku}</div>
                      </td>

                      <td className={`py-3 px-4 text-right font-mono-numbers font-bold ${
                        isNegative ? 'text-rose-600' : 'text-emerald-600'
                      }`}>
                        {isNegative ? '' : '+'}{m.quantityDelta}
                      </td>

                      <td className="py-3 px-4 text-right font-mono-numbers text-slate-600">
                        {m.previousStock} → <strong className="text-slate-900">{m.newStock}</strong>
                      </td>

                      <td className="py-3 px-4 text-slate-700">
                        {m.reason}
                        {m.referenceId && (
                          <span className="ml-1.5 font-mono-numbers text-[10px] text-blue-600 font-semibold">
                            [{m.referenceId}]
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 font-mono-numbers text-slate-500">
                        {m.operator}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PURCHASE ORDERS (POs) */}
      {activeTab === 'purchase_orders' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <h3 className="font-bold text-slate-900">Procurement & Replenishment Orders</h3>
              <p className="text-slate-500">Inbound purchase orders issued to manufacturers and wholesale distributors.</p>
            </div>
            <button
              onClick={() => setIsPoModalOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Issue New PO</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">PO Number</th>
                    <th className="py-3 px-4">Issued Date</th>
                    <th className="py-3 px-4">Supplier</th>
                    <th className="py-3 px-4">Line Items</th>
                    <th className="py-3 px-4 text-right">Total Outlay</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Dock Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {purchaseOrders.map(po => {
                    const isReceived = po.status === 'RECEIVED';

                    return (
                      <tr key={po.poNumber} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono-numbers font-bold text-slate-900">
                          {po.poNumber}
                        </td>

                        <td className="py-3 px-4 font-mono-numbers text-slate-500">
                          {new Date(po.date).toLocaleDateString()}
                        </td>

                        <td className="py-3 px-4 font-medium text-slate-900">
                          {po.supplier}
                        </td>

                        <td className="py-3 px-4 text-slate-600">
                          {po.items.map(i => `${i.productName} (${i.quantity} units)`).join(', ')}
                        </td>

                        <td className="py-3 px-4 text-right font-mono-numbers font-bold text-slate-900">
                          ${po.totalCost.toFixed(2)}
                        </td>

                        <td className="py-3 px-4 text-center">
                          {isReceived ? (
                            <span className="font-mono-numbers text-xs text-emerald-700 font-semibold flex items-center justify-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Received & Stocked
                            </span>
                          ) : (
                            <span className="font-mono-numbers text-xs text-amber-700 font-semibold">
                              Inbound Transit
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          {isReceived ? (
                            <span className="text-slate-400 font-mono-numbers text-[11px]">Stocked</span>
                          ) : (
                            <button
                              onClick={() => receivePurchaseOrder(po.poNumber)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded transition-colors shadow-xs"
                            >
                              Receive Goods Into Stock
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
