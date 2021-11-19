import { EventUI, EventType, InitEventData } from './utils'
import iconNameList from './commands/icons/iconNameList'
figma.showUI(__html__, { width: 560, height: 280 })

const DEFAULT_ICON_SIZE = 20

const STORAGE_KEY = 'history'
const MAX_HISTORY = 60

figma.ui.onmessage = (eventUI: EventUI) => {
  const { type, data } = eventUI
  if (type == EventType.QUIT) quit()
  if (type == EventType.ICON_CLICK) onIconClick(data)
}

const onIconClick = async (iconName: string) => {
  saveIconSelection(iconName)

  await figma.loadFontAsync({ family: 'Material Icons', style: 'Regular' })

  if (figma.currentPage.selection.length == 0) {
    // Create new node
    const node = figma.createText()
    configNodeAsIcon(node, iconName, DEFAULT_ICON_SIZE)
    centerNodeInViewport(node)
    figma.currentPage.appendChild(node)
    selectNodes([node])
  } else {
    figma.currentPage.selection.forEach((node) => {
      if (node?.type == 'TEXT') {
        configNodeAsIcon(node, iconName)
      } else {
        const newNode = figma.createText()
        configNodeAsIcon(newNode, iconName, DEFAULT_ICON_SIZE)
        centerNodeInAnotherNode(newNode, node)
        node.parent.appendChild(newNode)
      }
    })
  }

  quit()
}

function selectNodes(nodes: any[]) {
  figma.currentPage.selection = nodes
}

function centerNodeInViewport(node) {
  const { x, y, width, height } = (figma.viewport as any).bounds
  node.x = x + width / 2
  node.y = y + height / 2
  return node
}

function centerNodeInAnotherNode(node, anotherNode) {
  node.x = anotherNode.x + anotherNode.width / 2 - node.width / 2
  node.y = anotherNode.y + anotherNode.height / 2 - node.height / 2
  return node
}

function configNodeAsIcon(node, iconName, fontSize = null) {
  // TODO better name
  node.fontName = { family: 'Material Icons', style: 'Regular' }
  node.characters = iconName
  node.name = iconName
  node.textAutoResize = 'WIDTH_AND_HEIGHT'
  node.textAlignHorizontal = 'CENTER'
  node.textAlignVertical = 'CENTER'
  if (fontSize) {
    node.fontSize = fontSize
  }
}

async function saveIconSelection(iconName: string) {
  const selectionHistory = await getSelectionHistory()
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
