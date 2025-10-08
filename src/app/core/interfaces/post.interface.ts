import { Seo } from './seo.interface';

export interface PostItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  shortContent?: string;
  content: string;
  featuredImage?: string;
  status?: PostStatus;
  albumImages?: string[];
  videoUrl?: string;
  note?: string;
  priority?: number;
  isHighlighted?: boolean;
  isFeatured?: boolean;
  scheduledAt?: Date | string;
  expiredAt?: Date | string;
  publishedAt: string;
  targetAudience?: string[];
  metaKeywords?: string[];
  categoryId?: number;
  postType?: PostType;
  taggedCategoryIds?: number[];
  seoMeta?: Seo;
  // Các trường bổ sung từ API response
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  _count?: {
    comments: number;
  };
  taggedCategories?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  relatedProducts?: Array<{
    id: number;
    name: string;
    slug: string;
    price: number;
  }>;
}

export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type PostType = 'ARTICLE' | 'GUIDE' | 'NEWS' | 'PRODUCT' | 'FAQ';
