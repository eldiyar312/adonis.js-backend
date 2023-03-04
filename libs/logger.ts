import { createLogger, format, transports } from 'winston'
import { ElasticsearchTransport } from 'winston-elasticsearch'

const logger = createLogger({
  transports: [
    process.env.NODE_ENV === 'development'
      ? new transports.Console({
          format: format.combine(format.colorize(), format.align(), format.simple()),
        })
      : new ElasticsearchTransport({
          clientOpts: { node: 'http://something.ru:9200' },
          indexPrefix: `cube-backend-app-develop`,
        }),
  ],
})

export const createLogMessage = ({
  request,
  response,
  tag,
  data,
}: {
  request?: any
  response?: any
  tag?: string
  data?: any
}) => {
  if (request && response) {
    return {
      requestBody: request.body(),
      headers: request.headers(),
      method: request.method(),
      qs: request.qs(),
      params: request.params(),
      url: request.url(),
      responseBody: response.getBody(),
      statusCode: response.getStatus() || 200,
      tag: 'message',
    }
  }
  return { tag, data }
}

export default logger
