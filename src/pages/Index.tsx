import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, CheckCircle, Users, Award, MapPin, Phone, Mail } from 'lucide-react';
import Footer from '@/components/common/Footer';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

export default function Home() {
  const [currentBanner, setCurrentBanner] = useState(0);
  
  const banners = [
    {
      title: "PM-KUSUM Yojana 2024",
      subtitle: "Get up to 60% subsidy on solar installations",
      description: "Transform your energy future with government-backed solar solutions. Save money while contributing to a sustainable tomorrow.",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1200&h=600&fit=crop",
      cta: "Learn More"
    },
    {
      title: "Zero Down Payment",
      subtitle: "Start your solar journey with easy EMI options",
      description: "No upfront costs required. Choose from flexible payment plans and start saving on your electricity bills immediately.",
      image: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=1200&h=600&fit=crop",
      cta: "Get Quote"
    },
    {
      title: "Free Site Assessment",
      subtitle: "Get professional evaluation of your solar potential",
      description: "Our experts analyze your location, energy consumption, and roof structure to design the perfect solar solution for your needs.",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=1200&q=80",
      cta: "Book Assessment"
    }
  ];

  const features = [
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Quality Assurance",
      description: "All our solar panels come with 25-year warranty and meet international quality standards."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Expert Team",
      description: "Certified professionals with years of experience in solar installation and maintenance."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Vendor Compliance",
      description: "Our vendors comply with all government regulations and quality standards."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const nextBanner = () => {
    setCurrentBanner(prev => {
      const next = (prev + 1) % banners.length;
      console.log('Next Banner:', next);
      return next;
    });
  };

  const prevBanner = () => {
    setCurrentBanner(prev => {
      const prevIndex = (prev - 1 + banners.length) % banners.length;
      console.log('Prev Banner:', prevIndex);
      return prevIndex;
    });
  };

  return (
    <Layout>
      {/* Hero Section with Carousel */}
      <section className="relative h-screen overflow-hidden">
        <Carousel
          showThumbs={false}
          showStatus={false}
          infiniteLoop
          autoPlay
          interval={5000}
          className="h-full"
          renderArrowPrev={(onClickHandler, hasPrev, label) =>
            hasPrev && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('Previous arrow clicked')
                  onClickHandler()
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 p-3 rounded-full text-white transition-all duration-300"
                aria-label={label}
              >
                <ChevronLeft size={24} />
              </button>
            )
          }
          renderArrowNext={(onClickHandler, hasNext, label) =>
            hasNext && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('Next arrow clicked')
                  onClickHandler()
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/40 p-3 rounded-full text-white transition-all duration-300"
                aria-label={label}
              >
                <ChevronRight size={24} />
              </button>
            )
          }
          renderIndicator={(onClickHandler, isSelected, index, label) => (
            <li
              style={{ zIndex: 30, display: 'inline-block', margin: '0 4px' }}
              className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${isSelected ? 'bg-solar-primary' : 'bg-white/50'}`}
              onClick={onClickHandler}
              onKeyDown={onClickHandler}
              value={index}
              key={index}
              role="button"
              tabIndex={0}
              aria-label={`${label} ${index + 1}`}
            />
          )}
        >
          {banners.map((banner, idx) => (
            <div key={idx} className="relative h-screen">
              <img 
                src={banner.image} 
                alt={banner.title}
                className="w-full h-full object-cover"
                style={{ maxHeight: '100vh' }}
              />
              <div className="absolute inset-0 z-10 flex items-center justify-center h-full">
                <div className="container-responsive text-center text-white relative">
                  <div className="absolute inset-0 bg-black/40" style={{ zIndex: 10 }}></div>
                  <div className="max-w-4xl mx-auto relative z-10">
                    <h1 className="solar-heading text-white mb-6 animate-fade-in">
                      {banner.title}
                    </h1>
                    <p className="text-2xl md:text-3xl font-semibold mb-4 text-solar-primary">
                      {banner.subtitle}
                    </p>
                    <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                      {banner.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link to="/vendor/register">
                        <Button className="solar-button text-lg px-8 py-4">
                          Join as Vendor
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </Link>
                      <Link to="/installation-type">
                        <Button variant="outline" className="btn-outline text-white border-white hover:bg-white hover:text-solar-dark text-lg px-8 py-4">
                          Get Quotes
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* Features Section */}
      <section className="solar-section">
        <div className="solar-container">
          <div className="text-center mb-16">
            <h2 className="solar-heading">Why Choose PV Mart?</h2>
            <p className="solar-subheading max-w-3xl mx-auto">
              We provide comprehensive solar solutions with unmatched quality, expertise, and customer support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="feature-card group text-center">
                <div className="feature-icon mx-auto mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-solar-dark mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="solar-section solar-gradient">
        <div className="solar-container text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Go Solar?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have already switched to solar energy. 
            Get your free consultation today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/installation-type">
              <Button className="bg-white text-solar-primary hover:bg-gray-100 text-lg px-8 py-4">
                Get Free Quote
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-solar-primary text-lg px-8 py-4">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Info Section (centered) */}
      <section className="solar-section bg-gray-50">
        <div className="solar-container">
          <div className="flex flex-col md:flex-row justify-center items-center gap-8">
            <div className="solar-card text-center w-full md:w-1/3">
              <MapPin className="w-8 h-8 text-solar-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-solar-dark mb-2">Visit Us</h3>
              <p className="text-gray-600">(Hidden for privacy)</p>
            </div>
            <div className="solar-card text-center w-full md:w-1/3">
              <Phone className="w-8 h-8 text-solar-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-solar-dark mb-2">Call Us</h3>
              <p className="text-gray-600">(Hidden for privacy)</p>
            </div>
            <div className="solar-card text-center w-full md:w-1/3">
              <Mail className="w-8 h-8 text-solar-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-solar-dark mb-2">Email Us</h3>
              <p className="text-gray-600">(Hidden for privacy)</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </Layout>
  );
}
