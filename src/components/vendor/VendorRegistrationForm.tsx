
import { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { validation, sanitize, validationMessages } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import VendorRegistrationFormFields from './VendorRegistrationFormFields';
import { RegistrationMessages } from '@/components/customer/RegistrationMessages';

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

export function VendorRegistrationForm() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
    
    if (name === 'phone') {
      sanitizedValue = sanitize.phone(value);
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
    const requiredFields = ['companyName', 'contactPerson', 'email', 'phone', 'address', 'pmSuryaGharRegistered', 'licenseNumber', 'serviceAreas', 'specializations'];
    
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
      console.log('Attempting vendor registration with:', {
        email: formData.email,
        contactPerson: formData.contactPerson,
        companyName: formData.companyName
      });

      const { data, error: signUpError } = await signUp(formData.email, formData.password, {
        data: {
          full_name: sanitize.html(formData.contactPerson),
          company_name: sanitize.html(formData.companyName),
          phone: sanitize.html(formData.phone),
          user_type: 'vendor',
          pm_surya_ghar_registered: formData.pmSuryaGharRegistered
        }
      });
      
      console.log('Vendor signup response:', { data, error: signUpError });
      
      if (signUpError) {
        console.error('Vendor SignUp error:', signUpError);
        
        if (signUpError.message.includes('User already registered') || signUpError.message.includes('already registered')) {
          setError('An account with this email already exists. Please login instead.');
        } else if (signUpError.message.includes('Invalid email') || signUpError.message.includes('invalid email')) {
          setError('Please enter a valid email address.');
        } else if (signUpError.message.includes('Password') || signUpError.message.includes('password')) {
          setError('Password must be at least 6 characters long.');
        } else if (signUpError.message.includes('duplicate key') || signUpError.message.includes('constraint')) {
          setError('Account creation failed. Please try again or contact support if the issue persists.');
        } else if (signUpError.message.includes('Database error') || signUpError.message.includes('database')) {
          setError('Registration temporarily unavailable. Please try again in a few moments.');
        } else {
          setError(`Registration failed: ${signUpError.message}`);
        }
        return;
      }
      
      console.log('Vendor registered successfully:', data.user?.id);
      setSuccess('Registration successful! Please check your email to verify your account.');
    } catch (err: unknown) {
      console.error('Vendor registration error:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
