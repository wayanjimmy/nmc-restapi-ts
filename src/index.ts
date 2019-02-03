import http from 'http'

const server = http.createServer((_req, res) => {
  res.end('Hello World\n')
})

server.listen(3000, () => {
  console.log('The server is listening on port 3000 now')
})
