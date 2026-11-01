#!/bin/sh
# Forced command for the CI key: the SSH "command" is only ever passed on as a tag, and
# stdin is the commit's compose.prod.yml, checked against the server's copy.
exec /srv/shortlist/deploy.sh --check-compose-stdin "${SSH_ORIGINAL_COMMAND:-}"
