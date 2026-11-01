#!/bin/sh
# Usage: deploy.sh [--check-compose-stdin] [sha-xxxxxxx]   (no tag = redeploy the IMAGE_TAG in .env)
# --check-compose-stdin: CI sends the commit's compose.prod.yml. It is only compared, never
# installed (the CI key must not be able to change what containers run with), so an
# out-of-date compose.yml stops the deploy before anything restarts.
set -eu
cd /srv/shortlist
exec 9>.deploy.lock
flock 9
check_compose=false
if [ "${1:-}" = "--check-compose-stdin" ]; then
  check_compose=true
  shift
fi
if [ $# -gt 0 ]; then
  case "$1" in
    sha-[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]) ;;
    *) echo "invalid tag: '$1'" >&2; exit 2 ;;
  esac
  export IMAGE_TAG="$1"
fi
if $check_compose; then
  expected=$(mktemp)
  trap 'rm -f "$expected"' EXIT
  head -c 1048576 > "$expected"
  if [ ! -s "$expected" ]; then
    echo "no compose file on stdin" >&2; exit 2
  fi
  if ! cmp -s "$expected" compose.yml; then
    echo "compose.yml is out of date: upload compose.prod.yml from this commit, then re-run the deploy" >&2
    diff -u compose.yml "$expected" | head -60 >&2 || true
    exit 3
  fi
fi
# Catches a variable compose.yml requires that .env doesn't set, before anything restarts.
docker compose config --quiet
docker compose pull --quiet
docker compose up -d --no-build
if [ $# -gt 0 ]; then
  sed -i "s/^IMAGE_TAG=.*/IMAGE_TAG=$1/" .env
fi
docker image prune -f
docker compose ps -a
grep '^IMAGE_TAG=' .env
