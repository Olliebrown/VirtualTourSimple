import fs from 'fs'
import Express from 'express'
import https from 'https'

import DataRouter from './tourDataRouter.js'

// Turn on live data editing
const ENABLE_DATA_EDITING = true

// Base express HTTP(s) server
const app = new Express()

// Create an SSL server if we are in dev mode
let server = null
if (process.argv.findIndex(item => item === 'dev') !== -1) {
  // Read in our HTTPS credentials (for testing only)
  const key = fs.readFileSync('./server/devServerSSL/key.pem')
  const cert = fs.readFileSync('./server/devServerSSL/cert.pem')

  // Build secure server
  server = https.createServer({ key, cert }, app)
}

app.use((req, res, next) => {
  console.log(`${req.method} request at ${req.path}`)
  next()
})

// Only enable the data routes if editing is enabled
if (ENABLE_DATA_EDITING) {
  app.use('/data', DataRouter)
}

// Statically serve the public folder
app.use(Express.static('./public'))

// Start listening for HTTP requests
if (server) {
  server.listen(3000, () => {
    console.log('SECURE server listening on port 3000')
  })
} else {
  app.listen(3000)
  console.log('Server listening on port 3000')
}
