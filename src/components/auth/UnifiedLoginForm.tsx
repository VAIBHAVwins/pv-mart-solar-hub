
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Mail, Smartphone, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface UnifiedLoginFormProps {
  userType: 'customer' | 'vendor';
  onRegisterClick: () => void;
}

export function UnifiedLoginForm({ userType, onRegisterClick }: UnifiedLoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const normalizePhone = (phone: string) => {
    const cleaned = phone.replace(/[^\d]/g, '');
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    }
    return phone;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let loginIdentifier = '';
      
      if (loginMethod === 'email') {
        loginIdentifier = formData.email;
      } else {
        loginIdentifier = normalizePhone(formData.phone);
      }

      // First check if user exists and get their role
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role, email, phone')
        .or(`email.eq.${loginMethod === 'email' ? formData.email : ''},phone.eq.${loginMethod === 'phone' ? normalizePhone(formData.phone) : ''}`)
        .maybeSingle();

      if (userError && userError.code !== 'PGRST116') {
        throw userError;
      }

      // Check if user exists but has wrong role
      if (userData && userData.role !== userType) {
        const correctLoginPage = userData.role === 'customer' ? 'customer' : 'vendor';
        setError(`You are registered as a ${userData.role}. Please use the ${correctLoginPage} login page to access your dashboard.`);
        
        toast({
          title: "Wrong Login Page",
          description: `Please use the ${correctLoginPage} login page to access your account.`,
          variant: "destructive"
        });
        return;
      }

      // If user doesn't exist
      if (!userData) {
        setError(`No account found. Please register as a ${userType} first.`);
        return;
      }

      // Attempt login with Supabase Auth
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.email || '',
        password: formData.password
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid password. Please check your password and try again.');
        } else {
          setError(signInError.message);
        }
        return;
      }

      if (data.user) {
        toast({
          title: "Login Successful",
          description: `Welcome back! Redirecting to your ${userType} dashboard...`
        });
        
        // Redirect to appropriate dashboard
        window.location.href = `/${userType}/dashboard`;
      }

    } catch (err: any) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">
          {userType === 'customer' ? 'Customer Login' : 'Vendor Login'}
        </CardTitle>
        <CardDescription>
          Sign in to access your {userType} dashboard
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as 'email' | 'phone')}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="email" className="flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="phone" className="flex items-center">
              <Smartphone className="w-4 h-4 mr-2" />
              Phone
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4">
            <TabsContent value="email" className="mt-0">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="h-12"
                />
              </div>
            </TabsContent>

            <TabsContent value="phone" className="mt-0">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">+91</span>
                  </div>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                    className="pl-12 h-12"
                    maxLength={10}
                  />
                </div>
              </div>
            </TabsContent>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  className="pr-12 h-12"
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

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base font-medium"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-4">
              Don't have an account?
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={onRegisterClick}
              className="w-full"
            >
              Register as {userType === 'customer' ? 'Customer' : 'Vendor'}
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
