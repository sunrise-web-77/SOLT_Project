import { CartItem } from "@/types";

type Listener = () => void;

let items: CartItem[] = [];
const listeners = new Set<Listener>();

const notify = () => listeners.forEach((fn) => fn());

export const cartStore = {
  getItems: () => items,
  getCount: () => items.reduce((s, i) => s + i.qty, 0),
  getTotal: () => items.reduce((s, i) => s + i.priceNum * i.qty, 0),
  add: (item: Omit<CartItem, "qty">, qty = 1) => {
    const existing = items.find((i) => i.id === item.id);
    if (existing) {
      existing.qty += qty;
      items = [...items];
    } else {
      items = [...items, { ...item, qty }];
    }
    notify();
  },
  remove: (id: string) => {
    items = items.filter((i) => i.id !== id);
    notify();
  },
  updateQty: (id: string, qty: number) => {
    if (qty <= 0) items = items.filter((i) => i.id !== id);
    else items = items.map((i) => (i.id === id ? { ...i, qty } : i));
    notify();
  },
  clear: () => {
    items = [];
    notify();
  },
  subscribe: (fn: Listener) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
