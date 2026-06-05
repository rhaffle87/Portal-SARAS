// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock Keycloak for Jest so `keycloak-js` ESM code does not break tests.
jest.mock('keycloak-js', () => {
  return jest.fn().mockImplementation(() => ({
    init: jest.fn().mockResolvedValue(true),
    login: jest.fn(),
    logout: jest.fn(),
    loadUserProfile: jest.fn().mockResolvedValue({
      username: 'ci-user',
      email: 'ci-user@example.com',
      firstName: 'CI',
      lastName: 'User',
      attributes: { role: ['admin'] }
    }),
    onReady: null,
    onAuthSuccess: null,
    onAuthError: null,
    onAuthRefreshSuccess: null,
    onAuthRefreshError: null,
    onTokenExpired: null,
    token: 'fake-token',
    tokenParsed: {
      preferred_username: 'ci-user'
    }
  }));
});
