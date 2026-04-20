#!/usr/bin/env bash
set -euo pipefail

# Always change to the root repo directory to run script from anywhere
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$REPO_ROOT"

COMMAND=${1:-}

usage() {
  echo "Usage: $0 <command>"
  echo ""
  echo "Commands:"
  echo "  build   Build the Docker image"
  echo "  start   Start the containers"
  echo "  stop    Stop the containers"
}

case "$COMMAND" in
  build)
    echo "Extracting NEXT_PUBLIC_* variables from .env to .env.docker..."
    grep '^NEXT_PUBLIC_' .env > .env.docker
    echo "Done. Running docker compose build..."
    docker compose -f docker/docker-compose.yml build
    ;;
  start)
    docker compose -f docker/docker-compose.yml up -d
    ;;
  stop)
    docker compose -f docker/docker-compose.yml down
    ;;
  *)
    usage
    exit 1
    ;;
esac
