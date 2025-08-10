
import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { OTPVerification } from '../components/auth/OTPVerification';

describe('OTPVerification', () => {
  const mockProps = {
    email: 'test@example.com',
    onVerificationComplete: vi.fn(),
    onBack: vi.fn(),
  };

  it('renders OTP verification form', () => {
    render(<OTPVerification {...mockProps} />);
    
    expect(screen.getByText('Verify Your Email')).toBeInTheDocument();
    expect(screen.getByText(/sent a verification email to/)).toBeInTheDocument();
  });

  it('shows email in the verification message', () => {
    render(<OTPVerification {...mockProps} />);
    
    expect(screen.getByText(/test@example.com/)).toBeInTheDocument();
  });
});
