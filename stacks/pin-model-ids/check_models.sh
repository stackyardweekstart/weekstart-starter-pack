#!/usr/bin/env sh
# check_models.sh: fail if a config uses a floating or empty model name.
# Pattern only; adjust the key name ("model") to your config.
dir="${1:-.}"
bad=$(grep -rnEi '"?model"?\s*[:=]\s*("|'"'"')?(latest|default)?("|'"'"')?\s*,?\s*$|model.*-latest' "$dir" 2>/dev/null)
if [ -n "$bad" ]; then
  echo "Unpinned model found:"; echo "$bad"; exit 1
fi
echo "All models pinned."
