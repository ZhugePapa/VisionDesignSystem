#!/usr/bin/env bash

set -Eeuo pipefail

archive_path="${1:?Release archive path is required}"
release_id="${2:?Release id is required}"
app_dir="${VISION_APP_DIR:-/opt/vision-design-system}"
deploy_dir="${app_dir}/.deploy"
staging_dir="${deploy_dir}/staging-${release_id}"
backup_dir="${deploy_dir}/backup-${release_id}"
version_file="${app_dir}/.deploy-version"
environment_file="${VISION_ENV_FILE:-/etc/vision-ai.env}"
systemd_override_dir="${VISION_SYSTEMD_OVERRIDE_DIR:-/etc/systemd/system/vision-ai.service.d}"
service_user="${VISION_SERVICE_USER:-www-data}"
service_group="${VISION_SERVICE_GROUP:-www-data}"
public_url="${VISION_PUBLIC_URL:-https://vision.leoht.space}"
default_seed_password="${VISION_DEFAULT_SEED_PASSWORD:-}"

environment_value() {
  local key="$1"
  sed -n "s/^${key}=//p" "${environment_file}" | tail -n 1
}

ensure_environment_value() {
  local key="$1"
  local default_value="$2"
  local current_value=""

  if [[ -f "${environment_file}" ]]; then
    current_value="$(environment_value "${key}")"
  fi

  if [[ -n "${current_value}" ]]; then
    return
  fi

  if grep -q "^${key}=" "${environment_file}" 2>/dev/null; then
    sed -i.bak "s|^${key}=.*$|${key}=${default_value}|" "${environment_file}"
    rm -f "${environment_file}.bak"
  else
    if [[ -s "${environment_file}" && -n "$(tail -c 1 "${environment_file}")" ]]; then
      printf '\n' >> "${environment_file}"
    fi
    printf '%s=%s\n' "${key}" "${default_value}" >> "${environment_file}"
  fi
}

set_environment_value() {
  local key="$1"
  local value="$2"

  if grep -q "^${key}=" "${environment_file}" 2>/dev/null; then
    sed -i.bak "s|^${key}=.*$|${key}=${value}|" "${environment_file}"
    rm -f "${environment_file}.bak"
  else
    printf '%s=%s\n' "${key}" "${value}" >> "${environment_file}"
  fi
}

remove_environment_value() {
  local key="$1"

  if grep -q "^${key}=" "${environment_file}" 2>/dev/null; then
    sed -i.bak "/^${key}=/d" "${environment_file}"
    rm -f "${environment_file}.bak"
  fi
}

