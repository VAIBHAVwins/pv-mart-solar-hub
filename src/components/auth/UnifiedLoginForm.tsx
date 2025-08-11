
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Mail, Phone } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface UnifiedLoginFormProps {
  userType: 'customer' | 'vendor';
  onRegisterClick: () => void;
}

export function UnifiedLoginForm({ userType, onRegisterClick }: UnifiedLoginFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const { toast } = useToast();
  const navigate = useNavigate();

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
      let signInData;
      
      if (loginMethod === 'email') {
        if (!formData.email || !formData.password) {
          setError('Please enter both email and password');
          return;
        }
        
        signInData = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
      } else {
        if (!formData.phone || !formData.password) {
          setError('Please enter both phone number and password');
          return;
        }

        const normalizedPhone = normalizePhone(formData.phone);
        
        // First get the email associated with this phone number
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('email')
          .eq('phone', normalizedPhone)
          .single();

        if (userError || !userData) {
          setError('No account found with this phone number');
          return;
        }

        signInData = await supabase.auth.signInWithPassword({
          email: userData.email,
          password: formData.password
        });
      }

      const { data, error: signInError } = signInData;

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid credentials. Please check your email/phone and password.');
        } else {
          setError(signInError.message);
        }
        return;
      }

      if (data.user) {
        // Check user role
        const { data: userRole, error: roleError } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (roleError) {
          setError('Failed to verify user role');
          return;
        }

        // Validate user type matches login page
        if (userRole.role !== userType) {
          if (userType === 'customer' && userRole.role === 'vendor') {
            setError('You are registered as a vendor. Please use the vendor login page to access your dashboard.');
          } else if (userType === 'vendor' && userRole.role === 'customer') {
            setError('You are registered as a customer. Please use the customer login page to access your dashboard.');
          } else {
            setError('Invalid user type for this login page.');
          }
          
          // Sign out the user since they're on wrong page
          await supabase.auth.signOut();
          return;
        }

        toast({
          title: "Login Successful",
          description: `Welcome back! Redirecting to your ${userType} dashboard.`
        });

        // Redirect to appropriate dashboard
        navigate(`/${userType}/dashboard`);
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
            <TabsTrigger value="email" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </TabsTrigger>
            <TabsTrigger value="phone" className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Phone</span>
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-4">
            <TabsContent value="email" className="space-y-4 mt-0">
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
                  required={loginMethod === 'email'}
                  disabled={loading}
                  className="h-12"
                />
              </div>
            </TabsContent>

            <TabsContent value="phone" className="space-y-4 mt-0">
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
                    required={loginMethod === 'phone'}
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
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={loading}
                className="h-12"
              />
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
        </Tabs>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onRegisterClick}
              className="text-blue-600 hover:underline font-medium"
            >
              Register here
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
