import http from 'http'
import https from 'https'
import url from 'url'
import {StringDecoder} from 'string_decoder'
import fs from 'fs'

import {HandlerFunc, Router, Data} from './types'
import config from './config'

const hello = (res: http.ServerResponse) => res.end('Hello World\n')

function noop() {
  return {}
}

const sampleHandler: HandlerFunc = (_data, callback) => {
  callback(406, {name: 'sample handler'})
}

const notFoundHandler: HandlerFunc = (_data, callback) => {
  callback(404, noop)
}

const pingHandler: HandlerFunc = (_data, callback) => {
  callback(200, noop)
}

const router: Router = {
  sample: sampleHandler,
  ping: pingHandler,
  notFound: notFoundHandler
}

const httpServer = http.createServer((req, res) => {
  unifiedServer(req, res)
})

// Start the HTTP server
httpServer.listen(config.httpPort, () => {
  console.log(`The server is listening on port ${config.httpPort} in ${config.envName} now`)
})

// Instantiate the HTTPS server
const httpsServerOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem')
}

const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res)
})

// Start the HTTPS server
httpsServer.listen(config.httpsPort, () => {
  console.log(`The server is listening on port ${config.httpsPort} in ${config.envName} now`)
})

const unifiedServer = (req: http.IncomingMessage, res: http.ServerResponse) => {
  if (!req.url) {
    hello(res)
    return
  }

  let parsedUrl = url.parse(req.url, true)

  if (!parsedUrl.pathname) {
    hello(res)
    return
  }

  let trimmedPath = parsedUrl.pathname.replace(/^\/+|\/+$/g, '')

  let queryStringObject = parsedUrl.query

  if (!req.method) {
    hello(res)
    return
  }

  let method = req.method.toLowerCase()

  let {headers} = req

  let decoder = new StringDecoder('utf-8')
  let buffer = ''
  req.on('data', data => {
    buffer += decoder.write(data)
  })
  req.on('end', () => {
    buffer += decoder.end()

    let choosenHandler = router[trimmedPath] || notFoundHandler

    let data: Data = {
      trimmedPath,
      queryStringObject,
      method,
      headers,
      payload: buffer
    }

    choosenHandler(data, (statusCode: number = 200, payload: Object = {}) => {
      let payloadString = JSON.stringify(payload)

      res.setHeader('Content-Type', 'application/json')
      res.writeHead(statusCode)
      res.end(payloadString)
      console.log('Returning this response: ', statusCode, payloadString)
    })
  })
}
