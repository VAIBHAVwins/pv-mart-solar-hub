
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Sun, Zap, Leaf, Phone } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Index = () => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch hero images
  const { data: heroImages, isLoading: heroLoading } = useQuery({
    queryKey: ['hero-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_images')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch blog posts
  const { data: blogs, isLoading: blogsLoading } = useQuery({
    queryKey: ['blogs-homepage'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('is_pinned', { ascending: false })
        .order('published_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Auto-rotate hero images
  useEffect(() => {
    if (!heroImages || heroImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages]);

  const currentHeroImage = heroImages?.[currentImageIndex];

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section with Dynamic Images */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
          {heroLoading ? (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p>Loading...</p>
              </div>
            </div>
          ) : currentHeroImage ? (
            <>
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
                style={{ backgroundImage: `url(${currentHeroImage.image_url})` }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-50" />
              <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  {currentHeroImage.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 leading-relaxed">
                  {currentHeroImage.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                    onClick={() => navigate('/customer/register')}
                  >
                    {currentHeroImage.cta_text || 'Get Started'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200"
                    onClick={() => navigate('/enhanced-game')}
                  >
                    Try Solar Game
                  </Button>
                </div>
              </div>
              
              {/* Image indicators */}
              {heroImages && heroImages.length > 1 && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            // Fallback hero section
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  Power Your Future with Solar
                </h1>
                <p className="text-xl md:text-2xl mb-8 leading-relaxed">
                  Join thousands of homeowners who have made the switch to clean, renewable energy
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200"
                    onClick={() => navigate('/customer/register')}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200"
                    onClick={() => navigate('/enhanced-game')}
                  >
                    Try Solar Game
                  </Button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Solar Benefits Section - Centered */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Solar Benefits That Matter
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover why solar energy is the smart choice for your home and the environment
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-8 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Leaf className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Eco-Friendly</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Reduce your carbon footprint and contribute to a cleaner, more sustainable future for generations to come.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-8 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sun className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Cost Savings</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Dramatically reduce your electricity bills and enjoy long-term savings with solar energy systems.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-8 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <CardContent className="pt-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Zap className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Energy Independence</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Generate your own clean energy and reduce dependence on traditional power grids and fluctuating energy costs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Blog Section */}
        {blogs && blogs.length > 0 && (
          <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Solar Insights</h2>
                <p className="text-xl text-gray-600">Stay informed with the latest solar energy news and tips</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <Card key={blog.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200">
                    {blog.featured_image_url && (
                      <img
                        src={blog.featured_image_url}
                        alt={blog.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {blog.excerpt}
                      </p>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => navigate(`/blog/${blog.slug}`)}
                      >
                        Read More
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Button 
                  size="lg"
                  onClick={() => navigate('/blogs')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                >
                  View All Articles
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* Call to Action Section */}
        <section className="py-20 bg-blue-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Your Solar Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Get personalized solar quotes from verified vendors in your area
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg"
                onClick={() => navigate('/customer/requirement-form')}
              >
                Get Free Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
                onClick={() => window.open('tel:+919876543210', '_self')}
              >
                <Phone className="mr-2 h-5 w-5" />
                Call Now
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
