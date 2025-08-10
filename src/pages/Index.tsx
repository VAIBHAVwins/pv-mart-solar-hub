import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Phone, Shield, Zap, TrendingUp, MapPin, Clock, Users, Award, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Layout from '@/components/layout/Layout';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image_url: string | null;
  category: string | null;
  published_at: string;
  created_at: string;
}

interface HeroImage {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  cta_text: string | null;
  cta_link: string | null;
  display_duration: number | null;
  order_index: number | null;
  is_active: boolean;
}

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroImages, setHeroImages] = useState<HeroImage[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const { data, error } = await supabase
          .from('hero_images')
          .select('*')
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        if (error) {
          console.error('Error fetching hero images:', error);
        } else {
          setHeroImages(data || []);
        }
      } catch (error) {
        console.error('Error fetching hero images:', error);
      }
    };

    const fetchBlogs = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(3);

        if (error) {
          console.error('Error fetching blogs:', error);
        } else {
          setBlogs(data || []);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroImages();
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (heroImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % heroImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [heroImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
  };

  const benefits = [
    {
      icon: <Zap className="w-8 h-8 text-blue-600" />,
      title: "Reduce Electricity Bills",
      description: "Save up to 90% on your monthly electricity costs with our efficient solar panels."
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "25-Year Warranty",
      description: "Industry-leading warranty on all our solar installations for complete peace of mind."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-600" />,
      title: "Increase Property Value",
      description: "Solar installations can increase your property value by up to 4% according to studies."
    }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen">
        {/* Hero Section with Carousel */}
        <section className="relative h-[600px] overflow-hidden">
          {heroImages.length > 0 ? (
            <>
              {heroImages.map((image, index) => (
                <div
                  key={image.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div 
                    className="h-full bg-cover bg-center relative"
                    style={{ backgroundImage: `url(${image.image_url})` }}
                  >
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                    <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
                      <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                          {image.title}
                        </h1>
                        {image.description && (
                          <p className="text-xl md:text-2xl mb-8 text-gray-200">
                            {image.description}
                          </p>
                        )}
                        {image.cta_text && image.cta_link && (
                          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                            <a href={image.cta_link} className="flex items-center">
                              {image.cta_text}
                              <ArrowRight className="ml-2 w-5 h-5" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Navigation arrows */}
              {heroImages.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 z-20"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 z-20"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                  
                  {/* Slide indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                    {heroImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${
                          index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            // Fallback hero if no images
            <div className="h-full bg-gradient-to-r from-blue-600 to-purple-700 relative">
              <div className="absolute inset-0 bg-black bg-opacity-30"></div>
              <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
                <div className="max-w-4xl mx-auto">
                  <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    Power Your Future with Solar Energy
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 text-gray-200">
                    Join thousands of homeowners who have made the switch to clean, renewable energy
                  </p>
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    Get Started Today
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Benefits Section - Center Aligned */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Solar Benefits That Matter
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover why solar energy is the smart choice for your home and your wallet
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex justify-center mb-4">
                      {benefit.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Solar Insights Section */}
        {blogs.length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Latest Solar Insights
                </h2>
                <p className="text-xl text-gray-600">
                  Stay updated with the latest trends and insights in solar energy
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <Card key={blog.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    {blog.featured_image_url && (
                      <img 
                        src={blog.featured_image_url} 
                        alt={blog.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <CardContent className="p-6">
                      {blog.category && (
                        <Badge variant="secondary" className="mb-2">
                          {blog.category}
                        </Badge>
                      )}
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {blog.excerpt}
                      </p>
                      <Link to={`/blog/${blog.slug}`}>
                        <Button variant="outline" className="w-full">
                          Read More
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Link to="/blogs">
                  <Button size="lg" variant="outline">
                    View All Articles
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="py-16 bg-blue-600">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Make the Switch to Solar?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join thousands of satisfied customers who have reduced their electricity bills and carbon footprint
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/customer/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Get Free Quote
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-blue-600"
              >
                <Phone className="mr-2 w-5 h-5" />
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
