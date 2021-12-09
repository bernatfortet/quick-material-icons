import { EventType } from 'config/types'
import { dispatch, handleEvent } from './codeMessageHandlers'

export async function fetch<T>(url: string, options: object) {
  const timestamp = Date.now().toString() + Math.random()

  dispatch(EventType.FETCH, {
    url: url,
    options: options,
    time: timestamp,
  })

  const returnData: T = await new Promise<T>((resolve, reject) => {
    handleEvent(timestamp, (data: T) => {
      if ((data as any).error) {
        reject(data)
      } else {
        resolve(data)
      }
    })
  })

  return returnData
}

/*
// import 'handleFetch.ts' into the UI code
*/
