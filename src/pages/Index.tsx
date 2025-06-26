import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { useState, useEffect } from 'react';

export default function Home() {
  const [currentBanner, setCurrentBanner] = useState(0);
  
  const banners = [
    {
      title: "PM-KUSUM Yojana 2024",
      subtitle: "Get up to 60% subsidy on solar installations",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=400&fit=crop"
    },
    {
      title: "Zero Down Payment",
      subtitle: "Start your solar journey with easy EMI options",
      image: "https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=800&h=400&fit=crop"
    },
    {
      title: "Free Site Assessment",
      subtitle: "Get professional evaluation of your solar potential",
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&h=400&fit=crop"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Layout>
      {/* Hero Section with Rotating Banners */}
      <section className="relative h-[50vh] bg-gradient-to-br from-cornflower_blue via-cornflower_blue-600 to-charcoal overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={banners[currentBanner].image}
            alt={banners[currentBanner].title}
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center text-center text-white">
          <div className="animate-fade-in">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
              {banners[currentBanner].title}
            </h1>
            <p className="text-lg md:text-xl mb-6 opacity-90">
              {banners[currentBanner].subtitle}
            </p>
          </div>
        </div>
        {/* Banner indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentBanner ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => setCurrentBanner(index)}
            />
          ))}
        </div>
      </section>

      {/* Tagline Section */}
      <section className="py-12 bg-cornflower_blue-900 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 text-jonquil">
            Empowering India's Solar Revolution
          </h2>
          <p className="text-base md:text-lg text-jonquil opacity-95 max-w-3xl mx-auto">
            PVMart connects you with trusted solar vendors for affordable, high-quality solar installations. 
            Start your journey to clean energy today.
          </p>
        </div>
      </section>

      {/* Quick Action Buttons */}
      <section className="py-16 bg-cornflower_blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-charcoal">Get Started Today</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/installation-type">
              <Button size="lg" className="bg-cornflower_blue text-white hover:bg-cornflower_blue-600 font-bold shadow-md w-full sm:w-auto px-8 py-3 text-lg">
                Get Solar Quote
              </Button>
            </Link>
            <Link to="/vendor/register">
              <Button size="lg" variant="outline" className="border-cornflower_blue text-cornflower_blue hover:bg-cornflower_blue hover:text-white font-bold shadow-md w-full sm:w-auto px-8 py-3 text-lg">
                Join as Vendor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-charcoal">How PV_MART Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-cornflower_blue-50 rounded-xl shadow-lg p-8 text-center transition-transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="bg-cornflower_blue text-white rounded-full w-16 h-16 flex items-center justify-center mb-4 text-2xl font-bold mx-auto">1</div>
              <h3 className="text-xl font-semibold mb-2 text-charcoal">Choose Installation Type</h3>
              <p className="text-slate_gray">Select residential, commercial, or industrial solar installation based on your needs.</p>
            </div>
            <div className="bg-cornflower_blue-50 rounded-xl shadow-lg p-8 text-center transition-transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="bg-cornflower_blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center mb-4 text-2xl font-bold mx-auto">2</div>
              <h3 className="text-xl font-semibold mb-2 text-charcoal">Submit Requirements</h3>
              <p className="text-slate_gray">Fill out your solar requirements and get connected with verified vendors.</p>
            </div>
            <div className="bg-cornflower_blue-50 rounded-xl shadow-lg p-8 text-center transition-transform hover:-translate-y-2 hover:shadow-2xl">
              <div className="bg-cornflower_blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center mb-4 text-2xl font-bold mx-auto">3</div>
              <h3 className="text-xl font-semibold mb-2 text-charcoal">Get Installation</h3>
              <p className="text-slate_gray">Our team will contact you soon for professional solar installation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-cornflower_blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-charcoal">Our Solar Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center transition-transform hover:-translate-y-2 hover:shadow-2xl">
              <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=200&fit=crop" alt="Residential Solar Installation" className="w-full h-48 object-cover rounded-lg mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-charcoal">Residential Solar Installation</h3>
              <p className="text-slate_gray mb-4">Custom solar solutions for homes with rooftop and ground-mount systems.</p>
              <Link to="/grid-connectivity?type=residential">
                <Button className="bg-cornflower_blue text-white hover:bg-cornflower_blue-600">
                  Get Quote
                </Button>
              </Link>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center transition-transform hover:-translate-y-2 hover:shadow-2xl">
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop" alt="Commercial Solar Installation" className="w-full h-48 object-cover rounded-lg mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-charcoal">Commercial Solar Installation</h3>
              <p className="text-slate_gray mb-4">Scalable solar installations for businesses and offices.</p>
              <Link to="/grid-connectivity?type=commercial">
                <Button className="bg-cornflower_blue text-white hover:bg-cornflower_blue-600">
                  Get Quote
                </Button>
              </Link>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center transition-transform hover:-translate-y-2 hover:shadow-2xl">
              <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop" alt="Industrial Solar Installation" className="w-full h-48 object-cover rounded-lg mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-charcoal">Industrial Solar Installation</h3>
              <p className="text-slate_gray mb-4">Large-scale solar solutions for industrial facilities.</p>
              <Link to="/grid-connectivity?type=industrial">
                <Button className="bg-cornflower_blue text-white hover:bg-cornflower_blue-600">
                  Get Quote
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-charcoal">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Link to="/contact" className="bg-cornflower_blue-50 p-6 rounded-lg text-center hover:bg-cornflower_blue-100 transition-colors">
              <h3 className="font-semibold text-charcoal">Contact Us</h3>
            </Link>
            <Link to="/about" className="bg-cornflower_blue-50 p-6 rounded-lg text-center hover:bg-cornflower_blue-100 transition-colors">
              <h3 className="font-semibold text-charcoal">About Us</h3>
            </Link>
            <Link to="/blogs" className="bg-cornflower_blue-50 p-6 rounded-lg text-center hover:bg-cornflower_blue-100 transition-colors">
              <h3 className="font-semibold text-charcoal">Blogs</h3>
            </Link>
            <Link to="/game" className="bg-cornflower_blue-50 p-6 rounded-lg text-center hover:bg-cornflower_blue-100 transition-colors">
              <h3 className="font-semibold text-charcoal">Solar Game</h3>
            </Link>
            <Link to="/admin/login" className="bg-cornflower_blue-50 p-6 rounded-lg text-center hover:bg-cornflower_blue-100 transition-colors">
              <h3 className="font-semibold text-charcoal">Admin Login</h3>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-charcoal text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-8">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Phone</h3>
              <p>8986985927</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p>info@pvmart.com</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Business Hours</h3>
              <p>9am to 9pm daily</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
