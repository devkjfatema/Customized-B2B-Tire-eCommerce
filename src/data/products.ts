import type { Product } from '../types/catalog';

const IMG = {
  street: "/b7e8eccd-6da0-4e6e-b619-623c79db4ae6.jpg",
  scooter: "/3079a2e1-bb3a-4227-b325-e0dbca0f3b50.jpg",
  classic: "/ed1a4d96-2f0e-45f4-a581-62278318e5c6.jpg",
  offroad: "/3ddac44f-17e4-49a8-8c60-c7a5937bfd03.jpg",
  auto: "/4a585f52-b73c-4be8-b124-87d5c4b90dc8.jpg"
};

const MOTO_TIERS = [
{ minQty: 1, discountPct: 0 },
{ minQty: 10, discountPct: 4 },
{ minQty: 25, discountPct: 8 },
{ minQty: 50, discountPct: 12 }];


const AUTO_TIERS = [
{ minQty: 1, discountPct: 0 },
{ minQty: 4, discountPct: 3 },
{ minQty: 12, discountPct: 6 }];


export const products: Product[] = [
{
  id: 'p299-350-10',
  odooId: 4121,
  code: 'P299',
  size: '3.50-10',
  ply: '6PR',
  construction: 'TL',
  category: 'scooter',
  brand: 'MBTP Pro',
  name: 'P299 (3.50-10) 6PR TL',
  description:
  'Neumático sin cámara para scooters y motos de reparto. Compuesto de alta duración pensado para uso urbano diario y cargas pesadas.',
  image: IMG.scooter,
  stock: 148,
  basePrice: 1410,
  tiers: MOTO_TIERS
},
{
  id: 'p239-90-90-10',
  odooId: 4118,
  code: 'P239',
  size: '90/90-10',
  ply: '6PR',
  construction: 'TL',
  category: 'scooter',
  brand: 'MBTP Pro',
  name: 'P239 (90/90-10) 6PR TL',
  description:
  'Perfil redondeado para scooters. Buen agarre en pavimento mojado y banda de rodamiento reforzada para calles con baches.',
  image: IMG.scooter,
  stock: 92,
  basePrice: 1276,
  tiers: MOTO_TIERS
},
{
  id: 'p6184-100-90-17',
  odooId: 4205,
  code: 'P6184',
  size: '100/90-17',
  ply: '6PR',
  construction: 'TL',
  category: 'street',
  brand: 'MBTP Pro',
  name: 'P6184 (100/90-17) 6PR TL',
  description:
  'Trasero para motos de calle de 125 a 200 cc. Diseño direccional que evacua agua y mantiene estabilidad a velocidad de carretera.',
  image: IMG.street,
  stock: 64,
  basePrice: 2501,
  tiers: MOTO_TIERS
},
{
  id: 'p257-250-17',
  odooId: 4098,
  code: 'P257',
  size: '2.50-17',
  ply: '6PR',
  construction: 'TT',
  category: 'classic',
  brand: 'MBTP Pro',
  name: 'P257 (2.50-17) 6PR TT',
  description:
  'El clásico para motos de trabajo y motoconchos. Uso con cámara, carcasa de 6 lonas y banda nervada de larga vida.',
  image: IMG.classic,
  stock: 210,
  basePrice: 1225,
  tiers: MOTO_TIERS
},
{
  id: 'p257-275-18',
  odooId: 4099,
  code: 'P257',
  size: '2.75-18',
  ply: '6PR',
  construction: 'TT',
  category: 'classic',
  brand: 'MBTP Pro',
  name: 'P257 (2.75-18) 6PR TT',
  description: 'Versión trasera del P257 para rin 18. Resistente a pinchazos y a la carga del día a día.',
  image: IMG.classic,
  stock: 12,
  basePrice: 1340,
  tiers: MOTO_TIERS
},
{
  id: 'p6200-110-90-17',
  odooId: 4210,
  code: 'P6200',
  size: '110/90-17',
  ply: '6PR',
  construction: 'TL',
  category: 'street',
  brand: 'MBTP Pro',
  name: 'P6200 (110/90-17) 6PR TL',
  description: 'Trasero ancho para motos de 150 a 250 cc. Mayor huella de contacto para mejor tracción y frenado.',
  image: IMG.street,
  stock: 38,
  basePrice: 2780,
  tiers: MOTO_TIERS
},
{
  id: 'p6120-120-70-17',
  odooId: 4214,
  code: 'P6120',
  size: '120/70-17',
  ply: '4PR',
  construction: 'TL',
  category: 'street',
  brand: 'MBTP Pro',
  name: 'P6120 (120/70-17) 4PR TL',
  description: 'Radial delantero para motos deportivas y naked. Compuesto suave para agarre en curva.',
  image: IMG.street,
  stock: 8,
  basePrice: 3420,
  tiers: MOTO_TIERS
},
{
  id: 'p3100-80-100-21',
  odooId: 4302,
  code: 'P3100',
  size: '80/100-21',
  ply: '6PR',
  construction: 'TT',
  category: 'offroad',
  brand: 'MBTP Pro',
  name: 'P3100 (80/100-21) 6PR TT',
  description: 'Delantero de tacos para enduro y motocross. Tacos escalonados para tierra suelta y barro.',
  image: IMG.offroad,
  stock: 0,
  basePrice: 2890,
  tiers: MOTO_TIERS
},
{
  id: 'p3110-110-90-18',
  odooId: 4303,
  code: 'P3110',
  size: '110/90-18',
  ply: '6PR',
  construction: 'TT',
  category: 'offroad',
  brand: 'MBTP Pro',
  name: 'P3110 (110/90-18) 6PR TT',
  description: 'Trasero de tacos para enduro. Carcasa reforzada para caminos vecinales y fincas.',
  image: IMG.offroad,
  stock: 22,
  basePrice: 3150,
  tiers: MOTO_TIERS
},
{
  id: 'c187-175-65r14',
  odooId: 5011,
  code: 'C187',
  size: '175/65R14',
  ply: '82H',
  construction: 'TL',
  category: 'auto',
  brand: 'WDT',
  name: '175/65R14 C187 82H WDT',
  description: 'Neumático radial para autos compactos. Rodaje silencioso y bajo consumo de combustible.',
  image: IMG.auto,
  stock: 44,
  basePrice: 2480,
  tiers: AUTO_TIERS
}];