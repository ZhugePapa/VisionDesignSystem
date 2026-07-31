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

Provider credentials stay on the ECS host in `/etc/vision-ai.env`. They are not
stored in the repository or GitHub Actions.

| Variable | Purpose | Default |
| --- | --- | --- |
| `DEEPSEEK_API_KEY` | DeepSeek V4 Flash and V4 Pro credential | Required for DeepSeek |
| `DEEPSEEK_BASE_URL` | DeepSeek API origin | `https://api.deepseek.com` |
| `OLLAMA_API_KEY` | Ollama Cloud credential for GLM-5.2 and Kimi K2.7 Code | Required for Ollama |
| `OLLAMA_BASE_URL` | Ollama Cloud API origin | `https://ollama.com` |
| `OLLAMA_GLM_MODEL` | Ollama Cloud upstream model name | `glm-5.2` |
| `OLLAMA_KIMI_MODEL` | Ollama Cloud upstream model name | `kimi-k2.7-code` |
| `OLLAMA_KIMI_ENABLED` | Enables Kimi K2.7 Code in the public catalog | `true` |
| `AI_DEFAULT_MODEL` | Initially selected public model ID | `deepseek-v4-flash` |
| `BETTER_AUTH_URL` | Public origin used for signed authentication cookies | `https://vision.leoht.space` |
| `BETTER_AUTH_SECRET` | High-entropy secret used to sign authentication state | Required |
| `AI_SEED_PASSWORD` | Initial password shared by the ten built-in accounts | Required |
| `VISION_AI_DATABASE_PATH` | Persistent SQLite database outside release contents | `/opt/vision-design-system/data/vision-ai.sqlite` |
| `VISION_AI_UPLOAD_DIR` | Persistent, authenticated attachment storage outside release contents | `/opt/vision-design-system/data/uploads` |

The browser sends only a public model ID. The API resolves that ID through the
server-side allowlist before choosing a provider, upstream model, and credential.
Use `GET /api/ai/models` to inspect the public model catalog and availability
without exposing provider secrets.

## Built-in AI accounts

The API creates `vision01` through `vision10` on first start. Public registration
is disabled. All ten accounts initially use `AI_SEED_PASSWORD`; changing that
environment variable later does not reset passwords for accounts that already
exist.

Authentication and AI conversations are stored in the SQLite file configured by
`VISION_AI_DATABASE_PATH`. The deployment script preserves the application
`data` directory across releases. Back up this database file independently from
the release archives.

Uploaded files are stored under `VISION_AI_UPLOAD_DIR` and are never served as
public static assets. File preview and download requests require an authenticated
session and ownership is checked against the SQLite record.
