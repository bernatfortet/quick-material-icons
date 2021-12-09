import { EventType } from 'config/types'

type Message = {
  type: EventType
  data: any
}

const eventListeners: { type: EventType; callback: Function }[] = []

export const dispatch = (type: EventType, data?: any) => {
  const message: Message = { type, data }
  parent.postMessage({ pluginMessage: message }, '*')
}

export const handleEvent = (type: EventType, callback: Function) => {
  eventListeners.push({ type, callback })
}

window.onmessage = (event) => {
  const message: Message = event.data.pluginMessage
  if (message) {
    for (let eventListener of eventListeners) {
      if (message.type === eventListener.type)
        eventListener.callback(message.data)
    }
  }
}
