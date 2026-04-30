#!/usr/bin/env bash
set -euo pipefail

# Always change to the root repo directory to run script from anywhere
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$REPO_ROOT"

VERSION="$(cat VERSION)"
export VERSION
COMMAND=${1:-}
ENV=${2:-}

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
    echo "Built image version $VERSION"
    ;;
  start)
    if [[ "$ENV" != "dev" && "$ENV" != "prod"  && "$ENV" != "test" ]]; then
      echo "Unknown deployment environment '$ENV', specify one of the following: dev|test|prod"
    fi
    case "$ENV" in
      prod)
        docker compose -f docker/docker-compose.yml up -d
        ;;
      dev)
        docker compose -f docker/docker-compose.yml -f docker/docker-compose.development.yml up -d
        ;;
      test)
        docker compose -f docker/docker-compose.yml -f docker/docker-compose.test.yml up -d
        ;;
    esac
    ;;
  stop)
    docker compose -f docker/docker-compose.yml down
    ;;
  *)
    usage
    exit 1
    ;;
esac
