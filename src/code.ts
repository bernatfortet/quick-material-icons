import { EventUI, EventType, InitEventData } from './utils'
import iconNameList from './commands/icons/iconNameList'
figma.showUI(__html__, { width: 560, height: 280 })

const STORAGE_KEY = 'history'
const MAX_HISTORY = 30

figma.ui.onmessage = (eventUI: EventUI) => {
  const { type, data } = eventUI
  if (type == EventType.QUIT) quit()
  if (type == EventType.ICON_CLICK) onIconClick(data)
}

const onIconClick = async (iconName: string) => {
  const selection = figma.currentPage.selection[0]
  saveIconSelection(iconName)

  await figma.loadFontAsync({ family: 'Material Icons', style: 'Regular' })

  if (selection?.type == 'TEXT') {
    selection.fontName = { family: 'Material Icons', style: 'Regular' }
    selection.characters = iconName
    selection.textAutoResize = 'WIDTH_AND_HEIGHT'
    selection.textAlignHorizontal = 'CENTER'
    selection.textAlignVertical = 'CENTER'
  } else {
    const node = figma.createText()
    node.fontName = { family: 'Material Icons', style: 'Regular' }
    node.fontSize = 20
    node.characters = iconName
    node.textAlignHorizontal = 'CENTER'
    node.textAlignVertical = 'CENTER'

    if (selection) {
      node.x = selection.x + selection.width / 2 - 10
      node.y = selection.y + selection.height / 2 - 10
      selection.parent.appendChild(node)
    } else {
      const { x, y, width, height } = (figma.viewport as any).bounds
      node.x = x + width / 2
      node.y = y + height / 2
      figma.currentPage.appendChild(node)
      figma.currentPage.selection = [node]
    }
  }

  quit()
}

async function saveIconSelection(iconName: string) {
  const selectionHistory = await getSelectionHistory()
  console.log('selectionHistory: ', selectionHistory)
  const newSelectionHistory = [
    iconName,
    ...selectionHistory.filter((i) => i != iconName),
  ].slice(0, MAX_HISTORY)
  figma.clientStorage.setAsync(STORAGE_KEY, newSelectionHistory)
}

function sendToUI(type: EventType, data: any) {
  figma.ui.postMessage({ type: type, data: data })
}

function quit() {
  figma.closePlugin()
}

async function getSelectionHistory() {
  const history = await figma.clientStorage.getAsync(STORAGE_KEY)
  return history || []
}

async function init() {
  const history = await getSelectionHistory()
  const data: InitEventData = {
    history,
  }
  sendToUI(EventType.INIT, data)

  const selectedText = getNodeText()
  if (isTextInIconsList(selectedText) && !getIsMaterialFont()) {
    onIconClick(selectedText)
  }
}

init()

// Helpers

function getNodeText() {
  const selection = figma.currentPage.selection[0]
  if (selection?.type == 'TEXT') {
    return selection.characters
  }
  return null
}

function isTextInIconsList(text: string) {
  return iconNameList.indexOf(text) > -1
}

function getIsMaterialFont() {
  const selection = figma.currentPage.selection[0]
  if (selection?.type == 'TEXT') {
    return (selection.fontName as any).family == 'Material Icons'
  }
  return null
}
