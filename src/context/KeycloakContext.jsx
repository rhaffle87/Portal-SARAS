// KeycloakContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import Keycloak from 'keycloak-js';

const KeycloakContext = createContext();

export const useKeycloak = () => useContext(KeycloakContext);

export const KeycloakProvider = ({ children }) => {
  const [keycloak, setKeycloak] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (keycloak && authenticated) {
      const realmRoles = keycloak.realmAccess?.roles || [];
      const clientRoles = keycloak.resourceAccess?.['front-end']?.roles || [];
      const roleAttr = profile?.attributes?.role;
      const username = (profile?.username || '').toLowerCase();

      const hasAdmin =
        realmRoles.some(r => r.toLowerCase() === 'admin') ||
        clientRoles.some(r => r.toLowerCase() === 'admin') ||
        username === 'admin' ||
        (Array.isArray(roleAttr) && roleAttr.some(r => r.toLowerCase() === 'admin')) ||
        (typeof roleAttr === 'string' && roleAttr.toLowerCase() === 'admin');

      setIsAdmin(hasAdmin);
    } else {
      setIsAdmin(false);
    }
  }, [keycloak, authenticated, profile]);

  useEffect(() => {
    const keycloakInstance = new Keycloak({
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

    // Force HTTPS on production domain
    if (window.location.hostname === 'portal.s4ras.site' && window.location.protocol === 'http:') {
      window.location.replace('https://portal.s4ras.site' + window.location.pathname + window.location.search);
      return;
    }

    const getRedirectUri = () => {
      if (window.location.hostname === 'portal.s4ras.site') {
        return 'https://portal.s4ras.site/';
      }
      return window.location.origin + '/';
    };

    const redirectUri = getRedirectUri();

    console.debug('[Keycloak] init start', { url: window.location.href, redirectUri, isCallback: isCallback() });

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
      pkceMethod: 'S256',
      redirectUri
    }).then(auth => {
      console.debug('[Keycloak] init finished', { authenticated: auth, token: !!keycloakInstance.token });
      setKeycloak(keycloakInstance);
      setAuthenticated(!!auth);
      setInitialized(true);

      // If not authenticated and this is NOT the OIDC callback, trigger login.
      // This avoids calling login() repeatedly while the browser is finishing the redirect
      if (!auth && !isCallback()) {
        console.debug('[Keycloak] not authenticated and not callback — calling login()');
        keycloakInstance.login({ redirectUri });
      } else if (auth) {
        console.debug('[Keycloak] authenticated after init', { tokenParsed: keycloakInstance.tokenParsed });
        keycloakInstance.loadUserProfile().then(profileData => {
          setProfile(profileData);
        }).catch(err => {
          console.warn('[Keycloak] profile fetch failed', err);
        });
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
      setProfile(null);
    };
  }, []);

  const logout = () => {
    if (keycloak) {
      keycloak.logout();
    }
  };

  return (
    <KeycloakContext.Provider value={{ keycloak, authenticated, initialized, profile, logout, isAdmin }}>
      {children}
    </KeycloakContext.Provider>
  );
};
