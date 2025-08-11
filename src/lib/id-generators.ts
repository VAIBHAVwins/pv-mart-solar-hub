
// ID generation utilities for quotations and requirements
// Format: QUOT/XXXXX/YXXXX and REQM/XXXXX/YXXXX

export const generateQuotationId = (): string => {
  // Generate sequential number (1-99999)
  const sequential = Math.floor(Math.random() * 99999) + 1;
  
  // Generate alphabetic character (A-Z)
  const alpha = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  
  // Generate random number (1-9999)
  const random = Math.floor(Math.random() * 9999) + 1;
  
  // Format with proper padding
  const sequentialPadded = sequential.toString().padStart(5, '0');
  const randomPadded = random.toString().padStart(4, '0');
  
  return `QUOT/${sequentialPadded}/${alpha}${randomPadded}`;
};

export const generateRequirementId = (): string => {
  // Generate sequential number (1-99999)
  const sequential = Math.floor(Math.random() * 99999) + 1;
  
  // Generate alphabetic character (A-Z)
  const alpha = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  
  // Generate random number (1-9999)
  const random = Math.floor(Math.random() * 9999) + 1;
  
  // Format with proper padding
  const sequentialPadded = sequential.toString().padStart(5, '0');
  const randomPadded = random.toString().padStart(4, '0');
  
  return `REQM/${sequentialPadded}/${alpha}${randomPadded}`;
};

export const validateQuotationId = (id: string): boolean => {
  const pattern = /^QUOT\/\d{5}\/[A-Z]\d{4}$/;
  return pattern.test(id);
};

export const validateRequirementId = (id: string): boolean => {
  const pattern = /^REQM\/\d{5}\/[A-Z]\d{4}$/;
  return pattern.test(id);
};
