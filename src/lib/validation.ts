
// Validation functions for forms
export const validation = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  phone: (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  },
  
  password: (password: string): boolean => {
    return password.length >= 6;
  },
  
  required: (value: string): boolean => {
    return value.trim().length > 0;
  },
  
  maxLength: (value: string, max: number): boolean => {
    return value.length <= max;
  },
  
  minLength: (value: string, min: number): boolean => {
    return value.length >= min;
  },
  
  noScriptTags: (value: string): boolean => {
    return !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(value);
  },
  
  alphanumeric: (value: string): boolean => {
    return /^[a-zA-Z0-9\s]+$/.test(value);
  },
  
  pincode: (pincode: string): boolean => {
    return /^[0-9]{6}$/.test(pincode);
  }
};

// Sanitization functions
export const sanitize = {
  text: (text: string): string => {
    return text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  },
  
  phone: (phone: string): string => {
    return phone.replace(/\D/g, '').slice(0, 15);
  }
};

// Validation messages
export const validationMessages = {
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number (10-15 digits)',
  password: 'Password must be at least 6 characters long',
  required: 'This field is required',
  maxLength: (max: number) => `Maximum ${max} characters allowed`,
  minLength: (min: number) => `Minimum ${min} characters required`,
  licenseNumber: 'Please enter a valid license number',
  noMatch: 'Passwords do not match',
  pincode: 'Please enter a valid 6-digit pincode'
};
