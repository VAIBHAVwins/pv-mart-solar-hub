import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Eye, User, Tag, Share2, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Blog } from '@/types/blog';
import Layout from '@/components/layout/Layout';

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch the blog by slug
      const { data, error: fetchError } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (fetchError) {
        console.error('Error fetching blog:', fetchError);
        setError('Blog post not found');
        return;
      }

      if (data) {
        // Cast the data to match our Blog type
        const typedBlog = {
          ...data,
          status: data.status as 'draft' | 'published' | 'archived',
          tags: data.tags || [],
          view_count: data.view_count || 0,
          is_pinned: data.is_pinned || false
        };
        
        setBlog(typedBlog);
        
        // Increment view count
        await incrementViewCount(data.id);
        
        // Fetch related blogs
        await fetchRelatedBlogs(typedBlog.category, typedBlog.id);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const incrementViewCount = async (blogId: string) => {
    try {
      // Get current view count first
      const { data: currentBlog } = await supabase
        .from('blogs')
        .select('view_count')
        .eq('id', blogId)
        .single();

      if (currentBlog) {
        // Increment the view count
        await supabase
          .from('blogs')
          .update({ view_count: (currentBlog.view_count || 0) + 1 })
          .eq('id', blogId);
      }
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const fetchRelatedBlogs = async (category: string | undefined, currentBlogId: string) => {
    if (!category) return;

    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .eq('category', category)
        .neq('id', currentBlogId)
        .order('created_at', { ascending: false })
        .limit(3);

      if (!error && data) {
        const typedData = data.map(blog => ({
          ...blog,
          status: blog.status as 'draft' | 'published' | 'archived',
          tags: blog.tags || [],
          view_count: blog.view_count || 0,
          is_pinned: blog.is_pinned || false
        }));
        setRelatedBlogs(typedData);
      }
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const shareBlog = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        text: blog?.excerpt,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading blog post...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !blog) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <BookOpen className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Blog post not found</h3>
            <p className="text-gray-600 mb-6">
              The blog post you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/blogs')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/blogs')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Button>
        </div>

        {/* Blog Header */}
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              {blog.category && (
                <Badge variant="outline">
                  {blog.category}
                </Badge>
              )}
              {blog.is_pinned && (
                <Badge className="bg-purple-100 text-purple-800">
                  Pinned
                </Badge>
              )}
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {blog.title}
            </h1>
            
            {blog.excerpt && (
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {blog.excerpt}
              </p>
            )}

            <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
              <div className="flex items-center space-x-6">
                {blog.author && (
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span>{blog.author}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{formatDate(blog.created_at)}</span>
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  <span>{blog.view_count} views</span>
                </div>
              </div>
              
              <Button variant="outline" size="sm" onClick={shareBlog}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Featured Image */}
          {blog.featured_image_url && (
            <div className="mb-8">
              <img
                src={blog.featured_image_url}
                alt={blog.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Blog Content */}
          <Card className="mb-8">
            <CardContent className="prose prose-lg max-w-none p-6">
              <div 
                dangerouslySetInnerHTML={{ __html: blog.content }}
                className="blog-content"
              />
            </CardContent>
          </Card>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Related Blogs */}
          {relatedBlogs.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedBlogs.map((relatedBlog) => (
                  <Card key={relatedBlog.id} className="hover:shadow-lg transition-shadow">
                    {relatedBlog.featured_image_url && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={relatedBlog.featured_image_url}
                          alt={relatedBlog.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-lg">
                        <Link 
                          to={`/blog/${relatedBlog.slug}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {relatedBlog.title}
                        </Link>
                      </CardTitle>
                      {relatedBlog.excerpt && (
                        <CardDescription>
                          {relatedBlog.excerpt.length > 100 
                            ? `${relatedBlog.excerpt.substring(0, 100)}...` 
                            : relatedBlog.excerpt
                          }
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{formatDate(relatedBlog.created_at)}</span>
                        <span>{relatedBlog.view_count} views</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BlogDetail;
