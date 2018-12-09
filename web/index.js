require('dotenv').config()

const fs = require('fs')
const { join } = require('path')
const { createServer } = require('http')

const statsPath = join(__dirname, '../logs/stats.json')

// Check the HOME_URL variable is set
if (!process.env.HOME_URL) {
  console.log(`No 'HOME_URL' set`)
  process.exit(1)
}

// Check the URL_TEMPLATE variable is set
if (!process.env.URL_TEMPLATE) {
  console.log(`No 'URL_TEMPLATE' set`)
  process.exit(1)
}

// Load the stats file or create a new one
function loadOrCreateStats() {
  try {
    return JSON.parse(fs.readFileSync(statsPath, 'utf8'))
  }
  catch (err) {
    return {}
  }
}

// Return a http/302 redirect to another url
function redirect(res, url) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Location', url)
  res.statusCode = 302
  res.end(`Redirected to ${url}`)
}

// Return a http/200 with a json contents
function sendJson(res, data) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.statusCode = 200
  res.end(JSON.stringify(data))
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
    if (path === '') redirect(res, process.env.HOME_URL)
    else if (path === 'stats.json') sendJson(res, stats)
    else redirect(res, process.env.URL_TEMPLATE.replace(/\{0\}/g, path))
  })
  
  // Tick every second, save stats changes if there are any
  setInterval(() => {
    if (!hasChanges) return
    fs.writeFileSync(statsPath, JSON.stringify(stats))
    hasChanges = false
  }, 1000)
  
  // Start the app
  await new Promise(resolve => server.listen(3000, resolve))
  console.log('Listening on :3000')
})()