prepare_persistent_runtime() {
  local auth_secret=""
  local database_path=""
  local database_dir=""
  local upload_dir=""

  mkdir -p "$(dirname "${environment_file}")" "${systemd_override_dir}"
  touch "${environment_file}"
  chmod 600 "${environment_file}"

  auth_secret="$(openssl rand -hex 32)"
  if [[ -z "${default_seed_password}" ]]; then
    default_seed_password="$(openssl rand -hex 16)"
  fi
  ensure_environment_value NODE_ENV production
  ensure_environment_value AI_ALLOWED_ORIGIN "${public_url}"
  ensure_environment_value BETTER_AUTH_URL "${public_url}"
  ensure_environment_value BETTER_AUTH_SECRET "${auth_secret}"
  ensure_environment_value AI_SEED_PASSWORD "${default_seed_password}"
  ensure_environment_value VISION_BUILTIN_ACCOUNT_PASSWORD vision123456
  ensure_environment_value VISION_AI_DATABASE_PATH "${app_dir}/data/vision-ai.sqlite"
  ensure_environment_value VISION_AI_UPLOAD_DIR "${app_dir}/data/uploads"
  ensure_environment_value OPENCODE_GO_API_KEY ""
  ensure_environment_value OPENCODE_GO_BASE_URL https://opencode.ai/zen/go/v1

  if [[ -z "$(environment_value OPENCODE_GO_API_KEY)" ]]; then
    echo 'OPENCODE_GO_API_KEY is required before deploying this release.' >&2
    false
  fi

  set_environment_value AI_DEFAULT_MODEL gpt-5.6-luna
  for legacy_key in \
    DEEPSEEK_API_KEY \
    DEEPSEEK_BASE_URL \
    OLLAMA_API_KEY \
    OLLAMA_BASE_URL \
    OLLAMA_GLM_MODEL \
    OLLAMA_KIMI_MODEL \
    OLLAMA_KIMI_ENABLED; do
    remove_environment_value "${legacy_key}"
  done

  database_path="$(environment_value VISION_AI_DATABASE_PATH)"
  database_dir="$(dirname "${database_path}")"
  upload_dir="$(environment_value VISION_AI_UPLOAD_DIR)"

  install -d -o "${service_user}" -g "${service_group}" -m 0750 \
    "${database_dir}" \
    "${upload_dir}"
  chown -R "${service_user}:${service_group}" "${database_dir}" "${upload_dir}"

  printf '%s\n' \
    '[Service]' \
    "ReadWritePaths=${database_dir} ${upload_dir}" \
    > "${systemd_override_dir}/persistence.conf"
  systemctl daemon-reload
}

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

  if [[ -d "${backup_dir}/node_modules" ]]; then
    mkdir -p "${app_dir}/node_modules"
    rsync -a --delete "${backup_dir}/node_modules/" "${app_dir}/node_modules/"
  fi

  for manifest in package.json package-lock.json; do
    if [[ -f "${backup_dir}/${manifest}" ]]; then
      cp "${backup_dir}/${manifest}" "${app_dir}/${manifest}"
    fi
  done

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
test -f "${staging_dir}/server/models.mjs"
test -f "${staging_dir}/server/opencode-go.mjs"
test -f "${staging_dir}/node_modules/better-auth/package.json"
test -f "${staging_dir}/package.json"
test -f "${staging_dir}/package-lock.json"

if [[ -d "${app_dir}/dist/docs" ]]; then
  mkdir -p "${backup_dir}/dist/docs"
  rsync -a "${app_dir}/dist/docs/" "${backup_dir}/dist/docs/"
fi

if [[ -d "${app_dir}/server" ]]; then
  mkdir -p "${backup_dir}/server"
  rsync -a "${app_dir}/server/" "${backup_dir}/server/"
fi

if [[ -d "${app_dir}/node_modules" ]]; then
  mkdir -p "${backup_dir}/node_modules"
  rsync -a "${app_dir}/node_modules/" "${backup_dir}/node_modules/"
fi

for manifest in package.json package-lock.json; do
  if [[ -f "${app_dir}/${manifest}" ]]; then
    cp "${app_dir}/${manifest}" "${backup_dir}/${manifest}"
  fi
done

if [[ -f "${version_file}" ]]; then
  cp "${version_file}" "${backup_dir}/.deploy-version"
fi

mkdir -p "${app_dir}/dist/docs" "${app_dir}/server" "${app_dir}/node_modules" "${app_dir}/data"
rsync -a --delete "${staging_dir}/dist/docs/" "${app_dir}/dist/docs/"
rsync -a --delete "${staging_dir}/server/" "${app_dir}/server/"
rsync -a --delete "${staging_dir}/node_modules/" "${app_dir}/node_modules/"
cp "${staging_dir}/package.json" "${staging_dir}/package-lock.json" "${app_dir}/"
printf '%s\n' "${release_id}" > "${version_file}"

prepare_persistent_runtime
systemctl restart vision-ai
nginx -t
systemctl reload nginx

health_url="http://127.0.0.1:3100/api/health"
health_response=""
health_check_passed=false

for attempt in {1..30}; do
  if health_response="$(curl --fail --silent --max-time 2 "${health_url}" 2>/dev/null)"; then
    health_check_passed=true
    break
  fi

  if ! systemctl is-active --quiet vision-ai; then
    echo "vision-ai stopped before its health endpoint became available." >&2
    break
  fi

  sleep 1
done

if [[ "${health_check_passed}" != true ]]; then
  echo "vision-ai health check did not pass within 30 seconds." >&2
  systemctl status vision-ai --no-pager --full || true
  journalctl -u vision-ai --no-pager -n 80 || true
  false
fi

printf '%s\n' "${health_response}"

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
