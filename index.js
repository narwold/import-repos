#!/usr/bin/env node

const importCwd = require('import-cwd')
const { existsSync } = require('fs')
const { execSync } = require('child_process')
const path = require('path')

let repos
try {
  repos = importCwd('./imported-repos.config')
} catch (err) {
  console.error('No imported-repos.config found')
  process.exit(1)
}

const importedReposPath = path.join(process.cwd(), '.imported-repos')

const run = (cmd, opts) => execSync(cmd, { stdio: 'inherit', ...opts })

Object.entries(repos).forEach(([name, _urls]) => {
  const urls = Array.isArray(_urls) ? _urls : [_urls]
  const repoPath = `${importedReposPath}/${name}`
  if (!existsSync(path.join(importedReposPath, name))) {
    run(urls.map((url) => `git clone ${url} ${repoPath}`).join(' || '))
  } else {
    run(`git pull`, { cwd: repoPath })
  }
})
