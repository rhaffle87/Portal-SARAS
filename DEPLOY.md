# Deployment and self-hosted runner

This document explains how to deploy the portal using the included GitHub Actions workflow and a self-hosted runner inside your private network.

Why use a self-hosted runner?
- GitHub-hosted runners cannot reach private RFC1918 addresses (e.g. 10.x.x.x). Using a runner inside the same network allows secure direct SCP/SSH from the runner to the target host.

Overview
1. Build runs on GitHub-hosted runner and uploads `build` as an artifact.
2. A `deploy` job runs on a self-hosted runner (machine inside your network), downloads the artifact, copies files to the target server, and restarts `pm2`.

Steps

1) Prepare a machine inside the same network as the target server (can be the target host itself).

2) Install and register a GitHub Actions self-hosted runner:

```bash
# create a directory to hold the runner
mkdir -p ~/actions-runner && cd ~/actions-runner

# get a registration token for this repository (requires gh CLI auth)
GH_REPO="rhaffle87/Portal-SARAS"
REG_TOKEN=$(gh api -X POST /repos/$GH_REPO/actions/runners/registration-token | jq -r .token)

# download latest runner (example; check latest version)
ARCHIVE=actions-runner-linux-x64-2.308.0.tar.gz
curl -O -L https://github.com/actions/runner/releases/download/v2.308.0/$ARCHIVE
tar xzf $ARCHIVE

# configure the runner (update labels if you like)
./config.sh --url https://github.com/$GH_REPO --token "$REG_TOKEN" --labels self-hosted,linux,its

# install as a service (optional)
sudo ./svc.sh install
sudo ./svc.sh start
```

3) Ensure the runner can SSH to the target host (add runner's public key to `portal` user's `~/.ssh/authorized_keys` on the target host), or set the repository secret `SSH_PRIVATE_KEY` to the private key the runner will use.

4) Add repository secrets (Repository -> Settings -> Secrets and variables -> Actions):
- `SSH_HOST` (e.g. `10.28.10.58`)
- `SSH_USER` (e.g. `portal`)
- `SSH_TARGET_PATH` (e.g. `/home/portal/Portal-SARAS`)
- `SSH_PRIVATE_KEY` (private key contents) *or* ensure runner has key in `~/.ssh`.
- `SSH_PORT` (optional, default `22`)

5) Push to `main` or rerun the deploy workflow. The `deploy` job will run on your self-hosted runner and perform the copy and restart.

Security notes
- Never commit private keys into the repository. Use repository secrets or place keys in the runner user's `~/.ssh` with strict permissions.
- Only register trusted machines as runners — a self-hosted runner has access to your repository and secrets while jobs run.

Troubleshooting
- If deploy job times out trying to reach the server, verify network connectivity from the runner to the target with `ssh -vvv` and `nc -vz`.
- If `pm2` restart fails, SSH into the target and check `pm2 status` and application logs.

Contact
If you want me to automate runner registration or help validate connectivity, say which machine will host the runner and I’ll provide exact commands you can run there.
