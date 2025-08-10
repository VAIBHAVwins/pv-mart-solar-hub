
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff } from 'lucide-react';

interface SupabaseAuthFormProps {
  onClose?: () => void;
  userType?: 'customer' | 'vendor' | 'admin';
}

export const SupabaseAuthForm = ({ onClose, userType = 'customer' }: SupabaseAuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isLogin ? 'Login' : 'Sign Up'}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLogin ? (
          <form id="loginForm" className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pr-10"
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
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>
            <Button className="w-full" onClick={() => alert('Signup functionality not implemented in this form')}>
              Sign Up
            </Button>
          </div>
        )}
        
        <Button 
          type="button" 
          variant="ghost" 
          onClick={() => setIsLogin(!isLogin)}
          className="w-full mt-4"
        >
          {isLogin ? 'Need an account? Sign up' : 'Already have an account? Login'}
        </Button>
      </CardContent>

      {isLogin && (
        <script dangerouslySetInnerHTML={{
          __html: `
            const role = "${userType}";

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
      )}
    </Card>
  );
};
