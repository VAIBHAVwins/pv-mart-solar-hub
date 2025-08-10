
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OTPVerification } from '@/components/auth/OTPVerification'

// Mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}))

// Mock supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      resend: vi.fn(),
      getSession: vi.fn()
    }
  }
}))

describe('OTPVerification', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders OTP verification component', () => {
    const mockProps = {
      email: 'test@example.com',
      onVerificationComplete: vi.fn(),
      onBack: vi.fn()
    }

    render(<OTPVerification {...mockProps} />)
    
    expect(screen.getByTestId('otp-verification')).toBeInTheDocument()
    expect(screen.getByText('Verify Your Email')).toBeInTheDocument()
    expect(screen.getByText(/test@example.com/)).toBeInTheDocument()
  })

  // Additional tests for button clicks and success/error messages can be added here if needed
})
