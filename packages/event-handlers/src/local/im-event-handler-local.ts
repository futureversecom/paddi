import './im-event-handler-local-setup'

import { handler } from '../handlers/im-event-handler'

const imEvent = {
  Records: [
    {
      messageId: '6402c8e7-d548-4f37-8322-25fe336c889a',
      receiptHandle:
        'AQEBjQW9O9rmXUGJohBWwnQ4juPTZgVMvaIwo3zDEfD9y3XxH634gw4TRz07mqb7N77eN+FZZ9Qv8W4p67PxGqXE471qJYsAGuOeeGn0H0lmhE21zfrphtqeU+01IXFWz+qiPF1FNZaEdl3WXnOLndb4f2dDe3tOXY8jqJgoz8dR6TcogRaxHYwHhhueBNmpFI+hfsQXVBG+ngfhpicp07t3EAvB/Arsc8kB1lCklt6Wu8mL6z+XIbXH0I5Ft+TDXYOV34j9gCLOG2E9i6YXvyHdebJ9Og7FBPBgOSQZ1dlIARQ=',
      body: '{"event_type":"IMStarted","training_id":"0x441724924e3bf9a4b12ffc1da3e5ca6c679dffd2221217e755e238b06adb3bb3"}',
      attributes: [] as any,
      messageAttributes: {},
      md5OfBody: 'fbbf24605418b4ff70b1f24904f64508',
      eventSource: 'aws:sqs',
      eventSourceARN:
        'arn:aws:sqs:us-west-2:784104562740:acp-demo-im-events.fifo',
      awsRegion: 'us-west-2',
    },
  ],
}

const main = async () => {
  return handler(imEvent, {} as any, {} as any)
}

main().catch(console.error)
