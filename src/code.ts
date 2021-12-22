import { COLUMNS_COUNT, EventType, InitEventData } from 'config/types'
import iconNameList from 'config/iconNameList'
import { dispatch, handleEvent } from 'src/shared/codeMessageHandlers'
import { getSelectionHistory, saveIconSelection } from 'db'

console.clear()

const itemSize = 38
const listHorizontalPadding = 4
const scrollWidth = 15

const width = itemSize * COLUMNS_COUNT + listHorizontalPadding * 2 + scrollWidth

const DEFAULT_ICON_SIZE = 20

init()

async function init() {
  figma.showUI(__html__, { width: width, height: 280 })

  handleEvent(EventType.QUIT, () => {
    quit()
  })
  handleEvent(EventType.ICON_CLICK, (data) => {
    onIconClick(data)
  })

  const history = await getSelectionHistory()
  const data: InitEventData = {
    history,
    user: figma.currentUser,
  }
  dispatch(EventType.INIT_UI, data)

  const selectedText = getNodeText()
  if (isTextInIconsList(selectedText) && !getIsMaterialFont()) {
    onIconClick(selectedText)
  }
}

const onIconClick = async (iconName: string) => {
  await figma.loadFontAsync({ family: 'Material Icons', style: 'Regular' })

  if (figma.currentPage.selection.length == 0) {
    // Create new node
    const node = figma.createText()
    configNodeAsIcon(node, iconName, DEFAULT_ICON_SIZE)
    centerNodeInViewport(node)
    figma.currentPage.appendChild(node)
    selectNodes([node])
  } else {
    figma.currentPage.selection.forEach((node: any) => {
      if (node?.type == 'TEXT') {
        configNodeAsIcon(node, iconName)
      } else {
        const newNode = figma.createText()
        configNodeAsIcon(newNode, iconName, DEFAULT_ICON_SIZE)
        centerNodeInAnotherNode(newNode, node)
        node.appendChild(newNode)
      }
    })
  }
  await saveIconSelection(iconName)

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

function centerNodeInAnotherNode(nodeToCenter, referenceNode) {
  nodeToCenter.x = referenceNode.width / 2 - nodeToCenter.width / 2
  nodeToCenter.y = referenceNode.height / 2 - nodeToCenter.height / 2
  return nodeToCenter
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

function quit() {
  figma.closePlugin()
}

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
