import React, { useState } from 'react';
import { useKeycloak } from '../context/KeycloakContext';
import './Admin.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_API_URL || '';
const DEPLOY_TOKEN = process.env.REACT_APP_DEPLOY_TOKEN || '';

function Admin() {
  const { profile } = useKeycloak();
  const [deploying, setDeploying] = useState(false);
  const [result, setResult] = useState(null);

  const canManage = !!profile; // refine with roles later

  const triggerDeploy = async () => {
    setDeploying(true);
    setResult(null);
    try {
      const res = await fetch('http://localhost:4000/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Deploy-Token': DEPLOY_TOKEN
        },
        body: JSON.stringify({ triggeredBy: profile?.username || 'unknown' })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="admin-panel">
      <h2>Admin</h2>
      <div className="admin-row">
        <div className="admin-label">Backend API URL</div>
        <div className="admin-value">{BACKEND_URL || 'Not configured'}</div>
      </div>

      <div className="admin-row">
        <div className="admin-label">Deploy Control</div>
        <div className="admin-value">
          <button disabled={!canManage || deploying} onClick={triggerDeploy} className="deploy-btn">
            {deploying ? 'Deploying…' : 'Trigger Deploy'}
          </button>
        </div>
      </div>

      {result && (
        <pre className="admin-result">{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}

export default Admin;
