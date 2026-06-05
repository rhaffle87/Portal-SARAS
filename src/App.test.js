import { render, screen, waitFor } from '@testing-library/react';

jest.mock('./context/KeycloakContext', () => ({
  KeycloakProvider: ({ children }) => children,
  useKeycloak: () => ({
    authenticated: true,
    initialized: true,
    profile: {
      username: 'ci-user',
      email: 'ci-user@example.com'
    }
  })
}));

beforeAll(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({}),
  });
});

afterAll(() => {
  global.fetch.mockRestore?.();
});

import App from './App';

test('renders the portal home page', async () => {
  render(<App />);
  await waitFor(() => expect(screen.getByText(/Aplikasi dan Layanan/i)).toBeInTheDocument());
});
