import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';

export default function InstallationType() {
  return (
    <Layout>
      <div className="min-h-screen bg-cornflower_blue-50 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-10 text-center text-charcoal">
            Choose Your Installation Type
          </h1>
          <p className="text-center text-slate_gray mb-12 text-lg">
            Select the type of solar installation that best fits your needs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Residential */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:-translate-y-2 hover:shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop" 
                alt="Residential Solar" 
                className="w-full h-48 object-cover"
              />
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4 text-charcoal">Residential</h2>
                <p className="text-slate_gray mb-6">
                  Perfect for homes and residential properties. Get clean energy for your family 
                  with rooftop solar installations designed for maximum efficiency.
                </p>
                <ul className="text-sm text-slate_gray mb-6 space-y-2">
                  <li>• Rooftop installations</li>
                  <li>• 1-10 kW capacity</li>
                  <li>• Government subsidies available</li>
                  <li>• 25-year warranty</li>
                </ul>
                <Link to="/grid-connectivity?type=residential">
                  <Button className="w-full bg-cornflower_blue text-white hover:bg-cornflower_blue-600 font-semibold">
                    Choose Residential
                  </Button>
                </Link>
              </div>
            </div>

            {/* Commercial */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:-translate-y-2 hover:shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop" 
                alt="Commercial Solar" 
                className="w-full h-48 object-cover"
              />
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4 text-charcoal">Commercial</h2>
                <p className="text-slate_gray mb-6">
                  Ideal for businesses, offices, and commercial establishments. Reduce your 
                  operational costs with scalable solar solutions.
                </p>
                <ul className="text-sm text-slate_gray mb-6 space-y-2">
                  <li>• 10-100 kW capacity</li>
                  <li>• Quick ROI</li>
                  <li>• Tax benefits</li>
                  <li>• Professional maintenance</li>
                </ul>
                <Link to="/grid-connectivity?type=commercial">
                  <Button className="w-full bg-cornflower_blue text-white hover:bg-cornflower_blue-600 font-semibold">
                    Choose Commercial
                  </Button>
                </Link>
              </div>
            </div>

            {/* Industrial */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:-translate-y-2 hover:shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop" 
                alt="Industrial Solar" 
                className="w-full h-48 object-cover"
              />
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4 text-charcoal">Industrial</h2>
                <p className="text-slate_gray mb-6">
                  Large-scale solar installations for industrial facilities and manufacturing 
                  units. Maximize your energy independence.
                </p>
                <ul className="text-sm text-slate_gray mb-6 space-y-2">
                  <li>• 100+ kW capacity</li>
                  <li>• Ground-mount systems</li>
                  <li>• High efficiency modules</li>
                  <li>• 24/7 monitoring</li>
                </ul>
                <Link to="/grid-connectivity?type=industrial">
                  <Button className="w-full bg-cornflower_blue text-white hover:bg-cornflower_blue-600 font-semibold">
                    Choose Industrial
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-slate_gray mb-4">
              Not sure which option is right for you?
            </p>
            <Link to="/contact">
              <Button variant="outline" className="border-cornflower_blue text-cornflower_blue hover:bg-cornflower_blue hover:text-white">
                Contact Our Experts
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
