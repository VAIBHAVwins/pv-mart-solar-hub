
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';

const VendorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Vendor login:', { email, password });
  };

  return (
    <Layout className="bg-gradient-to-br from-[#797a83] to-[#4f4f56] min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-[#f7f7f6] rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#171a21] mb-2">Vendor Login</h1>
            <p className="text-[#4f4f56]">Access your vendor dashboard and manage quotations</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-[#171a21]">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 border-[#b07e66] focus:border-[#797a83]"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-[#171a21]">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 border-[#b07e66] focus:border-[#797a83]"
                placeholder="Enter your password"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#797a83] hover:bg-[#4f4f56] text-[#f7f7f6] font-semibold"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#4f4f56] mb-2">
              Don't have an account?{' '}
              <Link to="/vendor/register" className="text-[#b07e66] hover:underline font-semibold">
                Sign up here
              </Link>
            </p>
            <Link to="/vendor/forgot-password" className="text-[#4f4f56] hover:underline text-sm">
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VendorLogin;
