// Admin — Administration Page
import React, { useState } from 'react';
import { useKeycloak } from '../context/KeycloakContext';
import { Rocket, Server, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
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

  const hasError = result?.error || (result?.exitCode && result.exitCode !== 0);

  return (
    <Layout>
      <h2 style={{ marginBottom: 24 }}>Administrasi</h2>

      <div className="admin-grid">
        {/* Backend API Info */}
        <div className="card admin-info-card">
          <div className="admin-info-icon">
            <Server size={20} aria-hidden="true" />
          </div>
          <div>
            <div className="admin-info-label">Backend API URL</div>
            <div className="admin-info-value">{BACKEND_URL || 'Belum dikonfigurasi'}</div>
          </div>
        </div>

        {/* Deploy Control */}
        <div className="card admin-deploy-card">
          <div className="admin-deploy-header">
            <Rocket size={20} aria-hidden="true" />
            <h3>Deploy Control</h3>
          </div>
          <p className="admin-deploy-desc">
            Trigger build dan restart PM2 di server produksi.
          </p>
          <button
            disabled={!canManage || deploying}
            onClick={triggerDeploy}
            className="admin-deploy-btn"
            aria-label="Trigger deployment ke produksi"
          >
            {deploying ? (
              <>
                <Loader2 size={18} className="admin-spinner" aria-hidden="true" />
                Deploying…
              </>
            ) : (
              <>
                <Rocket size={18} aria-hidden="true" />
                Trigger Deploy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Deploy Result */}
      {result && (
        <div
          className={`card admin-result ${hasError ? 'admin-result--error' : 'admin-result--success'}`}
          role="status"
          aria-live="polite"
        >
          <div className="admin-result-header">
            {hasError ? (
              <AlertCircle size={18} aria-hidden="true" />
            ) : (
              <CheckCircle size={18} aria-hidden="true" />
            )}
            <span>{hasError ? 'Deploy gagal' : 'Deploy berhasil'}</span>
          </div>
          <pre className="admin-result-output">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </Layout>
  );
}

export default Admin;
