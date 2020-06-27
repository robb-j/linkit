require('dotenv').config()

const fs = require('fs')
const { join } = require('path')
const { createServer } = require('http')
const { validateEnv } = require('valid-env')

const logsDir = join(__dirname, '../logs')
const statsPath = join(logsDir, 'stats.json')

validateEnv(['HOME_URL', 'URL_TEMPLATE'])
const { HOME_URL, URL_TEMPLATE } = process.env

// Ensure the logs directory exists
fs.mkdirSync(logsDir, { recursive: true })

// Load the stats file or create a new one
function loadOrCreateStats() {
  try {
    return JSON.parse(fs.readFileSync(statsPath, 'utf8'))
  } catch (err) {
    return {}
  }
}

// Return a http/302 redirect to another url
function redirect(res, url) {
  res.statusCode = 302
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Location', url)
  res.end(`Redirected to ${url}`)
}

// Return a http/200 with a json contents
function sendJson(res, data) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.statusCode = 200
  res.end(JSON.stringify(data))
}

// Shutdown the http server and exit the process
function shutdown(server) {
  console.log('Exiting ...')
  server.close(() => process.exit())
}

;(async () => {
  const stats = loadOrCreateStats()
  let hasChanges = false

  // Create our http server
  const server = createServer((req, res) => {
    // Increment the viewcount for this url
    if (!stats[req.url]) stats[req.url] = 0
    stats[req.url]++
    hasChanges = true

    // Remove leading & trailing slashes
    const path = req.url.replace(/^\/+/, '').replace(/\/+$/, '')

    // Perform routing
    if (path === '') redirect(res, HOME_URL)
    else if (path === 'stats.json') sendJson(res, stats)
    else if (path === 'healthz') sendJson(res, { msg: 'ok' })
    else redirect(res, URL_TEMPLATE.replace(/\{0\}/g, path))
  })

  // Tick every second, save stats changes if there are any
  setInterval(() => {
    if (!hasChanges) return
    fs.writeFileSync(statsPath, JSON.stringify(stats))
    hasChanges = false
  }, 10000)

  // Start the app
  await new Promise((resolve) => server.listen(3000, resolve))
  console.log('Listening on :3000')

  // Listen for process signals
  process.on('SIGINT', () => shutdown(server))
  process.on('SIGTERM', () => shutdown(server))
})()
