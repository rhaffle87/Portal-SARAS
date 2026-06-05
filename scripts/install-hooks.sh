#!/bin/sh
set -e
cd "$(git rev-parse --show-toplevel)"

echo "Setting git hooks path to .githooks"
git config core.hooksPath .githooks

echo "Git hooks installed. Post-commit deploy will run after each commit."
