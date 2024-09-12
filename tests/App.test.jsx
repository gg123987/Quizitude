import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import { ModalProvider } from '@/context/ModalContext';

test('renders the home page route', () => {
  render(
    <BrowserRouter>
      <ModalProvider>
        <App />
      </ModalProvider>
    </BrowserRouter>
  );

  // Check if HomePage component is rendered for the root path
  expect(screen.getByText(/HomePage Content/i)).toBeInTheDocument();
});