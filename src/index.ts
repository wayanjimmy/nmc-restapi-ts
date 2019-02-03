import http from 'http'
import url from 'url'
import { StringDecoder } from 'string_decoder';

const hello = (res: http.ServerResponse) => res.end('Hello World\n')

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

    hello(res)

    console.log(`Request received on path: ${trimmedPath} with method: ${method} and with these query string parameters`, queryStringObject)
    console.log('Request received with these headers:', headers)
    console.log('Request received with these payload:', buffer)
  })
})

server.listen(3000, () => {
  console.log('The server is listening on port 3000 now')
})
