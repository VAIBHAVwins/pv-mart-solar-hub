
import { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { validation, sanitize, validationMessages } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import VendorRegistrationFormFields from './VendorRegistrationFormFields';
import { RegistrationMessages } from '@/components/customer/RegistrationMessages';
import { supabase } from '@/integrations/supabase/client';

interface VendorRegistrationFormData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  pmSuryaGharRegistered: string;
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
  const [formData, setFormData] = useState<VendorRegistrationFormData>({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    pmSuryaGharRegistered: '',
    licenseNumber: '',
    serviceAreas: '',
    specializations: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
    
    if (name === 'phone') {
      sanitizedValue = sanitize.phone(value);
    } else if ([
      'address', 'serviceAreas', 'specializations',
      'companyName', 'contactPerson', 'email', 'licenseNumber'
    ].includes(name)) {
      sanitizedValue = value.slice(0, 1000);
    } else {
      sanitizedValue = sanitize.text(value);
    }
    
    if (!validation.noScriptTags(sanitizedValue)) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const requiredFields: string[] = ['companyName', 'contactPerson', 'email', 'phone', 'address', 'pmSuryaGharRegistered', 'licenseNumber', 'serviceAreas', 'specializations'];
    
    for (const field of requiredFields) {
      if (!validation.required((formData as any)[field])) {
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
      // Check if email is already used in users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', formData.email)
        .single();
      if (existingUser) {
        setError('This email is already registered. Please use a different email.');
        setLoading(false);
        return;
      }
      // Register new vendor in Supabase Auth
      const { data, error: signUpError } = await signUp(formData.email, formData.password, {
        data: {
          company_name: formData.companyName,
          contact_person: formData.contactPerson,
          phone: formData.phone,
          address: formData.address,
          pm_surya_ghar_registered: formData.pmSuryaGharRegistered,
          license_number: formData.licenseNumber,
          service_areas: formData.serviceAreas,
          specializations: formData.specializations,
          role: 'vendor',
        }
      });
      if (signUpError) {
        setError(signUpError.message || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }
      // Only insert into users table if signUp succeeded and user is created
      if (!data || !data.user) {
        setError('Registration failed. Please try again.');
        setLoading(false);
        return;
      }
      await supabase
        .from('users')
        .insert([
          {
            email: formData.email,
            full_name: null,
            phone: formData.phone,
            company_name: formData.companyName,
            contact_person: formData.contactPerson,
            license_number: formData.licenseNumber,
            address: formData.address,
            role: 'vendor',
          }
        ]);
      setSuccess('Registration successful!');
      if (onSuccess) onSuccess(formData.email);
    } catch (error: any) {
      setError('Registration failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#e6d3b3] p-10 rounded-2xl shadow-xl w-full max-w-2xl animate-fade-in">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-[#797a83] drop-shadow">Join as Vendor</h1>
      <p className="text-[#4f4f56] mb-8 text-center">Register your solar business and start receiving leads</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <VendorRegistrationFormFields 
          formData={formData}
          loading={loading}
          onChange={handleChange}
          onSelectChange={handleSelectChange}
        />
        <RegistrationMessages error={error} success={success} />
        <Button
          type="submit"
          className="w-full bg-[#797a83] text-white py-3 rounded-lg font-bold hover:bg-[#4f4f56] shadow-md transition"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </form>
    </div>
  );
}
