
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Sun, 
  Zap, 
  Leaf, 
  Shield, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight,
  CheckCircle,
  Star,
  Users,
  TrendingUp,
  Award
} from 'lucide-react';

interface HeroBanner {
  id: string;
  title: string;
  description: string;
  image_url: string;
  cta_text: string;
  cta_link: string;
  is_active: boolean;
  order_index: number;
  display_duration: number;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  featured_image_url: string;
  author: string;
  published_at: string;
  slug: string;
  category: string;
}

export default function Index() {
  const [heroBanners, setHeroBanners] = useState<HeroBanner[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const fetchHeroBanners = async () => {
      try {
        const { data, error } = await supabase
          .from('hero_images')
          .select('*')
          .eq('is_active', true)
          .order('order_index', { ascending: true });
        
        if (error) throw error;
        setHeroBanners(data || []);
      } catch (error) {
        console.error('Error fetching hero banners:', error);
      }
    };

    const fetchBlogPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('id, title, excerpt, featured_image_url, author, published_at, slug, category')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(3);
        
        if (error) throw error;
        setBlogPosts(data || []);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      }
    };

    fetchHeroBanners();
    fetchBlogPosts();
  }, []);

  // Auto-rotate hero banners
  useEffect(() => {
    if (heroBanners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % heroBanners.length);
      }, heroBanners[currentBannerIndex]?.display_duration || 5000);

      return () => clearInterval(interval);
    }
  }, [heroBanners, currentBannerIndex]);

  const currentBanner = heroBanners[currentBannerIndex];

  const features = [
    {
      icon: Sun,
      title: "Solar Panel Installation",
      description: "Professional installation of high-efficiency solar panels for maximum energy output"
    },
    {
      icon: Zap,
      title: "Grid Connectivity",
      description: "Seamless integration with the electrical grid for optimal energy distribution"
    },
    {
      icon: Leaf,
      title: "Eco-Friendly Solutions",
      description: "Reduce your carbon footprint with clean, renewable energy solutions"
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Premium components with comprehensive warranties and ongoing support"
    }
  ];

  const benefits = [
    "Reduce electricity bills by up to 90%",
    "25-year performance warranty",
    "Government subsidies available",
    "Professional installation & maintenance",
    "Real-time energy monitoring",
    "Increase property value"
  ];

  const stats = [
    { icon: Users, value: "1000+", label: "Happy Customers" },
    { icon: Zap, value: "50MW+", label: "Solar Installed" },
    { icon: TrendingUp, value: "₹2Cr+", label: "Savings Generated" },
    { icon: Award, value: "5 Star", label: "Average Rating" }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {currentBanner && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${currentBanner.image_url})` }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        )}
        
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {currentBanner?.title || "Power Your Future with Solar Energy"}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              {currentBanner?.description || "Join thousands of satisfied customers in the solar revolution. Get premium solar solutions with expert installation and ongoing support."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
              >
                <a href="/customer/login">
                  <Users className="w-5 h-5 mr-2" />
                  Customer Login
                </a>
              </Button>
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
              >
                <a href="/vendor/login">
                  <Award className="w-5 h-5 mr-2" />
                  Vendor Login
                </a>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Hero Banner Indicators */}
        {heroBanners.length > 1 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {heroBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBannerIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentBannerIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-blue-200" />
                <div className="text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-200">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose PV Mart?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide comprehensive solar solutions with cutting-edge technology and expert service
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <feature.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Solar Benefits That Matter
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Make the smart switch to solar energy and enjoy immediate and long-term benefits for your home and wallet.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </motion.div>
                ))}
              </div>
              <Button 
                size="lg" 
                className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
              >
                <a href="/customer/register">
                  Get Started Today <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img 
                src="/api/placeholder/600/400" 
                alt="Solar Installation" 
                className="rounded-lg shadow-2xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center space-x-3">
                  <Star className="w-8 h-8 text-yellow-500" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">4.9/5</div>
                    <div className="text-sm text-gray-600">Customer Rating</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      {blogPosts.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Latest Solar Insights
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Stay updated with the latest trends and news in solar energy
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-0">
                      {post.featured_image_url && (
                        <img 
                          src={post.featured_image_url} 
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      )}
                      <div className="p-6">
                        <div className="text-sm text-blue-600 font-medium mb-2">
                          {post.category}
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>By {post.author}</span>
                          <span>{new Date(post.published_at).toLocaleDateString()}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          className="mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 h-auto font-semibold"
                          asChild
                        >
                          <a href={`/blog/${post.slug}`}>
                            Read More <ArrowRight className="w-4 h-4 ml-1" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Go Solar?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of satisfied customers who have made the switch to clean, renewable energy. 
              Get your free consultation today and start saving on your electricity bills.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
              >
                <a href="/customer/register">
                  Get Free Quote <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                asChild
              >
                <a href="/contact">
                  <Phone className="w-5 h-5 mr-2" />
                  Call Now
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
