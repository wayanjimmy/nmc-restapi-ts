import http from 'http'
import {ParsedUrlQuery} from 'querystring'

interface Callback {
  (statusCode: number, payload: Object): void
}

export interface HandlerFunc {
  (data: Data, cb: Callback): void
}

export interface Router {
  [key: string]: HandlerFunc
}

export interface Data {
  trimmedPath: string
  queryStringObject: ParsedUrlQuery
  method: string
  headers: http.IncomingHttpHeaders
  payload: string
}
