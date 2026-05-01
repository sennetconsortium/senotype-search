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

if [[ "$ENV" != "dev" && "$ENV" != "prod"  && "$ENV" != "test" ]]; then
    echo "Unknown deployment environment '$ENV', specify one of the following: dev|test|prod"
fi

case "$COMMAND" in
  build)
    echo "Extracting NEXT_PUBLIC_* variables from .env to .env.docker..."
    grep '^NEXT_PUBLIC_' .env > .env.docker
    echo "Done. Running docker compose build..."
     case "$ENV" in
      prod|dev)
        docker compose -f docker/docker-compose.yml -p senotype-library build
        ;;
      test)
        docker compose -f docker/docker-compose.test.yml -p senotype-library-test build
        ;;
    esac
    echo "Built image version $VERSION"
    ;;
  start)
    case "$ENV" in
      prod)
        docker compose -f docker/docker-compose.yml -p senotype-library up -d
        ;;
      dev)
        docker compose -f docker/docker-compose.yml -f docker/docker-compose.development.yml -p senotype-library up -d
        ;;
      test)
        docker compose -f docker/docker-compose.test.yml -p senotype-library-test  up -d
        ;;
    esac
    ;;
  stop)
     case "$ENV" in
      prod|dev)
        docker compose -f docker/docker-compose.yml -p senotype-library down
        ;;
      test)
        docker compose -f docker/docker-compose.test.yml -p senotype-library-test down
        ;;
    esac
    ;;
  *)
    usage
    exit 1
    ;;
esac
