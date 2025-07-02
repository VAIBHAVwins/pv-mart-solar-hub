import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { validation, sanitize, validationMessages } from '@/lib/validation';

// CURSOR AI: Modern, professional Vendor Registration redesign with vendor color palette and UI patterns
const VendorRegister = () => {
  const { signUp } = useSupabaseAuth();
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    licenseNumber: '',
    serviceAreas: '',
    specializations: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
    
    // Sanitize input based on field type
    if (name === 'phone') {
      sanitizedValue = sanitize.phone(value);
    } else {
      sanitizedValue = sanitize.text(value);
    }
    
    // Prevent script injection
    if (!validation.noScriptTags(sanitizedValue)) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
  };

  const validateForm = () => {
    const requiredFields = ['companyName', 'contactPerson', 'email', 'phone', 'address', 'licenseNumber', 'serviceAreas', 'specializations'];
    
    for (const field of requiredFields) {
      if (!validation.required(formData[field as keyof typeof formData])) {
        setError(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`);
        return false;
      }
    }

    if (!validation.maxLength(formData.companyName, 100)) {
      setError('Company name ' + validationMessages.maxLength(100));
      return false;
    }

    if (!validation.maxLength(formData.contactPerson, 100)) {
      setError('Contact person name ' + validationMessages.maxLength(100));
      return false;
    }

    if (!validation.email(formData.email)) {
      setError(validationMessages.email);
      return false;
    }

    if (!validation.phone(formData.phone)) {
      setError(validationMessages.phone);
      return false;
    }

    if (!validation.licenseNumber(formData.licenseNumber)) {
      setError(validationMessages.licenseNumber);
      return false;
    }

    if (!validation.password(formData.password)) {
      setError(validationMessages.password);
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(validationMessages.noMatch);
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
      const { error: signUpError } = await signUp(formData.email, formData.password, {
        data: {
          full_name: sanitize.html(formData.contactPerson),
          company_name: sanitize.html(formData.companyName),
          user_type: 'vendor'
        }
      });
      
      if (signUpError) {
        if (signUpError.message.includes('User already registered')) {
          setError('An account with this email already exists. Please login instead.');
        } else {
          setError('Registration failed. Please try again.');
        }
        return;
      }
      
      setSuccess('Registration successful! Please check your email to verify your account.');
    } catch (err: unknown) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f7f6] py-16 px-4">
        <div className="bg-[#e6d3b3] p-10 rounded-2xl shadow-xl w-full max-w-2xl animate-fade-in">
          <h1 className="text-4xl font-extrabold mb-6 text-center text-[#797a83] drop-shadow">Join as Vendor</h1>
          <p className="text-[#4f4f56] mb-8 text-center">Register your solar business and start receiving leads</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="serviceAreas" className="text-[#171a21]">Service Areas</Label>
                <Input
                  id="serviceAreas"
                  name="serviceAreas"
                  value={formData.serviceAreas}
                  onChange={handleChange}
                  className="mt-1 border-[#b07e66] focus:border-[#797a83]"
                  placeholder="e.g. Delhi, Mumbai, etc."
                  required
                />
              </div>
              <div>
                <Label htmlFor="specializations" className="text-[#171a21]">Specializations</Label>
                <Input
                  id="specializations"
                  name="specializations"
                  value={formData.specializations}
                  onChange={handleChange}
                  className="mt-1 border-[#b07e66] focus:border-[#797a83]"
                  placeholder="e.g. Rooftop, Commercial, etc."
                  required
                />
              </div>
            </div>
            {error && <div className="text-red-600 font-semibold text-center">{error}</div>}
            {success && <div className="text-green-600 font-semibold text-center">{success}</div>}
            <Button
              type="submit"
              className="w-full bg-[#797a83] text-white py-3 rounded-lg font-bold hover:bg-[#4f4f56] shadow-md transition"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default VendorRegister;
