#!/usr/bin/env bash

set -Eeuo pipefail

archive_path="${1:?Release archive path is required}"
release_id="${2:?Release id is required}"
app_dir="${VISION_APP_DIR:-/opt/vision-design-system}"
deploy_dir="${app_dir}/.deploy"
staging_dir="${deploy_dir}/staging-${release_id}"
backup_dir="${deploy_dir}/backup-${release_id}"
version_file="${app_dir}/.deploy-version"

cleanup() {
  rm -rf "${staging_dir}"
  rm -f "${archive_path}" /tmp/deploy-release.sh
}

rollback() {
  local exit_code=$?
  trap - ERR

  echo "Deployment failed; restoring the previous release."

  if [[ -d "${backup_dir}/dist/docs" ]]; then
    mkdir -p "${app_dir}/dist/docs"
    rsync -a --delete "${backup_dir}/dist/docs/" "${app_dir}/dist/docs/"
  fi

  if [[ -d "${backup_dir}/server" ]]; then
    mkdir -p "${app_dir}/server"
    rsync -a --delete "${backup_dir}/server/" "${app_dir}/server/"
  fi

  if [[ -f "${backup_dir}/.deploy-version" ]]; then
    cp "${backup_dir}/.deploy-version" "${version_file}"
  else
    rm -f "${version_file}"
  fi

  systemctl restart vision-ai || true
  cleanup
  exit "${exit_code}"
}

trap rollback ERR

rm -rf "${staging_dir}" "${backup_dir}"
mkdir -p "${staging_dir}" "${backup_dir}"
tar -xzf "${archive_path}" -C "${staging_dir}"

test -f "${staging_dir}/dist/docs/index.html"
test -f "${staging_dir}/server/app.mjs"
test -f "${staging_dir}/server/deepseek.mjs"

if [[ -d "${app_dir}/dist/docs" ]]; then
  mkdir -p "${backup_dir}/dist/docs"
  rsync -a "${app_dir}/dist/docs/" "${backup_dir}/dist/docs/"
fi

if [[ -d "${app_dir}/server" ]]; then
  mkdir -p "${backup_dir}/server"
  rsync -a "${app_dir}/server/" "${backup_dir}/server/"
fi

if [[ -f "${version_file}" ]]; then
  cp "${version_file}" "${backup_dir}/.deploy-version"
fi

mkdir -p "${app_dir}/dist/docs" "${app_dir}/server"
rsync -a --delete "${staging_dir}/dist/docs/" "${app_dir}/dist/docs/"
rsync -a --delete "${staging_dir}/server/" "${app_dir}/server/"
printf '%s\n' "${release_id}" > "${version_file}"

systemctl restart vision-ai
nginx -t
systemctl reload nginx

curl \
  --fail \
  --retry 5 \
  --retry-delay 1 \
  --show-error \
  --silent \
  http://127.0.0.1:3100/api/health

trap - ERR
cleanup

find "${deploy_dir}" \
  -mindepth 1 \
  -maxdepth 1 \
  -type d \
  -name 'backup-*' \
  -printf '%T@ %p\n' \
  | sort -nr \
  | tail -n +4 \
  | cut -d' ' -f2- \
  | xargs -r rm -rf

echo "Release ${release_id} deployed successfully."
