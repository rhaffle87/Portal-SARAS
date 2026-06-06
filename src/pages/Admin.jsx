// Admin — Administration Page
import { useState } from 'react';
import { useKeycloak } from '../context/KeycloakContext';
import { Rocket, Server, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';

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
      <div className="flex flex-col gap-6">
        <h2 className="text-[1.75rem] font-semibold text-text-primary m-0">Administrasi Sistem</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Backend API Info */}
          <div className="card flex flex-col gap-6 p-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-[42px] h-[42px] rounded-lg bg-brand-subtle text-brand-light flex-shrink-0">
                <Server size={20} aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary m-0">Konfigurasi API</h3>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-text-secondary">Backend API URL</span>
              <code className="font-mono text-[0.8125rem] text-brand-light bg-neutral-bg3 px-3 py-2 rounded-md border border-border-default break-all">{BACKEND_URL || 'Belum dikonfigurasi'}</code>
            </div>
          </div>

          {/* Deploy Control */}
          <div className="card flex flex-col gap-6 p-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-[42px] h-[42px] rounded-lg bg-brand-subtle text-brand-light flex-shrink-0">
                <Rocket size={20} aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary m-0">Deploy Control</h3>
            </div>

            <div className="flex flex-col gap-5">
              <p className="text-[0.8125rem] text-text-secondary leading-relaxed m-0">
                Memicu build otomatis dan melakukan restart service PM2 pada server produksi.
              </p>
              <button
                disabled={!canManage || deploying}
                onClick={triggerDeploy}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:not-disabled:bg-brand-hover hover:not-disabled:shadow-[0_4px_12px_rgba(239,68,68,0.25)] w-fit"
                aria-label="Trigger deployment ke produksi"
              >
                {deploying ? (
                  <>
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
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
            className={`card mt-4 p-6 ${hasError ? 'bg-red-500/8 border border-red-500/20' : 'bg-emerald-500/8 border border-emerald-500/20'}`}
            role="status"
            aria-live="polite"
          >
            <div className={`flex items-center gap-2 text-sm font-bold mb-4 ${hasError ? 'text-red-300' : 'text-emerald-300'}`}>
              {hasError ? (
                <AlertCircle size={20} aria-hidden="true" />
              ) : (
                <CheckCircle size={20} aria-hidden="true" />
              )}
              <span>{hasError ? 'Deploy Gagal' : 'Deploy Berhasil'}</span>
            </div>
            <pre className="font-mono text-xs leading-relaxed bg-black/30 border border-border-default p-4 rounded-lg overflow-x-auto m-0 text-text-secondary">{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Admin;
