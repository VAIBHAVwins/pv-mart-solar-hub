
export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image_url?: string;
  category?: string;
  tags: string[];
  author: string;
  status: 'draft' | 'published' | 'archived';
  is_pinned: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface BlogForm {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  category: string;
  tags: string[];
  author: string;
  status: 'draft' | 'published' | 'archived';
  is_pinned: boolean;
}

export const initialBlogForm: BlogForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featured_image_url: '',
  category: '',
  tags: [],
  author: 'PV Mart Team',
  status: 'draft',
  is_pinned: false
};

export interface BlogFilters {
  status?: 'draft' | 'published' | 'archived';
  category?: string;
  is_pinned?: boolean;
  search?: string;
}

export interface BlogStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
  pinned: number;
}
