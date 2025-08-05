export interface ProductItem {
  id: number;
  slug: string;
  icon: string;
  imgs: string[];
  name: string;
  description: string;
  detail: string;
  isPublish: boolean;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  priority: number;
  tags: string[];
  isPromotion: boolean;
  features: string[];
  createdBy: string;
  updatedBy: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
}
export enum ProductStatus {
  active = 'active',
  inactive = 'inactive',
  archived = 'archived'
}
