import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CustomerRegister from '@/pages/customer/Register'
import { SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext'
import { supabase } from '@/integrations/supabase/client'

// Mock the Layout component
vi.mock('@/components/layout/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Mock the OTPVerification component
vi.mock('@/components/auth/OTPVerification', () => ({
  OTPVerification: ({ email, onVerificationComplete }: { email: string; onVerificationComplete: () => void }) => (
    <div data-testid="otp-verification">
      <p>OTP Verification for {email}</p>
      <button onClick={onVerificationComplete}>Verify</button>
    </div>
  ),
}))

const renderWithAuth = (component: React.ReactElement) => {
  return render(
    <SupabaseAuthProvider>
      {component}
    </SupabaseAuthProvider>
  )
}

describe('CustomerRegister', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock user session with proper User type
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { 
        session: { 
          user: { 
            id: 'test-user-id', 
            email: 'test@example.com',
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: '2024-01-01T00:00:00Z'
          } 
        } 
      },
      error: null,
    })
  })

  it('renders registration form with all fields', () => {
    renderWithAuth(<CustomerRegister />)
    
    expect(screen.getByText('Customer Registration')).toBeInTheDocument()
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument()
    expect(screen.getByLabelText('Phone Number')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    renderWithAuth(<CustomerRegister />)
    
    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument()
      expect(screen.getByText('Email is required')).toBeInTheDocument()
      expect(screen.getByText('Phone number is required')).toBeInTheDocument()
      expect(screen.getByText('Password is required')).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    renderWithAuth(<CustomerRegister />)
    
    const emailInput = screen.getByLabelText('Email Address')
    await user.type(emailInput, 'invalid-email')
    
    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Invalid email format')).toBeInTheDocument()
    })
  })

  it('validates password confirmation', async () => {
    const user = userEvent.setup()
    renderWithAuth(<CustomerRegister />)
    
    const passwordInput = screen.getByLabelText('Password')
    const confirmPasswordInput = screen.getByLabelText('Confirm Password')
    
    await user.type(passwordInput, 'password123')
    await user.type(confirmPasswordInput, 'password456')
    
    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
    })
  })

  it('handles successful registration', async () => {
    const user = userEvent.setup()
    const mockSignUp = vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: { id: 'test-user-id', email: 'test@example.com' }, session: null },
      error: null,
    })
    
    renderWithAuth(<CustomerRegister />)
    
    // Fill form
    await user.type(screen.getByLabelText('Full Name'), 'John Doe')
    await user.type(screen.getByLabelText('Email Address'), 'john@example.com')
    await user.type(screen.getByLabelText('Phone Number'), '1234567890')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.type(screen.getByLabelText('Confirm Password'), 'password123')
    
    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'password123',
        options: {
          data: {
            full_name: 'John Doe',
            phone_number: '1234567890',
            user_type: 'customer'
          }
        }
      })
    })
  })

  it('handles registration error', async () => {
    const user = userEvent.setup()
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Email already exists' },
    })
    
    renderWithAuth(<CustomerRegister />)
    
    // Fill form
    await user.type(screen.getByLabelText('Full Name'), 'John Doe')
    await user.type(screen.getByLabelText('Email Address'), 'john@example.com')
    await user.type(screen.getByLabelText('Phone Number'), '1234567890')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.type(screen.getByLabelText('Confirm Password'), 'password123')
    
    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Email already exists')).toBeInTheDocument()
    })
  })

  it('shows OTP verification after successful registration', async () => {
    const user = userEvent.setup()
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: { id: 'test-user-id', email: 'john@example.com' }, session: null },
      error: null,
    })
    
    renderWithAuth(<CustomerRegister />)
    
    // Fill form
    await user.type(screen.getByLabelText('Full Name'), 'John Doe')
    await user.type(screen.getByLabelText('Email Address'), 'john@example.com')
    await user.type(screen.getByLabelText('Phone Number'), '1234567890')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.type(screen.getByLabelText('Confirm Password'), 'password123')
    
    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('otp-verification')).toBeInTheDocument()
    })
  })

  it('handles profile creation error gracefully', async () => {
    const user = userEvent.setup()
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: { id: 'test-user-id', email: 'john@example.com' }, session: null },
      error: null,
    })
    
    vi.mocked(supabase.from).mockReturnValue({
      insert: vi.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } }),
    } as any)
    
    renderWithAuth(<CustomerRegister />)
    
    // Fill form
    await user.type(screen.getByLabelText('Full Name'), 'John Doe')
    await user.type(screen.getByLabelText('Email Address'), 'john@example.com')
    await user.type(screen.getByLabelText('Phone Number'), '1234567890')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.type(screen.getByLabelText('Confirm Password'), 'password123')
    
    const submitButton = screen.getByRole('button', { name: 'Create Account' })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Database error updating user')).toBeInTheDocument()
    })
  })
}) 