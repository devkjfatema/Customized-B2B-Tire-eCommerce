import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { addDays, format } from 'date-fns';
import { products as seedProducts } from '../data/products';
import { customers as seedCustomers, termRequests as seedRequests } from '../data/customers';
import { orders as seedOrders, syncLog as seedLog } from '../data/orders';
import { buildLine, totals } from '../utils/pricing';
import type { Product } from '../types/catalog';
import type { Customer, TermRequest } from '../types/customer';
import type { CartItem, Order, PaymentMethod, SyncEntity, SyncLogEntry } from '../types/order';

type PlaceOrderResult = {ok: true;order: Order;} | {ok: false;reason: 'stock' | 'credit' | 'card' | 'empty';};

type StoreValue = {
  products: Product[];
  customers: Customer[];
  orders: Order[];
  requests: TermRequest[];
  syncLog: SyncLogEntry[];
  lastSync: Record<SyncEntity, string>;
  syncing: boolean;
  cart: CartItem[];
  currentCustomer: Customer | null;
  login: (customerId: string) => void;
  logout: () => void;
  setCartQty: (productId: string, qty: number) => void;
  addToCart: (productId: string, qty: number) => void;
  clearCart: () => void;
  placeOrder: (method: PaymentMethod) => PlaceOrderResult;
  updateCustomer: (id: string, patch: Partial<Customer>) => void;
  createRequest: (req: Omit<TermRequest, 'id' | 'createdAt' | 'status'>) => void;
  resolveRequest: (id: string, approve: boolean) => void;
  runSync: () => Promise<void>;
};

const StoreContext = createContext<StoreValue | null>(null);

const INITIAL_SYNC: Record<SyncEntity, string> = {
  products: '2026-09-27T06:00:00',
  inventory: '2026-09-27T08:45:00',
  prices: '2026-09-27T08:30:00',
  customers: '2026-09-27T07:10:00',
  orders: '2026-09-22T10:14:08'
};

