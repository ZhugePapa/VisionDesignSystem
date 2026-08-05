# ECS deployment

Pushing to `main` runs `.github/workflows/deploy-ecs.yml`. The workflow builds the
documentation and AI API, uploads one release archive, activates it under
`/opt/vision-design-system`, and verifies `https://vision.leoht.space/api/health`.

The repository requires these GitHub Actions secrets:

| Secret | Value |
| --- | --- |
| `ECS_HOST` | ECS public IP or SSH hostname |
| `ECS_PORT` | SSH port |
| `ECS_USER` | SSH user allowed to update the application and restart services |
| `ECS_SSH_KEY` | Private SSH deployment key |
| `ECS_KNOWN_HOSTS` | Pinned SSH host key entry |

The server keeps the three most recent backups under
`/opt/vision-design-system/.deploy`. A failed activation restores the previous
documentation and API before restarting `vision-ai`.

## AI model configuration

The OpenCode Go credential stays on the ECS host in `/etc/vision-ai.env`. It is
not stored in the repository or GitHub Actions. All three public models use the
same subscription and API key.

Every release also repairs the persistent runtime before restarting the API: it
creates missing authentication and storage variables without replacing non-empty
values, creates the database and upload directories for `www-data`, and installs
a systemd drop-in that keeps those directories writable while
`ProtectSystem=strict` is enabled. Missing authentication secrets are generated
once and retained in `/etc/vision-ai.env`.

| Variable | Purpose | Default |
| --- | --- | --- |
| `OPENCODE_GO_API_KEY` | OpenCode Go subscription API key for all models | Required |
| `OPENCODE_GO_BASE_URL` | OpenCode Go API base URL | `https://opencode.ai/zen/go/v1` |
| `AI_DEFAULT_MODEL` | Initially selected public model ID | `deepseek-v4-flash` |
| `BETTER_AUTH_URL` | Public origin used for signed authentication cookies | `https://vision.leoht.space` |
| `BETTER_AUTH_SECRET` | High-entropy secret used to sign authentication state | Required |
| `AI_SEED_PASSWORD` | Initial password shared by the ten built-in accounts | Required |
| `VISION_BUILTIN_ACCOUNT_PASSWORD` | Stable login password applied once to `vision01`–`vision10` | `vision123456` |
| `VISION_AI_DATABASE_PATH` | Persistent SQLite database outside release contents | `/opt/vision-design-system/data/vision-ai.sqlite` |
| `VISION_AI_UPLOAD_DIR` | Persistent, authenticated attachment storage outside release contents | `/opt/vision-design-system/data/uploads` |

The browser sends only one of `gpt-5.6-luna`, `deepseek-v4-flash`, or `glm-5.2`.
The API resolves that ID through the server-side allowlist before choosing the
OpenCode Go Responses or Chat Completions endpoint. Use `GET /api/ai/models` to
inspect the public catalog and availability without exposing the credential.

The deployment script requires `OPENCODE_GO_API_KEY` before activating an
OpenCode Go release. During activation it removes legacy `DEEPSEEK_*` and
`OLLAMA_*` values from `/etc/vision-ai.env`.

## Built-in AI accounts

The API creates `vision01` through `vision10` on first start. Public registration
is disabled. A one-time migration applies `VISION_BUILTIN_ACCOUNT_PASSWORD` to
all ten accounts, including accounts created by releases before the stable
password was introduced. Later environment changes do not repeatedly reset
passwords after that migration has been recorded.

Authentication and AI conversations are stored in the SQLite file configured by
`VISION_AI_DATABASE_PATH`. The deployment script preserves the application
`data` directory across releases. Back up this database file independently from
the release archives.

Uploaded files are stored under `VISION_AI_UPLOAD_DIR` and are never served as
public static assets. File preview and download requests require an authenticated
session and ownership is checked against the SQLite record.
