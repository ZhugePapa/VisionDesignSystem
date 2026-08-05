import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import {
  chmodSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, join, resolve } from 'node:path'
import test from 'node:test'

const projectRoot = resolve(import.meta.dirname, '..')
const deployScript = join(projectRoot, 'deploy/deploy-release.sh')

function writeExecutable(path, content) {
  writeFileSync(path, `#!/usr/bin/env bash\nset -euo pipefail\n${content}\n`)
  chmodSync(path, 0o755)
}

function createRelease(directory, releaseName) {
  const releaseRoot = join(directory, releaseName)
  const requiredFiles = [
    'dist/docs/index.html',
    'server/app.mjs',
    'server/models.mjs',
    'server/opencode-go.mjs',
    'node_modules/better-auth/package.json',
    'package.json',
    'package-lock.json',
  ]

  for (const relativePath of requiredFiles) {
    const path = join(releaseRoot, relativePath)
    mkdirSync(resolve(path, '..'), { recursive: true })
    writeFileSync(path, relativePath.endsWith('.json') ? '{}' : relativePath)
  }

  const archive = join(directory, `${releaseName}.tgz`)
  execFileSync('tar', ['-czf', archive, '-C', releaseRoot, '.'])
  return archive
}

test('deployment prepares a writable persistent AI runtime without replacing existing secrets', () => {
  const directory = mkdtempSync(join(tmpdir(), 'vision-deploy-test-'))
  const appDirectory = join(directory, 'app')
  const environmentFile = join(directory, 'etc/vision-ai.env')
  const overrideDirectory = join(directory, 'systemd/vision-ai.service.d')
  const commandDirectory = join(directory, 'bin')
  const systemctlLog = join(directory, 'systemctl.log')
  const user = execFileSync('id', ['-un'], { encoding: 'utf8' }).trim()
  const group = execFileSync('id', ['-gn'], { encoding: 'utf8' }).trim()

  mkdirSync(resolve(environmentFile, '..'), { recursive: true })
  mkdirSync(commandDirectory, { recursive: true })
  writeFileSync(environmentFile, [
    'DEEPSEEK_API_KEY=remove-existing-key',
    'DEEPSEEK_BASE_URL=https://api.deepseek.com',
    'OLLAMA_API_KEY=remove-ollama-key',
    'OLLAMA_BASE_URL=https://ollama.com',
    'OLLAMA_GLM_MODEL=glm-5.2',
    'OLLAMA_KIMI_MODEL=kimi-k2.7-code',
    'OLLAMA_KIMI_ENABLED=true',
    'OPENCODE_GO_API_KEY=keep-opencode-key',
    'BETTER_AUTH_SECRET=',
    'VISION_AI_DATABASE_PATH=',
    'VISION_AI_ARTIFACT_DIR=',
  ].join('\n'))
  writeExecutable(join(commandDirectory, 'systemctl'), `printf '%s\\n' "$*" >> "${systemctlLog}"`)
  writeExecutable(join(commandDirectory, 'nginx'), 'exit 0')
  writeExecutable(join(commandDirectory, 'curl'), `printf '%s\\n' '{"ok":true}'`)
  writeExecutable(join(commandDirectory, 'find'), 'exit 0')

  const archive = createRelease(directory, 'release')
  const deploymentEnvironment = {
    ...process.env,
    PATH: `${commandDirectory}:${process.env.PATH}`,
    VISION_APP_DIR: appDirectory,
    VISION_ENV_FILE: environmentFile,
    VISION_SYSTEMD_OVERRIDE_DIR: overrideDirectory,
    VISION_SERVICE_USER: user,
    VISION_SERVICE_GROUP: group,
    VISION_PUBLIC_URL: 'https://example.test',
    VISION_DEFAULT_SEED_PASSWORD: 'seed-password',
  }
  execFileSync('bash', [deployScript, archive, 'test-release'], {
    env: deploymentEnvironment,
    stdio: 'pipe',
  })

  const environment = readFileSync(environmentFile, 'utf8')
  assert.doesNotMatch(environment, /^(?:DEEPSEEK|OLLAMA)_[A-Z_]+=/m)
  assert.match(environment, /^OPENCODE_GO_API_KEY=keep-opencode-key$/m)
  assert.match(environment, /^OPENCODE_GO_BASE_URL=https:\/\/opencode\.ai\/zen\/go\/v1$/m)
  assert.match(environment, /^AI_DEFAULT_MODEL=deepseek-v4-flash$/m)
  assert.match(environment, /^NODE_ENV=production$/m)
  assert.match(environment, /^AI_ALLOWED_ORIGIN=https:\/\/example\.test$/m)
  assert.match(environment, /^BETTER_AUTH_URL=https:\/\/example\.test$/m)
  assert.match(environment, /^BETTER_AUTH_SECRET=[a-f0-9]{64}$/m)
  assert.match(environment, /^AI_SEED_PASSWORD=seed-password$/m)
  assert.match(environment, /^VISION_BUILTIN_ACCOUNT_PASSWORD=vision123456$/m)
  assert.match(environment, new RegExp(`^VISION_AI_DATABASE_PATH=${appDirectory}/data/vision-ai\\.sqlite$`, 'm'))
  assert.match(environment, new RegExp(`^VISION_AI_UPLOAD_DIR=${appDirectory}/data/uploads$`, 'm'))
  assert.match(environment, new RegExp(`^VISION_AI_ARTIFACT_DIR=${appDirectory}/data/artifacts$`, 'm'))
  assert.equal((environment.match(/^BETTER_AUTH_SECRET=/gm) ?? []).length, 1)
  const originalAuthSecret = environment.match(/^BETTER_AUTH_SECRET=(.+)$/m)?.[1]

  const secondArchive = createRelease(directory, 'release-second')
  execFileSync('bash', [deployScript, secondArchive, 'test-release-second'], {
    env: deploymentEnvironment,
    stdio: 'pipe',
  })
  const secondEnvironment = readFileSync(environmentFile, 'utf8')
  assert.match(secondEnvironment, new RegExp(`^BETTER_AUTH_SECRET=${originalAuthSecret}$`, 'm'))
  assert.equal((secondEnvironment.match(/^BETTER_AUTH_SECRET=/gm) ?? []).length, 1)

  const override = readFileSync(join(overrideDirectory, 'persistence.conf'), 'utf8')
  assert.match(override, /^\[Service\]$/m)
  assert.match(override, new RegExp(`^ReadWritePaths=${appDirectory}/data ${appDirectory}/data/uploads ${appDirectory}/data/artifacts$`, 'm'))

  const systemctlCalls = readFileSync(systemctlLog, 'utf8')
  assert.match(systemctlCalls, /^daemon-reload$/m)
  assert.match(systemctlCalls, /^restart vision-ai$/m)
  assert.equal(basename(readFileSync(join(appDirectory, '.deploy-version'), 'utf8').trim()), 'test-release-second')

  rmSync(directory, { recursive: true, force: true })
})
