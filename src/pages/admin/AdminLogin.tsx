
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, EyeOff } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-gray-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Admin Access</CardTitle>
            <CardDescription className="text-gray-600">
              Enter your credentials to access the admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="loginForm" className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="h-12"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="pr-12 h-12"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-medium bg-gray-900 hover:bg-gray-800 text-white"
              >
                Access Dashboard
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Secure admin portal for authorized personnel only
              </p>
              <div className="mt-2 text-xs text-gray-400">
                <p>Authorized emails: ankurvaibhav22@gmail.com, ttemp604@yahoo.com</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          const role = "admin";

          document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const res = await fetch("https://nchxapviawfjtcsvjvfl.supabase.co/functions/v1/loginCheck", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password, expectedRole: role })
            });

            const data = await res.json();

            if (data.error) {
              alert(\`\${data.error} Redirecting...\`);
              if (data.redirectTo) window.location.href = data.redirectTo;
            } else {
              window.location.href = \`/\${role}/dashboard\`;
            }
          });
        `
      }} />
    </Layout>
  );
};

export default AdminLogin;
