import { EventUI, EventType, getStyle } from './utils'
import options from './options'
import commands from './commands'
figma.showUI(__html__);
import iconNameList from './commands/icons/iconNameList'



figma.ui.onmessage = (eventUI: EventUI ) => {
  const { type, data } = eventUI
  console.log('type: ', type);

  if (type == EventType.QUIT ) quit()
  if (type == EventType.QUERY ) onQuery(data)
  if (type == EventType.EXECUTE ) onExecute(data)
  if (type == EventType.ICON_CLICK ) onIconClick(data)

};

const onQuery = (query: string) => {
  let [cmd, args] = query.split(/(?<=^\S+)\s/)
  const command = parseCommand(cmd)

  if (command == 'icon') return sendIconOptions(args)
  else
    sendOptions()
}

const onExecute = async (query: string) => {
  let [cmd, ...other] = query.split(' ')
  const args = other.join(' ')

  const selection: any = figma.currentPage.selection

  const command = parseCommand(cmd)

  for(const node of selection){
    commands[command](node, args)
  }
  quit()
}

const parseCommand = (commandQuery: string) => {
  switch(commandQuery){
    case 'br': return 'borderRadius'
    case 'fs': return 'fontSize'
    case 'c': return 'color'
    case 'ico': return 'icon'
  }
}

const sendOptions = () => {
  sendToUI(EventType.OPTIONS, options)
}

const sendIconOptions = ( args: string) => {
  console.log('args: ', args);
  const iconFilter: string = args
  const filteredIcons = iconNameList.filter( i => {
    // console.log(`i`, i)
    // console.log(`is index of`, i.indexOf(iconFilter))
    // debugger
    return i.indexOf(iconFilter) > -1
  })
  sendToUI(EventType.ICONS, filteredIcons)
}

const onIconClick = async ( iconName: string) => {
  const node = figma.createText()
  const selection = figma.currentPage.selection[0]
  await figma.loadFontAsync({ family: 'Material Icons', style: 'Regular'})

  if (selection?.type == 'TEXT'){
    console.log('selection: ', selection);
    selection.characters = iconName
  } else {
    node.fontName = { family: 'Material Icons', style: 'Regular'}
    node.fontSize = 20
    node.characters = iconName
    const { x, y, width, height } = (figma.viewport as any).bounds
    node.x = x + width/2
    node.y = y + height/2

    figma.currentPage.appendChild(node)
  }
  quit()
}


const sendToUI = (type: EventType, data: any) => {
  figma.ui.postMessage({ type: type, data: data })
}

function quit(){  figma.closePlugin()}

