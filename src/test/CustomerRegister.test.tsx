
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CustomerRegister from '@/pages/customer/Register'
import * as SupabaseAuthContext from '@/contexts/SupabaseAuthContext'

// Mock the SupabaseAuthContext
const mockSignUp = vi.fn()
const mockContextValue = {
  user: null,
  session: null,
  loading: false,
  userRole: null,
  signUp: mockSignUp,
  signIn: vi.fn(),
  signOut: vi.fn(),
  resetPassword: vi.fn()
}

vi.mock('@/contexts/SupabaseAuthContext', () => ({
  useSupabaseAuth: () => mockContextValue,
  SupabaseAuthProvider: ({ children }: { children: React.ReactNode }) => children
}))

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => 
      <a href={to}>{children}</a>
  }
})

describe('CustomerRegister', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSignUp.mockResolvedValue({ data: null, error: null })
  })

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <CustomerRegister />
      </MemoryRouter>
    )
  }

  it('renders registration form', () => {
    renderComponent()
    
    expect(screen.getByText('Join PV Mart')).toBeInTheDocument()
    expect(screen.getByText('Register as a Customer')).toBeInTheDocument()
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
  })

  it('shows validation errors for empty required fields', async () => {
    renderComponent()
    
    const submitButton = screen.getByRole('button', { name: /register/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    renderComponent()
    
    const emailInput = screen.getByLabelText(/email/i)
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    
    const submitButton = screen.getByRole('button', { name: /register/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument()
    })
  })

  it('validates phone number format', async () => {
    renderComponent()
    
    const phoneInput = screen.getByLabelText(/phone/i)
    fireEvent.change(phoneInput, { target: { value: '123' } })
    
    const submitButton = screen.getByRole('button', { name: /register/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/phone number must be 10 digits/i)).toBeInTheDocument()
    })
  })

  it('validates password requirements', async () => {
    renderComponent()
    
    const passwordInput = screen.getByLabelText(/^password$/i)
    fireEvent.change(passwordInput, { target: { value: '123' } })
    
    const submitButton = screen.getByRole('button', { name: /register/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument()
    })
  })

  it('validates password confirmation match', async () => {
    renderComponent()
    
    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
    
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'different123' } })
    
    const submitButton = screen.getByRole('button', { name: /register/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    renderComponent()
    
    // Fill in all required fields
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } })
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '9876543210' } })
    fireEvent.change(screen.getByLabelText(/address/i), { target: { value: '123 Main St' } })
    fireEvent.change(screen.getByLabelText(/city/i), { target: { value: 'Delhi' } })
    fireEvent.change(screen.getByLabelText(/state/i), { target: { value: 'Delhi' } })
    fireEvent.change(screen.getByLabelText(/pincode/i), { target: { value: '110001' } })
    fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'password123' } })
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } })
    
    const submitButton = screen.getByRole('button', { name: /register/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith(
        'john@example.com',
        'password123',
        expect.objectContaining({
          data: expect.objectContaining({
            full_name: 'John Doe',
            phone: '9876543210',
            role: 'customer'
          })
        })
      )
    }, { timeout: 15000 })
  }, 15000)
})
