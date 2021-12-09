import { EventType } from 'config/types'
import { dispatch, handleEvent } from '../uiMessageHandlers'

// Usage -> just do import './handleFetch'

handleEvent(EventType.FETCH, async (data) => {
  let returnData = await fetch(data.url, data.options)
    .then((response) => {
      // console.log('response: ', response)
      return response.json()
    })
    .then((res) => {
      // console.log('res: ', res)
      dispatch(data.time, res)
    })
})
