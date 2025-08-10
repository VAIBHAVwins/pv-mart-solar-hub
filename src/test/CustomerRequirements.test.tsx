
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import RequirementForm from '../pages/customer/RequirementForm';

// Mock the auth context
const mockUseSupabaseAuth = vi.fn();
vi.mock('../contexts/SupabaseAuthContext', () => ({
  useSupabaseAuth: () => mockUseSupabaseAuth(),
}));

describe('RequirementForm', () => {
  beforeEach(() => {
    mockUseSupabaseAuth.mockReturnValue({
      user: { id: '1', email: 'test@example.com' },
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      loading: false,
    });
  });

  it('renders requirement form', () => {
    render(
      <MemoryRouter>
        <RequirementForm />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Solar Requirement Form')).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    render(
      <MemoryRouter>
        <RequirementForm />
      </MemoryRouter>
    );
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });
});
