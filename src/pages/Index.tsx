
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Sun, 
  DollarSign, 
  Leaf, 
  Zap, 
  Phone,
  ArrowRight
} from 'lucide-react';

interface HeroBanner {
  id: string;
  title: string;
  description: string;
  image_url: string;
  button_text: string;
  button_link: string;
  is_active: boolean;
}

const Index = () => {
  const [heroBanners, setHeroBanners] = useState<HeroBanner[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    fetchHeroBanners();
  }, []);

  const fetchHeroBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_banners')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching hero banners:', error);
        return;
      }

      if (data && data.length > 0) {
        setHeroBanners(data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (heroBanners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % heroBanners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [heroBanners.length]);

  const currentBanner = heroBanners[currentBannerIndex];

  const handleCallNow = () => {
    window.open('tel:+918800000000', '_self');
  };

  const benefits = [
    {
      icon: DollarSign,
      title: "Save Money",
      description: "Reduce your electricity bills by up to 90% with solar power"
    },
    {
      icon: Leaf,
      title: "Go Green",
      description: "Reduce your carbon footprint and contribute to a cleaner environment"
    },
    {
      icon: Zap,
      title: "Reliable Power",
      description: "Generate your own clean energy with minimal maintenance required"
    },
    {
      icon: Sun,
      title: "Long-term Investment",
      description: "Solar panels last 25+ years with government incentives and subsidies"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      {currentBanner ? (
        <section className="relative h-[600px] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${currentBanner.image_url})`,
            }}
          >
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="text-center text-white max-w-4xl mx-auto px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  {currentBanner.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 opacity-90">
                  {currentBanner.description}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to={currentBanner.button_link}>
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                      {currentBanner.button_text}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={handleCallNow}
                    className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg"
                  >
                    <Phone className="mr-2 w-5 h-5" />
                    Call Now: +91 8800000000
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Banner Indicators */}
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
      ) : (
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Power Your Future with Solar Energy
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              India's premier solar marketplace connecting you with trusted installers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/customer/requirements">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
                  Get Solar Quote
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline"
                onClick={handleCallNow}
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
              >
                <Phone className="mr-2 w-5 h-5" />
                Call Now: +91 8800000000
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Solar Benefits Section - Centered */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Solar Benefits That Matter
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover why millions of homeowners are making the switch to solar energy
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Solar Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get personalized quotes from certified solar installers in your area
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/customer/requirements">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg">
                Get Free Quote
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline"
              onClick={handleCallNow}
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
            >
              <Phone className="mr-2 w-5 h-5" />
              Call Expert: +91 8800000000
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
