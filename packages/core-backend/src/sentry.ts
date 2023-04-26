import { CaptureConsole } from '@sentry/integrations'
import { AWSLambda as SentryAWSLambda } from '@sentry/serverless'
import type { Handler } from 'aws-lambda'

const sentryDSN = process.env['SENTRY_DSN']
const environment = process.env['SENTRY_ENVIRONMENT'] || 'dev'

if (sentryDSN) {
  SentryAWSLambda.init({
    dsn: sentryDSN,
    integrations: [
      new CaptureConsole({
        levels: ['error'],
      }),
    ],
    environment,
    beforeSend: (event, hint) => {
      console.log(hint?.originalException ?? event.exception?.values?.[0])
      return event
    },
  })
} else {
  console.warn(
    'SENTRY_DSN environment variable not set, errors will not be reported',
  )
}

// Using this handler ensures any lambda using Sentry would first initiate it as a side-effect of loading
// this module
export const sentryWrapper = <TEvent, TResult>(
  handler: Handler<TEvent, TResult>,
): Handler<TEvent, TResult> => SentryAWSLambda.wrapHandler(handler)
