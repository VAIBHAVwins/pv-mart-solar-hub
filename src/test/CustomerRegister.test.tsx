
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CustomerRegister from '../pages/customer/Register';

// Mock the auth context
const mockUseSupabaseAuth = vi.fn();
vi.mock('../contexts/SupabaseAuthContext', () => ({
  useSupabaseAuth: () => mockUseSupabaseAuth(),
}));

describe('CustomerRegister', () => {
  beforeEach(() => {
    mockUseSupabaseAuth.mockReturnValue({
      user: null,
      signUp: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
      loading: false,
    });
  });

  it('renders registration form', () => {
    render(
      <MemoryRouter>
        <CustomerRegister />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Customer Registration')).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    render(
      <MemoryRouter>
        <CustomerRegister />
      </MemoryRouter>
    );
    
    const submitButton = screen.getByRole('button', { name: /register/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });
});
