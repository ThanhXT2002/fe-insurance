import { Seo } from "./seo.interface"

export interface PostItem {
  id:number;
  title: string
  slug?: string
  excerpt: string
  shortContent?: string
  content: string
  featuredImage?: string
  status?: PostStatus
  albumImages?: string[]
  videoUrl?: string
  note?: string
  priority?: number
  isHighlighted?: boolean
  isFeatured?: boolean
  scheduledAt?: Date | string
  expiredAt?: Date | string
  publishedAt: string
  targetAudience?: string[]
  relatedProductIds?: number[]
  metaKeywords?: string[]
  categoryId?: number
  postType?: PostType
  taggedCategoryIds?: number[]
  seoMeta?: Seo
}


export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type PostType = 'ARTICLE' | 'GUIDE' | 'NEWS' | 'PRODUCT' | 'FAQ';

