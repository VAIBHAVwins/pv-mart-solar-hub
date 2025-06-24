
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';

const CustomerRegister = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
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
    console.log('Customer registration:', formData);
  };

  return (
    <Layout className="bg-gradient-to-br from-[#fecb00] to-[#f8b200] min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#190a02] mb-2">Join PVMart</h1>
            <p className="text-[#8b4a08]">Create your customer account to get solar quotes</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-[#190a02]">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 border-[#8b4a08] focus:border-[#fecb00]"
                  placeholder="First name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-[#190a02]">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 border-[#8b4a08] focus:border-[#fecb00]"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className="text-[#190a02]">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 border-[#8b4a08] focus:border-[#fecb00]"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-[#190a02]">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 border-[#8b4a08] focus:border-[#fecb00]"
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-[#190a02]">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 border-[#8b4a08] focus:border-[#fecb00]"
                placeholder="Create a password"
                required
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-[#190a02]">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 border-[#8b4a08] focus:border-[#fecb00]"
                placeholder="Confirm your password"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#fecb00] hover:bg-[#f8b200] text-[#190a02] font-semibold"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#8b4a08]">
              Already have an account?{' '}
              <Link to="/customer/login" className="text-[#0895c6] hover:underline font-semibold">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerRegister;
