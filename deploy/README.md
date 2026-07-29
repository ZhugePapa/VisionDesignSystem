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
