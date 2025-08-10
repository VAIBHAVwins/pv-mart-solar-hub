
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Sun, Zap, DollarSign, Leaf, Shield, Home } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface HeroBanner {
  id: string;
  title: string;
  description: string;
  image_url: string;
  button_text: string;
  button_link: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

const Index = () => {
  const [heroBanners, setHeroBanners] = useState<HeroBanner[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const fetchHeroBanners = async () => {
      try {
        const { data, error } = await supabase
          .from('hero_images')
          .select('*')
          .eq('is_active', true)
          .order('order_index', { ascending: true });

        if (error) {
          console.error('Error fetching hero banners:', error);
          return;
        }

        // Transform hero_images data to match HeroBanner interface
        const transformedData = data?.map(item => ({
          id: item.id,
          title: item.title || 'Solar Power Solutions',
          description: item.description || 'Transform your home with clean, renewable energy',
          image_url: item.image_url,
          button_text: item.cta_text || 'Get Started',
          button_link: item.cta_link || '/contact',
          is_active: item.is_active,
          display_order: item.order_index,
          created_at: item.created_at,
          updated_at: item.updated_at
        })) || [];

        setHeroBanners(transformedData);
      } catch (error) {
        console.error('Error fetching hero banners:', error);
      }
    };

    fetchHeroBanners();
  }, []);

  // Auto-rotate banners every 5 seconds
  useEffect(() => {
    if (heroBanners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prevIndex) => 
          (prevIndex + 1) % heroBanners.length
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [heroBanners.length]);

  const currentBanner = heroBanners[currentBannerIndex];

  const benefits = [
    {
      icon: <DollarSign className="w-8 h-8 text-green-600" />,
      title: 'Reduce Electricity Bills',
      description: 'Save up to 90% on your monthly electricity costs with solar power.'
    },
    {
      icon: <Leaf className="w-8 h-8 text-green-600" />,
      title: 'Eco-Friendly Energy',
      description: 'Reduce your carbon footprint with clean, renewable solar energy.'
    },
    {
      icon: <Zap className="w-8 h-8 text-green-600" />,
      title: 'Reliable Power Supply',
      description: 'Enjoy uninterrupted power supply with battery backup systems.'
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: '25-Year Warranty',
      description: 'Long-term protection with comprehensive warranty coverage.'
    },
    {
      icon: <Home className="w-8 h-8 text-green-600" />,
      title: 'Increase Property Value',
      description: 'Solar installations can increase your property value significantly.'
    },
    {
      icon: <Sun className="w-8 h-8 text-green-600" />,
      title: 'Government Subsidies',
      description: 'Take advantage of government incentives and subsidies available.'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-green-600 text-white overflow-hidden">
        {currentBanner && (
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{ backgroundImage: `url(${currentBanner.image_url})` }}
          />
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {currentBanner?.title || 'Power Your Future with Solar Energy'}
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              {currentBanner?.description || 'Join thousands of homeowners who have switched to clean, renewable solar energy. Reduce your electricity bills and carbon footprint today.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={currentBanner?.button_link || '/contact'}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {currentBanner?.button_text || 'Get Free Quote'}
              </a>
              <a
                href="/about"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
        
        {/* Banner indicators */}
        {heroBanners.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {heroBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBannerIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentBannerIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Solar Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Solar Benefits That Matter
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover why solar energy is the smart choice for your home and the environment
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
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

      {/* Call to Action */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Switch to Solar?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get a free consultation and personalized quote for your solar installation. 
            Our experts will help you design the perfect solar solution for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Get Free Consultation
            </a>
            <a
              href="tel:+918800000000"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Call Now: +91 88000 00000
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
