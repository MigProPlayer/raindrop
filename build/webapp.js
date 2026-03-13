const { spawn } = require('child_process')

exports.default = async function(context) {
    const hasSentryToken = !!process.env.SENTRY_AUTH_TOKEN
    const buildScript = hasSentryToken
        ? 'npm run build:electron'
        : 'npm run build:electron -- --env sentry.disabled=true'

    await new Promise((resolve, reject) => {
        const child = spawn('bash', ['-c', `cd webapp && npm i && ${buildScript}`], { stdio: 'inherit' })
        child.on('close', code => code === 0 ? resolve() : reject(new Error(`build:electron exited with code ${code}`)))
        child.on('error', reject)
    })
}