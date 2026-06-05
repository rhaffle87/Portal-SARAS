import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Keycloak from 'keycloak-js';
import Beranda from './Beranda';
import Login from './Login'; // pastikan file Login.js atau Login.jsx ada

// Konfigurasi Keycloak
const keycloak = new Keycloak({
  url: 'https://10.3.131.175:8443', // URL Keycloak server
  realm: 'S4RAS',  // Ganti dengan nama realm yang kamu buat
  clientId: 'front-end', // Ganti dengan nama client yang kamu buat
});

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    keycloak.init({ onLoad: 'login-required' }).then(authenticated => {
      setAuthenticated(authenticated);
    }).catch((error) => {
      console.error("Keycloak initialization failed:", error);
    });
  }, []);

  if (!authenticated) {
    return <div>Loading...</div>; // Tampilkan loading hingga proses autentikasi selesai
  }

  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Beranda />} />
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
