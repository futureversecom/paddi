import './training-event-handler-local-setup'

import { handler } from '../handlers/training-event-handler'

const sqsEvent = {
  Records: [
    {
      messageId: 'b90402df-7268-4361-831c-3ad129c62233',
      receiptHandle:
        'AQEBNZf19+3MuU4Nk+47o4X14fFnGqyRCgG0L2OpX1iuIsrWaYTw8ANpHr2T2qV9MK0BLaOf7GBa0HkBSw0MQkt2VFx3cey5aAGDzjKsP225tp8tO2h2Bv6DuBXJOgOm457HFwsptAq3FAB1NEWTn0/XlQ19TdYPZN4lkknBq+sIxa7MLf3oNBUCEM6zzKeIBT5VlpMYpWOiGKUEVs/WGrULuoOm6/RTqJthxUE0U3XDh8zTgWQTMoG8xt9DTCEXgQ1UQwCTk4vzDGnV6BbLLr4sYdw5ohDuY7sFPL6IDBv844g=',
      body: '{"version":"0","id":"aa510b48-32dc-20a5-a42c-ae2bba7fe308","detail-type":"chain-event","source":"chain-sync-service","account":"872291908522","time":"2023-03-09T08:52:40Z","region":"us-west-2","resources":[],"detail":{"chainType":"evm","removed":false,"address":"0xc8c50e5c235524677e667687dcb94268b97d8889","data":"0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000090000000000000000000000000000000000000000000000000000000000000001419efe03b84db7606dd83358f87e444c245746cb65b2111eb24a6212775de0e6","transactionIndex":0,"transactionHash":"0x7e29850fdb44f482249a620510271d79fe85696b02b8cb5647e44bc2097a03ea","blockNumber":3495646,"logIndex":2,"blockHash":"0x26a2cf3721383fb57ca85514986d156a7b00fab44bb1704ceb2db0a07cc509f9","topics":["0xefe64a1e0f5bc71f8c066de06238669d328113ffade82ccee953d92db3c58c9f","0x0000000000000000000000002d2438c6281b5115733287fc279f854c868d3ee2","0x0000000000000000000000003467b8426c04131ba93a783abea67bcb429a7f83"],"chainId":7672,"blockTime":"2023-03-09T08:52:40.000Z"}}',
      attributes: {
        ApproximateReceiveCount: '1',
        AWSTraceHeader:
          'Root=1-64099e5e-a7c27085aa551ebe8640b6c6;Parent=a977000866217bba;Sampled=1',
        SentTimestamp: '1678351969252',
        SequenceNumber: '18876402177838063872',
        MessageGroupId: 'constant',
        SenderId: 'AIDAIE6VAXUQU2DKHA7DK',
        MessageDeduplicationId:
          '492f323ca9d3fa84edc2ec97c6bc2b6480fcd6ec8984d79b3bca182222f36ac2',
        ApproximateFirstReceiveTimestamp: '1678351969252',
      },
      messageAttributes: {},
      md5OfBody: '0794c123a2756859beb905bb239afc69',
      eventSource: 'aws:sqs',
      eventSourceARN:
        'arn:aws:sqs:us-west-2:784104562740:consumer-queue-porcini.fifo',
      awsRegion: 'us-west-2',
    },
  ],
}

const main = async () => {
  return handler(sqsEvent, {} as any, {} as any)
}

main().catch(console.error)
