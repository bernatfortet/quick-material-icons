const eventListeners: { type: String; callback: Function }[] = []

export const dispatch = (type: String, data?: any) => {
  figma.ui.postMessage({ type, data })
}

export const handleEvent = (type: String, callback: Function) => {
  eventListeners.push({ type, callback })
}

figma.ui.onmessage = (message) => {
  console.info('UI Message:', message)
  for (let eventListener of eventListeners) {
    if (message.type === eventListener.type) {
      eventListener.callback(message.data)
    }
  }
}
