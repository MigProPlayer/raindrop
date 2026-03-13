const path = require('path')
const { spawn } = require('child_process')

exports.default = async function(context) {
    const hasSentryToken = !!process.env.SENTRY_AUTH_TOKEN
    const webappDir = path.resolve(__dirname, '../webapp')

    const run = (cmd, args, opts) => new Promise((resolve, reject) => {
        const child = spawn(cmd, args, { stdio: 'inherit', shell: true, ...opts })
        child.on('close', (code, signal) => {
            if (code === 0) return resolve()
            reject(new Error(`Command "${cmd}" exited with code ${code}${signal ? ` (signal: ${signal})` : ''}`))
        })
        child.on('error', reject)
    })

    await run('npm', ['install'], { cwd: webappDir })

    const buildArgs = ['run', 'build:electron']
    if (!hasSentryToken) buildArgs.push('--', '--env', 'sentry.disabled=true')
    await run('npm', buildArgs, { cwd: webappDir })
}