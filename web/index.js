const fs = require('fs')
const path = require('path')

const express = require('express')
const morgan = require('morgan')

if (!process.env.HOME_URL) {
  console.log(`No 'HOME_URL' set`)
  process.exit(1)
}

if (!process.env.URL_TEMPLATE) {
  console.log(`No 'URL_TEMPLATE' set`)
  process.exit(1)
}

;(async () => {
  
  // Our express app with traffic logging
  let app = express()
  app.set('trust proxy', true)
  let logStream = fs.createWriteStream(path.join(__dirname, '../logs/access.log'), {flags: 'a'})
  app.use(morgan('combined', { stream: logStream }))
  
  // The redirection endpoint
  app.get('/:arg', (req, res) => {
    res.redirect(process.env.URL_TEMPLATE.replace(/\{0\}/g, req.params.arg))
  })
  
  // An endpoint to redirect to HOME_URL
  app.get('/', (req, res) => {
    res.redirect(process.env.HOME_URL)
  })
  
  // Start the app
  await new Promise(resolve => app.listen(3000, resolve))
  console.log('Listening on localhost:3000')
})()
