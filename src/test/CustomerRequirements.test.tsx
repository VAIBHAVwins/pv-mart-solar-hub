import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CustomerRequirements from '@/pages/customer/Requirements'
import { SupabaseAuthProvider } from '@/contexts/SupabaseAuthContext'
import { supabase } from '@/integrations/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

// Mock the Layout component
vi.mock('@/components/layout/Layout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

// Mock the useNavigate hook
const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => mockNavigate,
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

const renderWithAuth = (component: React.ReactElement) => {
  return render(
    <SupabaseAuthProvider>
      {component}
    </SupabaseAuthProvider>
  )
}

describe('CustomerRequirements', () => {
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

  it('renders requirements form with all sections', () => {
    renderWithAuth(<CustomerRequirements />)
    
    expect(screen.getByText('Solar Requirements Form')).toBeInTheDocument()
    expect(screen.getByText('Tell us about your solar needs to get accurate quotations')).toBeInTheDocument()
  })

  it('validates required fields in personal information', async () => {
    const user = userEvent.setup()
    renderWithAuth(<CustomerRequirements />)
    
    // Try to submit without filling required fields
    const submitButton = screen.getByRole('button', { name: 'Submit Requirement' })
    await user.click(submitButton)
    
    // Should show validation errors for required fields
    await waitFor(() => {
      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Consumer Mobile Number')).toBeInTheDocument()
      expect(screen.getByText('Email ID')).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    const user = userEvent.setup()
    renderWithAuth(<CustomerRequirements />)
    
    const emailInput = screen.getByLabelText('Email ID')
    await user.type(emailInput, 'invalid-email')
    
    const submitButton = screen.getByRole('button', { name: 'Submit Requirement' })
    await user.click(submitButton)
    
    // Should show validation error for invalid email
    await waitFor(() => {
      expect(emailInput).toHaveValue('invalid-email')
    })
  })

  it('validates phone number format', async () => {
    const user = userEvent.setup()
    renderWithAuth(<CustomerRequirements />)
    
    const phoneInput = screen.getByLabelText('Consumer Mobile Number')
    await user.type(phoneInput, '123')
    
    const submitButton = screen.getByRole('button', { name: 'Submit Requirement' })
    await user.click(submitButton)
    
    // Should show validation error for invalid phone number
    await waitFor(() => {
      expect(phoneInput).toHaveValue('123')
    })
  })

  it('handles state selection and updates district dropdown', async () => {
    const user = userEvent.setup()
    renderWithAuth(<CustomerRequirements />)
    
    const stateSelect = screen.getByLabelText('State')
    await user.selectOptions(stateSelect, 'Bihar')
    
    // District dropdown should be enabled and populated
    const districtSelect = screen.getByLabelText('District')
    expect(districtSelect).not.toBeDisabled()
    
    // Check if districts are populated for Bihar
    await waitFor(() => {
      expect(screen.getByText('Patna')).toBeInTheDocument()
    })
  })

  it('handles district selection and updates DISCOM dropdown', async () => {
    const user = userEvent.setup()
    renderWithAuth(<CustomerRequirements />)
    
    // Select state first
    const stateSelect = screen.getByLabelText('State')
    await user.selectOptions(stateSelect, 'Bihar')
    
    // Select district
    const districtSelect = screen.getByLabelText('District')
    await user.selectOptions(districtSelect, 'Patna')
    
    // DISCOM dropdown should be enabled and populated
    const discomSelect = screen.getByLabelText('DISCOM (Electricity Board)')
    expect(discomSelect).not.toBeDisabled()
    
    await waitFor(() => {
      expect(screen.getByText('NBPDCL')).toBeInTheDocument()
      expect(screen.getByText('SBPDCL')).toBeInTheDocument()
    })
  })

  it('validates property information fields', async () => {
    const user = userEvent.setup()
    renderWithAuth(<CustomerRequirements />)
    
    // Fill personal info first
    await user.type(screen.getByLabelText('Name'), 'John Doe')
    await user.type(screen.getByLabelText('Email ID'), 'john@example.com')
    await user.type(screen.getByLabelText('Consumer Mobile Number'), '1234567890')
    
    // Try to submit without property info
    const submitButton = screen.getByRole('button', { name: 'Submit Requirement' })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Property Type')).toBeInTheDocument()
      expect(screen.getByText('Roof Type')).toBeInTheDocument()
    })
  })

  it('validates system requirements fields', async () => {
    const user = userEvent.setup()
    renderWithAuth(<CustomerRequirements />)
    
    // Fill personal and property info first
    await user.type(screen.getByLabelText('Name'), 'John Doe')
    await user.type(screen.getByLabelText('Email ID'), 'john@example.com')
    await user.type(screen.getByLabelText('Consumer Mobile Number'), '1234567890')
    
    const propertyTypeSelect = screen.getByLabelText('Property Type')
    await user.selectOptions(propertyTypeSelect, 'Residential')
    
    const roofTypeSelect = screen.getByLabelText('Roof Type')
    await user.selectOptions(roofTypeSelect, 'Concrete')
    
    // Try to submit without system requirements
    const submitButton = screen.getByRole('button', { name: 'Submit Requirement' })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Monthly Electricity Bill (₹)')).toBeInTheDocument()
      expect(screen.getByText('Solar System Capacity')).toBeInTheDocument()
    })
  })

  it('handles successful form submission', async () => {
    const user = userEvent.setup()
    const mockInsert = vi.mocked(supabase.from).mockReturnValue({
      insert: vi.fn().mockResolvedValue({ data: { id: 'req-123' }, error: null }),
    } as any)
    
    renderWithAuth(<CustomerRequirements />)
    
    // Fill all required fields
    await user.type(screen.getByLabelText('Name'), 'John Doe')
    await user.type(screen.getByLabelText('Email ID'), 'john@example.com')
    await user.type(screen.getByLabelText('Consumer Mobile Number'), '1234567890')
    
    // Select state and district
    const stateSelect = screen.getByLabelText('State')
    await user.selectOptions(stateSelect, 'Bihar')
    
    const districtSelect = screen.getByLabelText('District')
    await user.selectOptions(districtSelect, 'Patna')
    
    const discomSelect = screen.getByLabelText('DISCOM (Electricity Board)')
    await user.selectOptions(discomSelect, 'NBPDCL')
    
    // Property information
    const propertyTypeSelect = screen.getByLabelText('Property Type')
    await user.selectOptions(propertyTypeSelect, 'Residential')
    
    const roofTypeSelect = screen.getByLabelText('Roof Type')
    await user.selectOptions(roofTypeSelect, 'Concrete')
    
    // System requirements
    const billInput = screen.getByLabelText('Monthly Electricity Bill (₹)')
    await user.type(billInput, '5000')
    
    const capacitySelect = screen.getByLabelText('Solar System Capacity')
    await user.selectOptions(capacitySelect, '3KW')
    
    const submitButton = screen.getByRole('button', { name: 'Submit Requirement' })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith('customer_requirements')
    })
    
    await waitFor(() => {
      expect(screen.getByText('Requirements submitted successfully!')).toBeInTheDocument()
    })
  })

  it('handles form submission error', async () => {
    const user = userEvent.setup()
    const mockInsert = vi.mocked(supabase.from).mockReturnValue({
      insert: vi.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } }),
    } as any)
    
    renderWithAuth(<CustomerRequirements />)
    
    // Fill all required fields
    await user.type(screen.getByLabelText('Name'), 'John Doe')
    await user.type(screen.getByLabelText('Email ID'), 'john@example.com')
    await user.type(screen.getByLabelText('Consumer Mobile Number'), '1234567890')
    
    // Select state and district
    const stateSelect = screen.getByLabelText('State')
    await user.selectOptions(stateSelect, 'Bihar')
    
    const districtSelect = screen.getByLabelText('District')
    await user.selectOptions(districtSelect, 'Patna')
    
    const discomSelect = screen.getByLabelText('DISCOM (Electricity Board)')
    await user.selectOptions(discomSelect, 'NBPDCL')
    
    // Property information
    const propertyTypeSelect = screen.getByLabelText('Property Type')
    await user.selectOptions(propertyTypeSelect, 'Residential')
    
    const roofTypeSelect = screen.getByLabelText('Roof Type')
    await user.selectOptions(roofTypeSelect, 'Concrete')
    
    // System requirements
    const billInput = screen.getByLabelText('Monthly Electricity Bill (₹)')
    await user.type(billInput, '5000')
    
    const capacitySelect = screen.getByLabelText('Solar System Capacity')
    await user.selectOptions(capacitySelect, '3KW')
    
    const submitButton = screen.getByRole('button', { name: 'Submit Requirement' })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Failed to submit requirements. Please try again.')).toBeInTheDocument()
    })
  })

  it('validates numeric fields', async () => {
    const user = userEvent.setup()
    renderWithAuth(<CustomerRequirements />)
    
    // Fill personal info
    await user.type(screen.getByLabelText('Name'), 'John Doe')
    await user.type(screen.getByLabelText('Email ID'), 'john@example.com')
    await user.type(screen.getByLabelText('Consumer Mobile Number'), '1234567890')
    
    // Try to enter non-numeric value in bill field
    const billInput = screen.getByLabelText('Monthly Electricity Bill (₹)')
    await user.type(billInput, 'abc')
    
    const submitButton = screen.getByRole('button', { name: 'Submit Requirement' })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(billInput).toHaveValue('abc')
    })
  })
}) 