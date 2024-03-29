export enum EventType {
  INIT = 'INIT',
  QUIT = 'QUIT',
  QUERY = 'QUERY',
  OPTIONS = 'OPTIONS',
  CURRENT_TEXT = 'CURRENT_TEXT',
  EXECUTE = 'EXECUTE',
  ICONS = 'ICONS',
  ICON_CLICK = 'ICON_CLICK',
  SHORTCUT = 'SHORTCUT',
  HISTORY = 'HISTORY',
  ICON_SELECT = 'ICON_SELECT',
}

export type InitEventData = {
  history: string[]
}

export enum ResultsListType {
  COMMANDS = 'COMMANDS',
  ICONS = 'ICONS',
}

export type Option = {
  name: string
  shorthand: string
  unit: string | string[]
  command: string
}

export type EventUI = {
  type: EventType
  data: any
}

export let collectedStyleData = []

export const getStyle = (node) => {
  if (node.type === 'COMPONENT' || 'INSTANCE' || 'FRAME' || 'GROUP') {
    let objectStyle = figma.getStyleById(node.fillStyleId)
    if (objectStyle.id) {
      let style = {
        name: objectStyle.name,
        key: objectStyle.id,
        type: 'PAINT',
      }
      if (style.name && style.key && style.type) {
        collectedStyleData.push(style)
      } else {
        ;(figma as any).notify('Error adding theme')
        throw new Error('Error adding theme')
      }
    }
  }
}

export function clone(val) {
  return JSON.parse(JSON.stringify(val))
}
