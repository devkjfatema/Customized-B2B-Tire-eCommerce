import type { Order, SyncLogEntry } from '../types/order';

export const orders: Order[] = [
{
  id: 'PW-1044',
  odooRef: 'S03612',
  customerId: 'c-mototuning',
  createdAt: '2026-09-22T10:14:00',
  lines: [
  { productId: 'p6200-110-90-17', code: 'P6200', name: 'P6200 (110/90-17) 6PR TL', qty: 10, unitBase: 2480.87, tierPct: 4, unitNet: 2381.64, lineTotal: 23816.4 }],

  subtotal: 23816.4,
  itbis: 4286.95,
  total: 28103.35,
  paymentMethod: 'credit',
  paymentStatus: 'scheduled',
  dueDate: '2026-10-22',
  status: 'shipped'
},
{
  id: 'PW-1043',
  odooRef: 'S03605',
  customerId: 'c-cibao',
  createdAt: '2026-09-20T16:40:00',
  lines: [
  { productId: 'p299-350-10', code: 'P299', name: 'P299 (3.50-10) 6PR TL', qty: 50, unitBase: 1339.5, tierPct: 12, unitNet: 1178.76, lineTotal: 58938 }],

  subtotal: 58938,
  itbis: 10608.84,
  total: 69546.84,
  paymentMethod: 'credit',
  paymentStatus: 'scheduled',
  dueDate: '2026-11-04',
  status: 'confirmed'
},
{
  id: 'PW-1040',
  odooRef: null,
  customerId: 'c-bavaro',
  createdAt: '2026-09-18T11:02:00',
  lines: [
  { productId: 'p3100-80-100-21', code: 'P3100', name: 'P3100 (80/100-21) 6PR TT', qty: 6, unitBase: 2745.5, tierPct: 0, unitNet: 2745.5, lineTotal: 16473 }],

  subtotal: 16473,
  itbis: 2965.14,
  total: 19438.14,
  paymentMethod: 'credit',
  paymentStatus: 'scheduled',
  dueDate: null,
  status: 'rejected'
},
{
  id: 'PW-1041',
  odooRef: 'S03591',
  customerId: 'c-mototuning',
  createdAt: '2026-09-02T23:37:00',
  lines: [
  { productId: 'p299-350-10', code: 'P299', name: 'P299 (3.50-10) 6PR TL', qty: 5, unitBase: 1258.29, tierPct: 0, unitNet: 1258.29, lineTotal: 6291.45 },
  { productId: 'p239-90-90-10', code: 'P239', name: 'P239 (90/90-10) 6PR TL', qty: 3, unitBase: 1138.7, tierPct: 0, unitNet: 1138.7, lineTotal: 3416.1 },
  { productId: 'p6184-100-90-17', code: 'P6184', name: 'P6184 (100/90-17) 6PR TL', qty: 2, unitBase: 2231.89, tierPct: 0, unitNet: 2231.89, lineTotal: 4463.78 }],

  subtotal: 14171.33,
  itbis: 2550.84,
  total: 16722.17,
  paymentMethod: 'credit',
  paymentStatus: 'scheduled',
  dueDate: '2026-10-02',
  status: 'delivered'
},
{
  id: 'PW-1038',
  odooRef: 'S03473',
  customerId: 'c-mototuning',
  createdAt: '2026-08-14T09:22:00',
  lines: [
  { productId: 'p257-250-17', code: 'P257', name: 'P257 (2.50-17) 6PR TT', qty: 30, unitBase: 1093.19, tierPct: 8, unitNet: 1005.73, lineTotal: 30171.9 }],

  subtotal: 30171.9,
  itbis: 5430.94,
  total: 35602.84,
  paymentMethod: 'card',
  paymentStatus: 'paid',
  dueDate: null,
  status: 'delivered'
},
{
  id: 'PW-1029',
  odooRef: 'S03361',
  customerId: 'c-mototuning',
  createdAt: '2026-07-08T15:05:00',
  lines: [
  { productId: 'p6120-120-70-17', code: 'P6120', name: 'P6120 (120/70-17) 4PR TL', qty: 4, unitBase: 3051.97, tierPct: 0, unitNet: 3051.97, lineTotal: 12207.88 }],

  subtotal: 12207.88,
  itbis: 2197.42,
  total: 14405.3,
  paymentMethod: 'credit',
  paymentStatus: 'paid',
  dueDate: '2026-08-07',
  status: 'delivered'
}];


export const syncLog: SyncLogEntry[] = [
{ id: 'l-9', entity: 'inventory', level: 'ok', message: 'Inventario actualizado: 10 productos, 2 cambios de existencia.', at: '2026-09-27T08:45:00' },
{ id: 'l-8', entity: 'prices', level: 'ok', message: 'Listas de precio sincronizadas (Distribuidor, Mayorista, Taller).', at: '2026-09-27T08:30:00' },
{ id: 'l-7', entity: 'customers', level: 'warning', message: 'RNC 1-01-88234-1 coincide con 2 contactos en Odoo. Se vinculó el contacto principal; revisar duplicado.', at: '2026-09-27T07:10:00' },
{ id: 'l-6', entity: 'orders', level: 'ok', message: 'Pedido PW-1044 creado en Odoo como S03612.', at: '2026-09-22T10:14:08' },
{ id: 'l-5', entity: 'orders', level: 'error', message: 'Pedido PW-1040 rechazado: P3100 sin existencia en Odoo al confirmar. No se generó cobro.', at: '2026-09-18T11:02:05' },
{ id: 'l-4', entity: 'prices', level: 'warning', message: 'Precio enviado por la app (RD$ 2,745.50) no coincide con Odoo; se recalculó antes de confirmar.', at: '2026-09-18T11:02:03' },
{ id: 'l-3', entity: 'products', level: 'ok', message: 'Catálogo sincronizado: 10 productos activos, 10 con foto.', at: '2026-09-27T06:00:00' }];