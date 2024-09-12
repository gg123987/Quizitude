import { render, screen } from '@testing-library/react';
import { AuthContext } from '@/context/AuthContext';
import AuthProvider from '@/context/AuthContext';

test('renders AuthProvider and provides context values', () => {
  render(
    <AuthProvider>
      <AuthContext.Consumer>
        {value => {
          expect(value).toBeDefined();
          expect(value.auth).toBe(false); // default state
          return null;
        }}
      </AuthContext.Consumer>
    </AuthProvider>
  );
});
