import { useState } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import { validation, sanitize, validationMessages } from '@/lib/validation';
import { supabase } from '@/integrations/supabase/client';

export default function CustomerRegister() {
  const { signUp } = useSupabaseAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
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
    
    setForm({ ...form, [name]: sanitizedValue });
  };

  const validateForm = () => {
    if (!validation.required(form.name)) {
      setError('Name is required');
      return false;
    }
    
    if (!validation.maxLength(form.name, 100)) {
      setError(validationMessages.maxLength(100));
      return false;
    }

    if (!validation.email(form.email)) {
      setError(validationMessages.email);
      return false;
    }

    if (!validation.phone(form.phone)) {
      setError(validationMessages.phone);
      return false;
    }

    if (!validation.password(form.password)) {
      setError(validationMessages.password);
      return false;
    }

    if (form.password !== form.confirmPassword) {
      setError(validationMessages.noMatch);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp(form.email, form.password, {
        data: {
          full_name: sanitize.html(form.name),
          user_type: 'customer'
        }
      });
      
      if (error) {
        if (error.message.includes('User already registered')) {
          setError('An account with this email already exists. Please login instead.');
        } else {
          setError('Registration failed. Please try again.');
        }
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Customer Registration</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded shadow">
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
