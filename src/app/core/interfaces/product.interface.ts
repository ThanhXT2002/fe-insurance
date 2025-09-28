import { Seo } from './seo.interface';

export interface ProductItem {
  id: number;
  sku?: string | null;
  name: string;
  slug?: string | null;
  description?: string | null;
  shortContent?: string | null;
  content?: string | null;
  price?: number | null;
  coverage?: string | null;
  term?: string | null;
  targetLink?: string | null;
  targetFile?: string | null;
  imgs?: string[] | null;
  details?: string | null;
  icon?: string | null;
  priority?: number | null;
  isHighlighted?: boolean | null;
  isFeatured?: boolean | null;
  isSaleOnline?: boolean | null;
  active?: boolean | null;
  tags?: string[] | null;
  isPromotion?: boolean | null;
  promotionDetails?: string | null;
  metaKeywords?: string[] | null;
  note?: string | null;
  seoMeta?: Seo | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export enum ProductStatus {
  active = 'active',
  inactive = 'inactive',
  archived = 'archived',
}
