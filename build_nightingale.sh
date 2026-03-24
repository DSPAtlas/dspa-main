#!/usr/bin/env bash
# Build the local dspa-nightingale fork and copy built packages into dspa-frontend/node_modules.
# Run from the project root:  ./build_nightingale.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
NIGHTINGALE_DIR="$PROJECT_ROOT/dspa-nightingale"
FRONTEND_DIR="$SCRIPT_DIR/dspa-frontend"
FRONTEND_NM="$FRONTEND_DIR/node_modules/@nightingale-elements"

echo "==> Installing dspa-nightingale dependencies..."
cd "$NIGHTINGALE_DIR"
npm install --legacy-peer-deps

echo "==> Building all nightingale workspaces..."
npx lerna run build

echo "==> Copying built packages into dspa-frontend/node_modules..."
for pkg in "$NIGHTINGALE_DIR"/packages/*/; do
  pkg_name=$(node -p "require('$pkg/package.json').name" 2>/dev/null) || continue
  # strip @nightingale-elements/ scope prefix
  short_name="${pkg_name#@nightingale-elements/}"
  target="$FRONTEND_NM/$short_name"
  if [ -d "$target" ] && [ -d "$pkg/dist" ]; then
    echo "    $short_name"
    rm -rf "$target/dist"
    cp -r "$pkg/dist" "$target/dist"
    # Also copy src/ — CRA's webpack may resolve TypeScript sources instead of dist
    if [ -d "$pkg/src" ]; then
      rm -rf "$target/src"
      cp -r "$pkg/src" "$target/src"
    fi
  fi
done

# Clear webpack cache so the dev server picks up updated packages
if [ -d "$FRONTEND_DIR/node_modules/.cache" ]; then
  echo "==> Clearing webpack cache..."
  rm -rf "$FRONTEND_DIR/node_modules/.cache"
fi

# Update dspa-nightingale-bundle if it exists
if [ -d "$PROJECT_ROOT/dspa-nightingale-bundle" ]; then
  echo "==> Updating dspa-nightingale-bundle..."
  for pkg in "$NIGHTINGALE_DIR"/packages/*/; do
    pkg_name=$(node -p "require('$pkg/package.json').name" 2>/dev/null) || continue
    short_name="${pkg_name#@nightingale-elements/}"
    target_bundle="$PROJECT_ROOT/dspa-nightingale-bundle/$short_name"
    if [ -d "$target_bundle" ] && [ -d "$pkg/dist" ]; then
      echo "    $short_name (bundle)"
      rm -rf "$target_bundle/dist"
      cp -r "$pkg/dist" "$target_bundle/dist"
      if [ -d "$pkg/src" ]; then
        rm -rf "$target_bundle/src"
        cp -r "$pkg/src" "$target_bundle/src"
      fi
    fi
  done
fi

# Update @dspa-nightingale in node_modules
DSPA_NM="$FRONTEND_DIR/node_modules/@dspa-nightingale"
if [ -d "$DSPA_NM" ]; then
  echo "==> Updating @dspa-nightingale in node_modules..."
  for pkg in "$NIGHTINGALE_DIR"/packages/*/; do
    pkg_name=$(node -p "require('$pkg/package.json').name" 2>/dev/null) || continue
    short_name="${pkg_name#@nightingale-elements/}"
    target="$DSPA_NM/$short_name"
    if [ -d "$target" ] && [ -d "$pkg/dist" ]; then
      echo "    $short_name (@dspa-nightingale)"
      rm -rf "$target/dist"
      cp -r "$pkg/dist" "$target/dist"
      if [ -d "$pkg/src" ]; then
        rm -rf "$target/src"
        cp -r "$pkg/src" "$target/src"
      fi
    fi
  done
fi

echo "==> Done. Restart the frontend dev server to pick up changes."
