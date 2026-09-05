export type GarmentCategory =
  | 'ALL'
  | 'DROP SHOULDER'
  | 'GRAPHIC TEES'
  | 'HOODIES & SWEATS'
  | 'ACID WASH'
  | 'CARGO & PANTS';

export type GarmentStatus = 'AVAILABLE' | 'ARCHIVE_ONLY' | 'SOLD_OUT' | 'BESPOKE';

export interface GarmentSize {
  size: string;
  pitToPit: string;
  backLength: string;
  sleeve: string;
  stock: number;
}

export interface GarmentSpecs {
  fabrication: string;
  hardware: string;
  fit: string;
  origin: string;
  stitchDensity: string;
  weightGsm: number;
  treatment: string;
}

export interface Garment {
  id: string;
  sku: string;
  title: string;
  season: string;
  category: GarmentCategory;
  dropCode: string;
  price: number;
  status: GarmentStatus;
  images: string[];
  description: string;
  specs: GarmentSpecs;
  sizes: GarmentSize[];
  tags: string[];
  patternCutterCode: string;
}

export interface LookbookFrame {
  id: string;
  frameNumber: string;
  image: string;
  title: string;
  caption: string;
  linkedGarmentSkus: string[];
  coordinates: string;
  iso: string;
  shutter: string;
  notes: string;
}

export interface RequisitionItem {
  garment: Garment;
  selectedSize: string;
  quantity: number;
}

export interface BespokeCommission {
  fullName: string;
  email: string;
  measurementProfile: string;
  categoryPreference: string;
  fabricChoice: string;
  hardwareFinish: string;
  vaultDelivery: boolean;
  notes: string;
}

export interface ProductionBatch {
  batchId: string;
  sku: string;
  title: string;
  millOrigin: string;
  loomType: string;
  unitsProduced: number;
  stage: 'CURING' | 'STITCHING' | 'OXIDATION' | 'VAULT_INSPECTED';
  artisanRef: string;
  completionRate: number;
}