export function StoreProvider({ children }: {children: React.ReactNode;}) {
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [customers, setCustomers] = useState<Customer[]>(seedCustomers);
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const [requests, setRequests] = useState<TermRequest[]>(seedRequests);
  const [syncLog, setSyncLog] = useState<SyncLogEntry[]>(seedLog);
  const [lastSync, setLastSync] = useState(INITIAL_SYNC);
  const [syncing, setSyncing] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([
  { productId: 'p299-350-10', qty: 8 },
  { productId: 'p257-250-17', qty: 20 }]
  );
  const [currentCustomerId, setCurrentCustomerId] = useState<string | null>('c-mototuning');

  const currentCustomer = customers.find((c) => c.id === currentCustomerId) ?? null;

  const pushLog = useCallback((entry: Omit<SyncLogEntry, 'id' | 'at'>) => {
    setSyncLog((prev) => [{ ...entry, id: `l-${Date.now()}-${Math.random()}`, at: new Date().toISOString() }, ...prev]);
  }, []);

  const setCartQty = useCallback((productId: string, qty: number) => {
    setCart((prev) => {
      if (qty <= 0) return prev.filter((i) => i.productId !== productId);
      const exists = prev.some((i) => i.productId === productId);
      return exists ? prev.map((i) => i.productId === productId ? { ...i, qty } : i) : [...prev, { productId, qty }];
    });
  }, []);

  const addToCart = useCallback((productId: string, qty: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) return prev.map((i) => i.productId === productId ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { productId, qty }];
    });
  }, []);

  const placeOrder = useCallback(
    (method: PaymentMethod): PlaceOrderResult => {
      if (!currentCustomer || cart.length === 0) return { ok: false, reason: 'empty' };
      const lines = cart.map((item) => {
        const product = products.find((p) => p.id === item.productId)!;
        return buildLine(product, currentCustomer, item.qty);
      });
      const hasStock = cart.every((item) => {
        const product = products.find((p) => p.id === item.productId);
        return product && product.stock >= item.qty;
      });
      if (!hasStock) return { ok: false, reason: 'stock' };
      const sum = totals(lines);
      if (method === 'credit') {
        if (currentCustomer.paymentTerm === 0 || currentCustomer.balance + sum.total > currentCustomer.creditLimit) {
          return { ok: false, reason: 'credit' };
        }
        if (!currentCustomer.card || currentCustomer.card.tokenStatus !== 'active') return { ok: false, reason: 'card' };
      }

      const seq = 1046 + orders.filter((o) => o.id.startsWith('PW-') && Number(o.id.slice(3)) >= 1046).length;
      const order: Order = {
        id: `PW-${seq}`,
        odooRef: null,
        customerId: currentCustomer.id,
        createdAt: new Date().toISOString(),
        lines,
        subtotal: sum.subtotal,
        itbis: sum.itbis,
        total: sum.total,
        paymentMethod: method,
        paymentStatus: method === 'card' ? 'paid' : 'scheduled',
        dueDate: method === 'credit' ? format(addDays(new Date(), currentCustomer.paymentTerm), 'yyyy-MM-dd') : null,
        status: 'syncing'
      };

      setOrders((prev) => [order, ...prev]);
      setProducts((prev) =>
      prev.map((p) => {
        const item = cart.find((i) => i.productId === p.id);
        return item ? { ...p, stock: p.stock - item.qty } : p;
      })
      );
      if (method === 'credit') {
        setCustomers((prev) => prev.map((c) => c.id === currentCustomer.id ? { ...c, balance: c.balance + sum.total } : c));
      }
      setCart([]);

      window.setTimeout(() => {
        const odooRef = `S0${3620 + (seq - 1045)}`;
        setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, status: 'confirmed', odooRef } : o));
        setLastSync((prev) => ({ ...prev, orders: new Date().toISOString() }));
        pushLog({ entity: 'orders', level: 'ok', message: `Pedido ${order.id} creado en Odoo como ${odooRef}. Precios validados.` });
      }, 2200);

      return { ok: true, order };
    },
    [cart, currentCustomer, orders, products, pushLog]
  );

  const updateCustomer = useCallback((id: string, patch: Partial<Customer>) => {
    setCustomers((prev) => prev.map((c) => c.id === id ? { ...c, ...patch } : c));
  }, []);

  const createRequest = useCallback((req: Omit<TermRequest, 'id' | 'createdAt' | 'status'>) => {
    setRequests((prev) => [
    { ...req, id: `rq-${Date.now()}`, createdAt: new Date().toISOString(), status: 'pending' },
    ...prev]
    );
  }, []);

  const resolveRequest = useCallback(
    (id: string, approve: boolean) => {
      const req = requests.find((r) => r.id === id);
      if (!req) return;
      setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: approve ? 'approved' : 'rejected' } : r));
      if (approve) {
        if (req.kind === 'term' && req.requestedTerm !== null) {
          updateCustomer(req.customerId, { paymentTerm: req.requestedTerm, termApprovedBy: 'Diverlys Ortega' });
        }
        if (req.kind === 'discount' && req.requestedDiscountPct !== null) {
          updateCustomer(req.customerId, { extraDiscountPct: req.requestedDiscountPct });
        }
      }
    },
    [requests, updateCustomer]
  );

  const runSync = useCallback(async () => {
    setSyncing(true);
    await new Promise((r) => window.setTimeout(r, 1600));
    const now = new Date().toISOString();
    setLastSync({ products: now, inventory: now, prices: now, customers: now, orders: now });
    pushLog({ entity: 'inventory', level: 'ok', message: 'Sincronización manual completada: catálogo, inventario, precios y clientes al día.' });
    setSyncing(false);
  }, [pushLog]);

  const value = useMemo<StoreValue>(
    () => ({
      products,
      customers,
      orders,
      requests,
      syncLog,
      lastSync,
      syncing,
      cart,
      currentCustomer,
      login: setCurrentCustomerId,
      logout: () => setCurrentCustomerId(null),
      setCartQty,
      addToCart,
      clearCart: () => setCart([]),
      placeOrder,
      updateCustomer,
      createRequest,
      resolveRequest,
      runSync
    }),
    [products, customers, orders, requests, syncLog, lastSync, syncing, cart, currentCustomer, setCartQty, addToCart, placeOrder, updateCustomer, createRequest, resolveRequest, runSync]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}