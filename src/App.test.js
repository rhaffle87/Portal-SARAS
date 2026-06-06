/* global vi */

import React from 'react';
import App from './App';
import { render, screen } from '@testing-library/react';

vi.mock('./context/KeycloakContext', () => ({
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
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({})
  });
});

afterAll(() => {
  global.fetch.mockRestore?.();
});

test('renders the portal home page', async () => {
  render(React.createElement(App));
  expect(await screen.findByText(/Aplikasi dan Layanan/i)).toBeInTheDocument();
});
