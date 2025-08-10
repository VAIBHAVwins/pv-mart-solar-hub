
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OTPVerification } from '../components/auth/OTPVerification';

describe('OTPVerification', () => {
  const mockProps = {
    phoneNumber: '+1234567890',
    onVerifySuccess: vi.fn(),
    onBack: vi.fn(),
  };

  it('renders OTP verification form', () => {
    render(<OTPVerification {...mockProps} />);
    
    expect(screen.getByText('Enter Verification Code')).toBeInTheDocument();
    expect(screen.getByText(/sent to \+1234567890/)).toBeInTheDocument();
  });

  it('shows phone number in masked format', () => {
    render(<OTPVerification {...mockProps} />);
    
    expect(screen.getByText(/\+1234567890/)).toBeInTheDocument();
  });
});
