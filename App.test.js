import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the navbar with the main title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Incredible India/i);
  expect(titleElement).toBeInTheDocument();
});
