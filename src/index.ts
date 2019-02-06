import http from 'http'
import url from 'url'
import {StringDecoder} from 'string_decoder'
import {ParsedUrlQuery} from 'querystring'

import config from './config'

const hello = (res: http.ServerResponse) => res.end('Hello World\n')

function noop() {}

interface Callback {
  (statusCode: number, payload: Object): void
}

interface HandlerFunc {
  (data: Data, cb: Callback): void
}

interface Router {
  [key: string]: HandlerFunc
}

interface Data {
  trimmedPath: string
  queryStringObject: ParsedUrlQuery
  method: string
  headers: http.IncomingHttpHeaders
  payload: string
}

const sampleHandler: HandlerFunc = (_data, callback) => {
  callback(406, {name: 'sample handler'})
}

const notFoundHandler: HandlerFunc = (_data, callback) => {
  callback(404, noop)
}

const router: Router = {
  sample: sampleHandler,
  notFound: notFoundHandler
}

const server = http.createServer((req, res) => {
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
})

server.listen(config.port, () => {
  console.log(
    `The server is listening on port ${config.port} in ${config.envName} now`
  )
})
