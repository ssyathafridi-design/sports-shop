import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { SportCategory } from '../types';
import { X, Plus, PackagePlus, Barcode } from 'lucide-react';

export const NewProductModal: React.FC = () => {
  const { isNewProductModalOpen, setIsNewProductModalOpen, addNewProduct } = useShop();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<SportCategory>('Strength & Gym');
  const [brand, setBrand] = useState('Vanguard Pro Labs');
  const [description, setDescription] = useState('');
  const [retailPrice, setRetailPrice] = useState(89.99);
  const [costPrice, setCostPrice] = useState(38.00);
  const [stockLevel, setStockLevel] = useState(20);
  const [minThreshold, setMinThreshold] = useState(5);
  const [warehouseBin, setWarehouseBin] = useState('Aisle 2 · Shelf C-01');
  const [supplier, setSupplier] = useState('Titan Industrial Strength Gear');
  const [material, setMaterial] = useState('Aircraft-Grade Anodized Alloy');
  const [weight, setWeight] = useState('450g');
  const [warranty, setWarranty] = useState('2-Year Structural Guarantee');

  if (!isNewProductModalOpen) return null;

  // Auto-generate realistic SKU and Barcode
  const generatedSku = `VAN-${category.split(' ')[0].substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
  const generatedBarcode = `849201${Math.floor(100000 + Math.random() * 900000)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addNewProduct({
      sku: generatedSku,
      barcode: generatedBarcode,
      name,
      category,
      brand,
      description: description || `Professional grade ${name.toLowerCase()} designed for championship athletes and training academies.`,
      specifications: {
        weight,
        material,
        warranty,
        origin: 'Portland Tech R&D Facility'
      },
      retailPrice: Number(retailPrice),
      costPrice: Number(costPrice),
      stockLevel: Number(stockLevel),
      minThreshold: Number(minThreshold),
      warehouseBin,
      supplier,
      image: '/src/assets/images/product_gym_kettlebell_1791180906033.jpg',
      rating: 5.0,
      reviewsCount: 1,
      isFeatured: false
    });

    setIsNewProductModalOpen(false);
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
            <PackagePlus className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold font-display uppercase tracking-wide">
              Create New Equipment SKU & Register Stock
            </h3>
          </div>
          <button
            onClick={() => setIsNewProductModalOpen(false)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Equipment Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Apex High-Tensile Agility Ladder (6m)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Sport Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SportCategory)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="Strength & Gym">Strength & Gym</option>
                <option value="Footwear & Spikes">Footwear & Spikes</option>
                <option value="Basketball">Basketball</option>
                <option value="Tennis & Rackets">Tennis & Rackets</option>
                <option value="Soccer & Football">Soccer & Football</option>
                <option value="Apparel & Recovery">Apparel & Recovery</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Manufacturer / Brand</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Unit Cost Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={costPrice}
                onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono-numbers focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Retail Selling Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={retailPrice}
                onChange={(e) => setRetailPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono-numbers focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Initial In-Stock Units</label>
              <input
                type="number"
                min="0"
                required
                value={stockLevel}
                onChange={(e) => setStockLevel(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono-numbers font-bold text-slate-900 focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Low-Stock Reorder Threshold</label>
              <input
                type="number"
                min="1"
                required
                value={minThreshold}
                onChange={(e) => setMinThreshold(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono-numbers focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Warehouse Bin Location</label>
              <input
                type="text"
                required
                value={warehouseBin}
                onChange={(e) => setWarehouseBin(e.target.value)}
                placeholder="Aisle 1 · Shelf B-04"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none font-mono-numbers"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Primary Supplier</label>
              <input
                type="text"
                required
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Primary Material</label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Item Weight</label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none font-mono-numbers"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product design notes, target sport, and performance features..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Auto-Assigned SKU & Barcode Strip */}
          <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between text-xs font-mono-numbers">
            <div>
              <span className="text-slate-500">Auto-Generated SKU: </span>
              <strong className="text-slate-900">{generatedSku}</strong>
            </div>
            <div>
              <span className="text-slate-500">Barcode UPC: </span>
              <strong className="text-slate-900">{generatedBarcode}</strong>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-200 flex gap-2">
            <button
              type="button"
              onClick={() => setIsNewProductModalOpen(false)}
              className="flex-1 py-2.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Register Product & Stock</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
