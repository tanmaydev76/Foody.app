'use client';

import { useState } from 'react';
import { X, Flame, Plus } from 'lucide-react';
import { FoodItem } from '@/context/CartContext';

export interface Customization {
  spiceLevel: string;
  addOns: { name: string; price: number }[];
}

interface Props {
  item: FoodItem;
  onAdd: (item: FoodItem, customization: Customization) => void;
  onClose: () => void;
}

const SPICE_LEVELS = [
  { label: 'Mild',        emoji: '🌿' },
  { label: 'Medium',      emoji: '🌶️' },
  { label: 'Spicy',       emoji: '🌶️🌶️' },
  { label: 'Extra Spicy', emoji: '🔥' },
];

const ADD_ONS = [
  { name: 'Extra Cheese',  price: 30 },
  { name: 'Extra Sauce',   price: 15 },
  { name: 'Extra Portion', price: 40 },
  { name: 'Garlic Bread',  price: 25 },
];

export default function CustomizeModal({ item, onAdd, onClose }: Props) {
  const [spiceLevel, setSpiceLevel] = useState('Medium');
  const [selected, setSelected]     = useState<{ name: string; price: number }[]>([]);

  const toggleAddOn = (a: { name: string; price: number }) => {
    setSelected((prev) =>
      prev.find((x) => x.name === a.name) ? prev.filter((x) => x.name !== a.name) : [...prev, a]
    );
  };

  const addOnTotal = selected.reduce((s, a) => s + a.price, 0);

  const handleAdd = () => {
    onAdd(
      { ...item, price: item.price + addOnTotal },
      { spiceLevel, addOns: selected }
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center px-0 sm:px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-base rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-sm p-6 flex flex-col gap-5 animate-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-fg">
          <X size={18} />
        </button>

        <div>
          <h2 className="text-lg font-extrabold pr-6">{item.name}</h2>
          <p className="text-muted text-sm mt-0.5">Customise your order</p>
        </div>

        {/* Spice level */}
        <div>
          <p className="text-sm font-semibold mb-2 flex items-center gap-1.5"><Flame size={14} className="text-orange-500" /> Spice Level</p>
          <div className="grid grid-cols-2 gap-2">
            {SPICE_LEVELS.map((s) => (
              <button
                key={s.label}
                onClick={() => setSpiceLevel(s.label)}
                className={`px-3 py-2 rounded-xl border text-sm font-medium transition-colors text-left flex items-center gap-2 ${spiceLevel === s.label ? 'border-primary bg-primary/10 text-primary' : 'border-base hover:border-primary'}`}
              >
                <span>{s.emoji}</span> {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Add-ons */}
        <div>
          <p className="text-sm font-semibold mb-2 flex items-center gap-1.5"><Plus size={14} className="text-green-500" /> Add-ons</p>
          <div className="space-y-2">
            {ADD_ONS.map((a) => {
              const active = !!selected.find((x) => x.name === a.name);
              return (
                <button
                  key={a.name}
                  onClick={() => toggleAddOn(a)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm transition-colors ${active ? 'border-primary bg-primary/10' : 'border-base hover:border-primary'}`}
                >
                  <span className={`font-medium ${active ? 'text-primary' : ''}`}>{a.name}</span>
                  <span className={`font-semibold ${active ? 'text-primary' : 'text-muted'}`}>+ ₹{a.price}</span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleAdd}
          className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl text-sm transition-colors"
        >
          Add to Cart · ₹{item.price + addOnTotal}
        </button>
      </div>
    </div>
  );
}
