import { supabase } from '@/integrations/supabase/client';
import type { TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

// Hero Image Management
export const heroImageService = {
  // Get all hero images ordered by order_index
  async getAll() {
    const { data, error } = await supabase
      .from('hero_images')
      .select('*')
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Get active hero images
  async getActive() {
    const { data, error } = await supabase
      .from('hero_images')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Add new hero image
  async create(heroImage: TablesInsert<'hero_images'>) {
    const { data, error } = await supabase
      .from('hero_images')
      .insert(heroImage)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update hero image
  async update(id: string, updates: TablesUpdate<'hero_images'>) {
    const { data, error } = await supabase
      .from('hero_images')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete hero image
  async delete(id: string) {
    const { error } = await supabase
      .from('hero_images')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Reorder hero images
  async reorder(updates: { id: string; order_index: number }[]) {
    const { error } = await supabase
      .from('hero_images')
      .upsert(updates.map(update => ({ id: update.id, order_index: update.order_index })));
    
    if (error) throw error;
  },

  // Upload image to Supabase Storage
  async uploadImage(file: File, path: string) {
    const { data, error } = await supabase.storage
      .from('hero-images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('hero-images')
      .getPublicUrl(path);
    
    return urlData.publicUrl;
  }
};

// Blog Post Management
export const blogPostService = {
  // Get all blog posts
  async getAll() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get published blog posts
  async getPublished() {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Get blog post by ID
  async getById(id: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Create new blog post
  async create(blogPost: TablesInsert<'blog_posts'>) {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(blogPost)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Update blog post
  async update(id: string, updates: TablesUpdate<'blog_posts'>) {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Delete blog post
  async delete(id: string) {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Publish blog post
  async publish(id: string) {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({ 
        status: 'published', 
        published_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Upload featured image to Supabase Storage
  async uploadFeaturedImage(file: File, path: string) {
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) throw error;
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(path);
    
    return urlData.publicUrl;
  }
}; 