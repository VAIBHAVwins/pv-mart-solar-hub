
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/layout/Layout';
import { useState } from 'react';

export default function GridConnectivity() {
  const [searchParams] = useSearchParams();
  const installationType = searchParams.get('type') || 'residential';
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);

  const handleNonResidentialOnGrid = () => {
    setShowMaintenanceModal(true);
  };

  const MaintenanceModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4 text-center text-charcoal">Service Under Maintenance</h3>
        <p className="text-slate_gray text-center mb-6">
          This service is currently under maintenance and will be resumed soon. We apologize for any inconvenience.
        </p>
        <div className="flex justify-center">
          <Link to="/">
            <Button 
              className="bg-cornflower_blue text-white hover:bg-cornflower_blue-600"
              onClick={() => setShowMaintenanceModal(false)}
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="min-h-screen bg-cornflower_blue-50 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-6 text-center text-charcoal">
            Choose Grid Connectivity Type
          </h1>
          <p className="text-center text-slate_gray mb-4 text-lg">
            Selected: <span className="font-semibold text-cornflower_blue capitalize">{installationType}</span> Installation
          </p>
          <p className="text-center text-slate_gray mb-12 text-lg">
            Select the grid connectivity option that best suits your energy needs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* On-Grid */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:-translate-y-2 hover:shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=250&fit=crop" 
                alt="On-Grid Solar" 
                className="w-full h-48 object-cover"
              />
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4 text-charcoal">On-Grid</h2>
                <p className="text-slate_gray mb-6">
                  Connected to the utility grid with net metering. Sell excess energy back to the grid 
                  and reduce your electricity bills significantly.
                </p>
                <ul className="text-sm text-slate_gray mb-6 space-y-2">
                  <li>• Net metering benefits</li>
                  <li>• Lower installation cost</li>
                  <li>• Grid backup available</li>
                  <li>• Sell excess energy</li>
                </ul>
                {installationType === 'residential' ? (
                  <Link to="/customer/login">
                    <Button className="w-full bg-cornflower_blue text-white hover:bg-cornflower_blue-600 font-semibold">
                      Choose On-Grid
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    onClick={handleNonResidentialOnGrid}
                    className="w-full bg-cornflower_blue text-white hover:bg-cornflower_blue-600 font-semibold"
                  >
                    Choose On-Grid
                  </Button>
                )}
              </div>
            </div>

            {/* Off-Grid */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:-translate-y-2 hover:shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=250&fit=crop" 
                alt="Off-Grid Solar" 
                className="w-full h-48 object-cover"
              />
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4 text-charcoal">Off-Grid</h2>
                <p className="text-slate_gray mb-6">
                  Complete energy independence with battery storage. Perfect for remote areas 
                  or locations with unreliable grid supply.
                </p>
                <ul className="text-sm text-slate_gray mb-6 space-y-2">
                  <li>• Complete independence</li>
                  <li>• Battery backup included</li>
                  <li>• Perfect for remote areas</li>
                  <li>• No grid dependency</li>
                </ul>
                <Button 
                  onClick={handleNonResidentialOnGrid}
                  className="w-full bg-cornflower_blue text-white hover:bg-cornflower_blue-600 font-semibold"
                >
                  Choose Off-Grid
                </Button>
              </div>
            </div>

            {/* Hybrid */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:-translate-y-2 hover:shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400&h=250&fit=crop" 
                alt="Hybrid Solar" 
                className="w-full h-48 object-cover"
              />
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4 text-charcoal">Hybrid</h2>
                <p className="text-slate_gray mb-6">
                  Best of both worlds - grid connection with battery backup. 
                  Ensure continuous power supply even during grid outages.
                </p>
                <ul className="text-sm text-slate_gray mb-6 space-y-2">
                  <li>• Grid + Battery backup</li>
                  <li>• Uninterrupted power supply</li>
                  <li>• Smart energy management</li>
                  <li>• Maximum reliability</li>
                </ul>
                <Button 
                  onClick={handleNonResidentialOnGrid}
                  className="w-full bg-cornflower_blue text-white hover:bg-cornflower_blue-600 font-semibold"
                >
                  Choose Hybrid
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/installation-type">
              <Button variant="outline" className="border-cornflower_blue text-cornflower_blue hover:bg-cornflower_blue hover:text-white mr-4">
                ← Back to Installation Type
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-cornflower_blue text-cornflower_blue hover:bg-cornflower_blue hover:text-white">
                Need Help? Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {showMaintenanceModal && <MaintenanceModal />}
    </Layout>
  );
}
