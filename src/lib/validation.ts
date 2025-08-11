
// Enhanced validation functions with security in mind
export const validation = {
  email: (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email) && email.length <= 254;
  },

  phone: (phone: string): boolean => {
    // Support multiple phone formats: 10 digits, +91 followed by 10 digits
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  },

  password: (password: string): boolean => {
    // Minimum 8 characters, at least one letter and one number
    return password.length >= 8 && /^(?=.*[A-Za-z])(?=.*\d)/.test(password);
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

  licenseNumber: (value: string): boolean => {
    // Basic license number validation (alphanumeric with common separators)
    return /^[A-Z0-9\-\/]+$/i.test(value) && value.length >= 5 && value.length <= 20;
  },

  gstNumber: (value: string): boolean => {
    // GST number format: 15 characters, alphanumeric
    // Format: 2 digits (state code) + 10 alphanumeric (PAN) + 1 digit (entity number) + 1 character (Z) + 1 check digit
    if (!value || value.trim() === '') return true; // GST is optional
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;
    return gstRegex.test(value.toUpperCase());
  }
};

// Sanitization functions
export const sanitize = {
  html: (input: string): string => {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  text: (input: string): string => {
    return input.trim().slice(0, 1000); // Limit length and trim whitespace
  },

  phone: (input: string): string => {
    return input.replace(/[^\d\+]/g, '');
  },

  gstNumber: (input: string): string => {
    return input.replace(/[^A-Z0-9]/gi, '').toUpperCase().slice(0, 15);
  }
};

// Validation error messages
export const validationMessages = {
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number (10 digits or +91 followed by 10 digits)',
  password: 'Password must be at least 8 characters with at least one letter and one number',
  required: 'This field is required',
  maxLength: (max: number) => `Maximum ${max} characters allowed`,
  minLength: (min: number) => `Minimum ${min} characters required`,
  licenseNumber: 'License number must be 5-20 alphanumeric characters',
  gstNumber: 'Please enter a valid GST number (15 characters in format: 22AAAAA0000A1Z5)',
  noMatch: 'Passwords do not match'
};
