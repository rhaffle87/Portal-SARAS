// KeycloakContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import Keycloak from 'keycloak-js';

const KeycloakContext = createContext();

export const useKeycloak = () => useContext(KeycloakContext);

export const KeycloakProvider = ({ children }) => {
  const [keycloak, setKeycloak] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const keycloakInstance = new Keycloak({
      // 1. UBAH KE DOMAIN HTTPS RESMI REVERSE PROXY ANDA
      url: 'https://sso.s4ras.site', 
      realm: 'S4RAS',
      clientId: 'front-end',
    });

    const isCallback = () => {
      try {
        const h = window.location.hash || '';
        const s = window.location.search || '';
        return h.includes('code=') || h.includes('session_state') || s.includes('code=') || s.includes('session_state');
      } catch (e) {
        return false;
      }
    };

    console.debug('[Keycloak] init start', { url: window.location.href, isCallback: isCallback() });

    // use check-sso so we can detect state first and only call login when appropriate
    keycloakInstance.onReady = () => {};

    // add listeners for debugging
    keycloakInstance.onAuthSuccess = () => console.debug('[Keycloak] onAuthSuccess');
    keycloakInstance.onAuthError = (err) => console.error('[Keycloak] onAuthError', err);
    keycloakInstance.onAuthRefreshSuccess = () => console.debug('[Keycloak] onAuthRefreshSuccess');
    keycloakInstance.onAuthRefreshError = () => console.error('[Keycloak] onAuthRefreshError');
    keycloakInstance.onTokenExpired = () => console.debug('[Keycloak] onTokenExpired');

    keycloakInstance.init({
      onLoad: 'check-sso',
      checkLoginIframe: false,
      pkceMethod: 'S256'
    }).then(auth => {
      console.debug('[Keycloak] init finished', { authenticated: auth, token: !!keycloakInstance.token });
      setKeycloak(keycloakInstance);
      setAuthenticated(!!auth);
      setInitialized(true);

      // If not authenticated and this is NOT the OIDC callback, trigger login.
      // This avoids calling login() repeatedly while the browser is finishing the redirect
      if (!auth && !isCallback()) {
        console.debug('[Keycloak] not authenticated and not callback — calling login()');
        keycloakInstance.login();
      } else if (auth) {
        console.debug('[Keycloak] authenticated after init', { tokenParsed: keycloakInstance.tokenParsed });
      }

      // Clean up URL (remove code/state from hash) after init to avoid re-processing
      if (isCallback()) {
        try {
          const newUrl = window.location.pathname + window.location.search;
          window.history.replaceState({}, document.title, newUrl);
        } catch (e) {
          // ignore
        }
      }
    }).catch((error) => {
      console.error('Keycloak initialization failed:', error);
      setInitialized(true);
    });

    // Cleanup on component unmount
    return () => {
      setKeycloak(null);
      setAuthenticated(false);
      setInitialized(false);
    };
  }, []);

  return (
    <KeycloakContext.Provider value={{ keycloak, authenticated, initialized }}>
      {children}
    </KeycloakContext.Provider>
  );
};
