#!/usr/bin/env bash
set -euo pipefail

echo "Starting Chess Game..."

if command -v python3 >/dev/null 2>&1; then
  PY=python3
elif command -v python >/dev/null 2>&1; then
  PY=python
elif command -v py >/dev/null 2>&1; then
  PY="py -3"
else
  echo "Error: Python is not installed." >&2
  exit 1
fi

exec ${PY} server.py
