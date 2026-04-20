import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import Header from '@src/components/Header';
import uiReducer from '@src/store/slices/uiSlice';
import authReducer from '@src/store/slices/authSlice';

// Helper to create a store with a pre-loaded logged-in user
const createStore = (user = { first_name: 'John', last_name: 'Doe', email: 'john@example.com', role: 'admin' }) =>
  configureStore({
    reducer: { auth: authReducer, ui: uiReducer },
    preloadedState: { auth: { user, isAuthenticated: true, isLoading: false, error: null } },
  });

// Helper to render Header with a store and router (Header needs both)
const renderHeader = (user) => {
  const store = createStore(user);
  render(
    <Provider store={store}>
      <MemoryRouter future={{ v7_relativeSplatPath: true }}>
        <Header />
      </MemoryRouter>
    </Provider>
  );
  return store;
};

describe('Header Component', () => {
  it('should render the app title', () => {
    renderHeader();
    expect(screen.getByText('Retail Inventory Management')).toBeInTheDocument();
  });

  it('should show the first letter of the user\'s first name in the Avatar', () => {
    renderHeader({ first_name: 'Alice', email: 'alice@example.com', role: 'manager' });
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('should show "U" in Avatar if user first name is missing', () => {
    renderHeader({ first_name: null, email: 'no-name@example.com', role: 'staff' });
    expect(screen.getByText('U')).toBeInTheDocument();
  });

  it('should open the profile dropdown menu when avatar is clicked', () => {
    renderHeader();
    // Click the avatar button to open the menu
    const avatarButton = screen.getByRole('button', { name: /J/i });
    fireEvent.click(avatarButton);

    // These items should appear in the dropdown
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('should show user info in the dropdown when opened', () => {
    renderHeader({ first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com', role: 'manager' });
    const avatarButton = screen.getByRole('button', { name: /J/i });
    fireEvent.click(avatarButton);

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('MANAGER')).toBeInTheDocument();
  });
});
