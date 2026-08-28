#!/bin/bash
set -e
pnpm install --frozen-lockfile
# Versioned migrations, not `push`. Push reshapes the database to match the
# schema and can drop columns and tables; migrations are reviewable and
# additive, and re-running them is a no-op.
pnpm --filter @workspace/db run migrate
