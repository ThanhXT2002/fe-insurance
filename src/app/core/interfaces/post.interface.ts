import { Seo } from "./seo.interface"

export interface PostItem {
  id:number;
  title: string
  slug?: string
  excerpt?: string
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
  publishedAt?: Date | string
  targetAudience?: string[]
  relatedProductIds?: number[]
  metaKeywords?: string[]
  categoryId?: number
  postType?: PostType
  taggedCategoryIds?: number[]
  seoMeta?: Seo
}


export enum PostType {
  ARTICLE = 'article', // Bài viết thông thường
  GUIDE = 'guide', // Hướng dẫn
  NEWS = 'news', // Tin tức
  PRODUCT = 'product', // Giới thiệu sản phẩm bảo hiểm
  FAQ = 'faq' // Câu hỏi thường gặp
}

// Enums
export enum PostStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

