require('dotenv').config()

const { createServer } = require('http')
const { validateEnv } = require('valid-env')

validateEnv(['HOME_URL', 'URL_TEMPLATE'])
const { HOME_URL, URL_TEMPLATE } = process.env

// Return a http/302 redirect to another url
function redirect(res, url) {
  res.statusCode = 302
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Location', url)
  res.end(`Redirected to ${url}`)
}

// Return a http/200 with a json contents
function sendStats(res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.statusCode = 200
  res.end(JSON.stringify(Object.fromEntries(stats.entries())))
}

// Send back an "OK" unless terminating
function sendHealth(res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.statusCode = terminating ? 503 : 200
  res.end(JSON.stringify({ msg: terminating ? 'terminating' : 'ok' }))
}

// Shutdown the http server and exit the process
// waits for 5s for services to stop routing traffic
function shutdown(server) {
  terminating = true
  console.log('Exiting ...')

  setTimeout(() => server.close(() => process.exit()), 5000)
}

let terminating = false
const stats = new Map()
const skipList = new Set(['/healthz'])

;(async () => {
  // Create our http server
  const server = createServer((req, res) => {
    // Increment the viewcount for this url
    if (skipList.has(req.url) === false) {
      stats.set(req.url, (stats.get(req.url) || 0) + 1)
    }

    // Remove leading & trailing slashes
    const path = req.url.replace(/^\/+/, '').replace(/\/+$/, '')

    // Perform routing
    if (path === '') redirect(res, HOME_URL)
    else if (path === 'stats.json') sendStats(res)
    else if (path === 'healthz') sendHealth(res)
    else redirect(res, URL_TEMPLATE.replace(/\{0\}/g, path))
  })

  // Start the app
  await new Promise((resolve) => server.listen(3000, resolve))
  console.log('Listening on :3000')

  // Listen for process signals
  process.on('SIGINT', () => shutdown(server))
  process.on('SIGTERM', () => shutdown(server))
})()
