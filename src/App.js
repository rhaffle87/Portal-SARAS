// App.js
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { KeycloakProvider, useKeycloak } from './context/KeycloakContext';
import Beranda from './pages/Beranda';

const AppRoutes = () => {
  const { authenticated, initialized } = useKeycloak();

  console.log('authenticated =', authenticated, 'initialized =', initialized);

  if (!initialized) {
    return <div>Loading...</div>; // Tunggu sampai Keycloak selesai melakukan inisialisasi
  }

  if (!authenticated) {
    return <div>Redirecting to login...</div>;  // Setelah inisialisasi, jika belum autentikasi
  }

  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Beranda />} />
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <KeycloakProvider>
      <AppRoutes />
    </KeycloakProvider>
  );
}

export default App;
