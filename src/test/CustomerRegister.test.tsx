import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CustomerRegister from '@/pages/customer/Register'
import { SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext'
import { supabase } from '@/integrations/supabase/client'
import type { User, Session, AuthError } from '@supabase/supabase-js'

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

// Mock helper functions
const createMockUser = (overrides = {}): User => ({
  id: 'test-user-id',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: '2024-01-01T00:00:00Z',
  confirmed_at: '2024-01-01T00:00:00Z',
  email_confirmed_at: '2024-01-01T00:00:00Z',
  phone_confirmed_at: '2024-01-01T00:00:00Z',
  last_sign_in_at: '2024-01-01T00:00:00Z',
  role: 'authenticated',
  updated_at: '2024-01-01T00:00:00Z',
  identities: [],
  factors: [],
  ...overrides
})

const createMockSession = (user?: User): Session => ({
  user: user || createMockUser(),
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  expires_at: Date.now() / 1000 + 3600
})

const createMockAuthError = (message = 'Test error') => ({
  message,
  status: 400,
  code: 'test_error'
})

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
        session: createMockSession() 
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

  it('handles successful registration', async () => {
    const user = userEvent.setup()
    const mockUser = createMockUser({ email: 'john@example.com' })
    const mockSignUp = vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: mockUser, session: null },
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
      expect(mockSignUp).toHaveBeenCalled()
    })
  })

  it('handles registration error', async () => {
    const user = userEvent.setup()
    const mockError = createMockAuthError('Email already exists') as any
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: null, session: null },
      error: mockError,
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
      expect(screen.getByText('Registration failed: Email already exists')).toBeInTheDocument()
    })
  })

  it('shows OTP verification after successful registration', async () => {
    const user = userEvent.setup()
    const mockUser = createMockUser({ email: 'john@example.com' })
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: mockUser, session: null },
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
})