export const sanitizeInput = (value: string): string => {
  // Basic XSS mitigation: strip angle brackets and quotes
  return value.replace(/[<>"'`]/g, '');
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};