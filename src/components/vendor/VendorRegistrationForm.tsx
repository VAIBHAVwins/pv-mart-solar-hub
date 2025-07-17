
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import VendorRegistrationFormFields from './VendorRegistrationFormFields';

interface VendorRegistrationData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  pmSuryaGharRegistered: 'YES' | 'NO';
  licenseNumber: string;
  serviceAreas: string;
  specializations: string;
  password: string;
  confirmPassword: string;
}

interface VendorRegistrationFormProps {
  onSuccess: (email: string) => void;
}

export function VendorRegistrationForm({ onSuccess }: VendorRegistrationFormProps) {
  const { signUp } = useSupabaseAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<VendorRegistrationData>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    pmSuryaGharRegistered: 'NO',
    licenseNumber: '',
    serviceAreas: '',
    specializations: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.companyName.trim()) {
      setError('Company name is required');
      return false;
    }
    if (!formData.contactPerson.trim()) {
      setError('Contact person is required');
      return false;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Valid email is required');
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setError('Valid phone number is required');
      return false;
    }
    if (!formData.address.trim()) {
      setError('Address is required');
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      console.log('🔄 Starting vendor registration for:', formData.email);

      // Step 1: Check if email already exists in users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, email, role')
        .eq('email', formData.email)
        .single();

      if (existingUser) {
        setError('This email is already registered. Please use a different email.');
        setLoading(false);
        return;
      }

      // Step 2: Create Supabase Auth user with vendor metadata
      const redirectUrl = `${window.location.origin}/vendor/dashboard`;
      
      const { data: authData, error: signUpError } = await signUp(formData.email, formData.password, {
        data: {
          full_name: formData.contactPerson,
          phone: formData.phone,
          role: 'vendor',
          company_name: formData.companyName,
          contact_person: formData.contactPerson,
          license_number: formData.licenseNumber,
          address: formData.address,
          service_areas: formData.serviceAreas,
          specializations: formData.specializations,
          pm_surya_ghar_registered: formData.pmSuryaGharRegistered
        }
      });

      if (signUpError) {
        console.error('❌ Supabase Auth signUp failed:', signUpError);
        if (signUpError.message.includes('already registered')) {
          setError('This email is already registered. Please use a different email.');
        } else {
          setError(signUpError.message || 'Registration failed. Please try again.');
        }
        setLoading(false);
        return;
      }

      if (!authData || !authData.user) {
        console.error('❌ No user data returned from signUp');
        setError('Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      console.log('✅ Vendor registration successful! User will be created via trigger.');
      setSuccess('Registration successful! Please check your email for verification.');
      
      if (onSuccess) {
        onSuccess(formData.email);
      }
      
    } catch (error: any) {
      console.error('❌ Registration error:', error);
      setError('Registration failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-bold text-gray-800">
          Join as Vendor
        </CardTitle>
        <p className="text-center text-gray-600">
          Register your solar business and start receiving leads
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <VendorRegistrationFormFields 
            formData={formData}
            loading={loading}
            onChange={handleChange}
            onSelectChange={handleSelectChange}
          />
          
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}
          
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
