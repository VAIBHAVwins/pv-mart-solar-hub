
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/layout/Layout';

const CustomerLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Customer login:', { email, password });
  };

  return (
    <Layout className="bg-gradient-to-br from-[#fecb00] to-[#f8b200] min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#190a02] mb-2">Customer Login</h1>
            <p className="text-[#8b4a08]">Access your solar requirements and quotations</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-[#190a02]">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 border-[#8b4a08] focus:border-[#fecb00]"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-[#190a02]">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 border-[#8b4a08] focus:border-[#fecb00]"
                placeholder="Enter your password"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#fecb00] hover:bg-[#f8b200] text-[#190a02] font-semibold"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#8b4a08] mb-2">
              Don't have an account?{' '}
              <Link to="/customer/register" className="text-[#0895c6] hover:underline font-semibold">
                Sign up here
              </Link>
            </p>
            <Link to="/customer/forgot-password" className="text-[#8b4a08] hover:underline text-sm">
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerLogin;
