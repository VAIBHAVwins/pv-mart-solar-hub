
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';

const VendorRegister = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    licenseNumber: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Vendor registration:', formData);
  };

  return (
    <Layout className="bg-gradient-to-br from-[#797a83] to-[#4f4f56] min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-[#f7f7f6] rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#171a21] mb-2">Join as Vendor</h1>
            <p className="text-[#4f4f56]">Register your solar business and start receiving leads</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName" className="text-[#171a21]">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="mt-1 border-[#b07e66] focus:border-[#797a83]"
                  placeholder="Your company name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="contactPerson" className="text-[#171a21]">Contact Person</Label>
                <Input
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  className="mt-1 border-[#b07e66] focus:border-[#797a83]"
                  placeholder="Primary contact name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="text-[#171a21]">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 border-[#b07e66] focus:border-[#797a83]"
                  placeholder="Business email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-[#171a21]">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 border-[#b07e66] focus:border-[#797a83]"
                  placeholder="Business phone"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="text-[#171a21]">Business Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 border-[#b07e66] focus:border-[#797a83]"
                placeholder="Complete business address"
                required
              />
            </div>

            <div>
              <Label htmlFor="licenseNumber" className="text-[#171a21]">License Number</Label>
              <Input
                id="licenseNumber"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                className="mt-1 border-[#b07e66] focus:border-[#797a83]"
                placeholder="Solar installation license number"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password" className="text-[#171a21]">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 border-[#b07e66] focus:border-[#797a83]"
                  placeholder="Create a password"
                  required
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-[#171a21]">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 border-[#b07e66] focus:border-[#797a83]"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#797a83] hover:bg-[#4f4f56] text-[#f7f7f6] font-semibold"
            >
              Register as Vendor
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#4f4f56]">
              Already have an account?{' '}
              <Link to="/vendor/login" className="text-[#b07e66] hover:underline font-semibold">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VendorRegister;
