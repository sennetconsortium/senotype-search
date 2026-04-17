#!/usr/bin/env bash
set -euo pipefail

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
    docker compose build
    ;;
  start)
    docker compose up -d
    ;;
  stop)
    docker compose down
    ;;
  *)
    usage
    exit 1
    ;;
esac
