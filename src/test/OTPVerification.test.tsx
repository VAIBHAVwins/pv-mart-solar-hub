
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OTPVerification } from '@/components/auth/OTPVerification'

const mockOnVerificationComplete = vi.fn()
const mockOnBack = vi.fn()

describe('OTPVerification', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders OTP verification UI with correct buttons', () => {
    render(
      <OTPVerification 
        email="test@example.com" 
        onVerificationComplete={mockOnVerificationComplete} 
        onBack={mockOnBack}
      />
    )
    expect(screen.getByText('Verify Your Email')).toBeInTheDocument()
    expect(screen.getByText(/We\'ve sent a verification email to/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'I have verified my email' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Resend verification email' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Back to Registration' })).toBeInTheDocument()
  })

  // Additional tests for button clicks and success/error messages can be added here if needed
}) 
