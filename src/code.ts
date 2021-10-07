import { EventUI, EventType } from './utils'
figma.showUI(__html__, { width: 560, height: 280 })

const STORAGE_KEY = 'history'
const MAX_HISTORY = 20

figma.ui.onmessage = (eventUI: EventUI ) => {
  const { type, data } = eventUI
  if (type == EventType.QUIT ) quit()
  if (type == EventType.ICON_CLICK ) onIconClick(data)
}

const onIconClick = async ( iconName: string) => {
  const selection = figma.currentPage.selection[0]
  saveIconSelection(iconName)

  await figma.loadFontAsync({ family: 'Material Icons', style: 'Regular'})

  if (selection?.type == 'TEXT') {
    selection.fontName = { family: 'Material Icons', style: 'Regular'}
    selection.characters = iconName
    selection.textAutoResize = 'WIDTH_AND_HEIGHT'
    selection.textAlignHorizontal = 'CENTER'
    selection.textAlignVertical = 'CENTER'
  } else {
    const node = figma.createText()
    node.fontName = { family: 'Material Icons', style: 'Regular'}
    node.fontSize = 20
    node.characters = iconName
    node.textAlignHorizontal = 'CENTER'
    node.textAlignVertical = 'CENTER'

    if (selection) {
      node.x = selection.x + selection.width/2-10
      node.y = selection.y + selection.height/2-10
      selection.parent.appendChild(node)
    } else {
      const { x, y, width, height } = (figma.viewport as any).bounds
      node.x = x + width/2
      node.y = y + height/2
      figma.currentPage.appendChild(node)
      figma.currentPage.selection = [node]
    }

  }

  quit()
}

async function saveIconSelection(iconName: string){
  const selectionHistory = await getSelectionHistory()
  const newSelectionHistory = [iconName, ...selectionHistory.filter(i => i != iconName)].slice(0, 20)
  figma.clientStorage.setAsync(STORAGE_KEY, newSelectionHistory)
}

function sendToUI(type: EventType, data: any) {
  figma.ui.postMessage({ type: type, data: data })
}

function quit(){  figma.closePlugin()}


async function getSelectionHistory(){
  const history = await figma.clientStorage.getAsync(STORAGE_KEY)
  return history
}


async function init(){
  const history = await getSelectionHistory()
  sendToUI(EventType.HISTORY, history)
}

// figma.clientStorage.setAsync(STORAGE_KEY, undefined)

init()