export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published_at: string;
  author: string;
  tags: string[];
  thumbnails: string[];
  meta: {
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
  };
}
