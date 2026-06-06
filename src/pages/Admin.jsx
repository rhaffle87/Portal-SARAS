// Admin — Administration Page
import React, { useState } from 'react';
import { useKeycloak } from '../context/KeycloakContext';
import { Rocket, Server, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import './Admin.css';

const BACKEND_URL = process.env.REACT_APP_BACKEND_API_URL || '';
const DEPLOY_TOKEN = process.env.REACT_APP_DEPLOY_TOKEN || '';

function Admin() {
  const { profile, isAdmin } = useKeycloak();
  const [deploying, setDeploying] = useState(false);
  const [result, setResult] = useState(null);

  const canManage = !!isAdmin;

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
      <div className="admin-page">
        <h2 className="page-title">Administrasi Sistem</h2>

        <div className="admin-grid">
          {/* Backend API Info */}
          <div className="card admin-card info-card-layout">
            <div className="info-card-header">
              <div className="admin-info-icon">
                <Server size={20} aria-hidden="true" />
              </div>
              <h3 className="card-heading">Konfigurasi API</h3>
            </div>
            
            <div className="info-body">
              <span className="info-label">Backend API URL</span>
              <code className="info-value">{BACKEND_URL || 'Belum dikonfigurasi'}</code>
            </div>
          </div>

          {/* Deploy Control */}
          <div className="card admin-card deploy-card-layout">
            <div className="deploy-card-header">
              <div className="admin-deploy-icon">
                <Rocket size={20} aria-hidden="true" />
              </div>
              <h3 className="card-heading">Deploy Control</h3>
            </div>
            
            <div className="deploy-body">
              <p className="deploy-desc">
                Memicu build otomatis dan melakukan restart service PM2 pada server produksi.
              </p>
              <button
                disabled={!canManage || deploying}
                onClick={triggerDeploy}
                className="btn-trigger-deploy"
                aria-label="Trigger deployment ke produksi"
              >
                {deploying ? (
                  <>
                    <Loader2 size={16} className="admin-spinner animate-spin" aria-hidden="true" />
                    <span>Deploying…</span>
                  </>
                ) : (
                  <>
                    <Rocket size={16} aria-hidden="true" />
                    <span>Trigger Deploy</span>
                  </>
                )}
              </button>
            </div>
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
                <AlertCircle size={20} aria-hidden="true" />
              ) : (
                <CheckCircle size={20} aria-hidden="true" />
              )}
              <span>{hasError ? 'Deploy Gagal' : 'Deploy Berhasil'}</span>
            </div>
            <pre className="admin-result-output">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Admin;
