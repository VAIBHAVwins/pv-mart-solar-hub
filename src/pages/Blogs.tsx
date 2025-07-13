
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid, List, Calendar, Eye, User, Tag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Blog } from '@/types/blog';
import Layout from '@/components/layout/Layout';

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching blogs:', error);
        return;
      }

      if (data) {
        // Cast the data to match our Blog type
        const typedData = data.map(blog => ({
          ...blog,
          status: blog.status as 'draft' | 'published' | 'archived',
          tags: blog.tags || [],
          view_count: blog.view_count || 0,
          is_pinned: blog.is_pinned || false
        }));
        
        setBlogs(typedData);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(typedData.map(blog => blog.category).filter(Boolean))];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    if (selectedCategory === 'all') return true;
    return blog.category === selectedCategory;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading blogs...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Solar Energy Blog</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest insights, tips, and news about solar energy, 
            renewable technology, and sustainable living.
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <span className="text-sm text-gray-600">
              {filteredBlogs.length} {filteredBlogs.length === 1 ? 'article' : 'articles'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Blog Posts */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Tag className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">
              {selectedCategory === 'all' 
                ? 'No blog posts are available at the moment.' 
                : `No articles found in the "${selectedCategory}" category.`
              }
            </p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-6'
          }>
            {filteredBlogs.map((blog) => (
              <Card key={blog.id} className="hover:shadow-lg transition-shadow duration-200">
                {blog.featured_image_url && (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={blog.featured_image_url}
                      alt={blog.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                )}
                
                <CardHeader className={blog.featured_image_url ? '' : 'pt-6'}>
                  <div className="flex items-center justify-between mb-2">
                    {blog.category && (
                      <Badge variant="outline" className="text-xs">
                        {blog.category}
                      </Badge>
                    )}
                    {blog.is_pinned && (
                      <Badge className="bg-purple-100 text-purple-800 text-xs">
                        Pinned
                      </Badge>
                    )}
                  </div>
                  
                  <CardTitle className="text-lg leading-tight">
                    <Link 
                      to={`/blog/${blog.slug}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {blog.title}
                    </Link>
                  </CardTitle>
                  
                  {blog.excerpt && (
                    <CardDescription className="text-sm">
                      {truncateText(blog.excerpt, 120)}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      {blog.author && (
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          <span>{blog.author}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{formatDate(blog.created_at)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      <span>{blog.view_count || 0} views</span>
                    </div>
                  </div>
                  
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {blog.tags.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{blog.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Blogs;
