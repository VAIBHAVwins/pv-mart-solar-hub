
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import CustomerRequirements from '@/pages/customer/Requirements'

// Mock the useSupabaseAuth hook
const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com'
}

vi.mock('@/contexts/SupabaseAuthContext', () => ({
  useSupabaseAuth: () => ({
    user: mockUser,
    session: { user: mockUser },
    loading: false,
    userRole: 'customer',
    signUp: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
    resetPassword: vi.fn()
  })
}))

// Mock supabase client
const mockSelect = vi.fn()
const mockEq = vi.fn()
const mockOrder = vi.fn()

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: mockSelect,
      eq: mockEq,
      order: mockOrder
    }))
  }
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

describe('CustomerRequirements', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup mock chain
    mockOrder.mockReturnValue({
      then: vi.fn().mockResolvedValue({
        data: [],
        error: null
      })
    })
    mockEq.mockReturnValue({
      order: mockOrder
    })
    mockSelect.mockReturnValue({
      eq: mockEq
    })
  })

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <CustomerRequirements />
      </MemoryRouter>
    )
  }

  it('renders customer requirements page', async () => {
    renderComponent()
    
    await waitFor(() => {
      expect(screen.getByText('My Requirements')).toBeInTheDocument()
    })
  })

  it('shows empty state when no requirements', async () => {
    renderComponent()
    
    await waitFor(() => {
      expect(screen.getByText(/no requirements found/i)).toBeInTheDocument()
    })
  })

  it('displays requirements when data is available', async () => {
    const mockRequirements = [
      {
        id: '1',
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        customer_phone: '9876543210',
        address: '123 Main St',
        pincode: '110001',
        monthly_bill: 5000,
        installation_type: 'rooftop',
        system_type: 'grid_tied',
        created_at: '2024-01-01T00:00:00Z'
      }
    ]

    mockOrder.mockReturnValue({
      then: vi.fn().mockResolvedValue({
        data: mockRequirements,
        error: null
      })
    })

    renderComponent()
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('john@example.com')).toBeInTheDocument()
      expect(screen.getByText('9876543210')).toBeInTheDocument()
    })
  })

  it('handles API errors gracefully', async () => {
    mockOrder.mockReturnValue({
      then: vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' }
      })
    })

    renderComponent()
    
    await waitFor(() => {
      expect(screen.getByText(/error loading requirements/i)).toBeInTheDocument()
    })
  })

  it('shows loading state initially', () => {
    renderComponent()
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })
})
