import { CartItem } from "@/types";

export interface ShippingInfo {
  name: string;
  phone: string;
  zipCode: string;
  address: string;
  detail: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingInfo: ShippingInfo;
  paymentMethod: string;
  status: "주문완료" | "배송준비중" | "배송중" | "배송완료";
}

let orders: Order[] = [];
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((fn) => fn());

export const orderStore = {
  getOrders: () => orders,

  place: (order: Omit<Order, "id" | "date" | "status">): Order => {
    const newOrder: Order = {
      ...order,
      id: `ord-${Date.now()}`,
      date: new Date().toLocaleDateString("ko-KR"),
      status: "주문완료",
    };
    orders = [newOrder, ...orders];
    notify();
    return newOrder;
  },

  subscribe: (fn: () => void) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
