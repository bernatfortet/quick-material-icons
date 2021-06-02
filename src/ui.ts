import './ui.css'
import 'material-icons/iconfont/material-icons.css'
import iconNameList from './commands/icons/iconNameList'

import { EventType, Option } from './utils'

const input: any = document.getElementById('input')
const list = document.getElementById('list')
let currentList = []
let selectedIndex = 0


const onChange = event => {
  const query = input.value
  const filteredIcons = iconNameList.filter( i => {
    return i.indexOf(query) > -1
  })
  populateIconList(filteredIcons)
}

const onKeyDown = event => {
  if (event.key == 'Escape') return quit()
  if (event.key == 'Enter') {
    sendEvent(EventType.ICON_CLICK, currentList[selectedIndex])
  }
}

input.focus()
input.addEventListener('input', onChange)
input.onkeydown = event => onKeyDown(event)

onmessage = (event) => {
  const { type, data } = event.data.pluginMessage
  if (type == EventType.HISTORY && data) {
    const icons: string[] = data
    populateIconList(icons)
  }
}


const populateIconList = (icons: string[]) => {
  currentList = icons
  list.innerHTML = ''
  icons.forEach( (op: any, index) => {
    const item = createIconItem(op, index)
    list.appendChild(item)
  })
}

const createIconItem = (iconName: string, index: number) => {
  const item = document.createElement("div"); 
  item.className = `item-icon material-icons ${index === selectedIndex && 'selected'}`
  item.innerHTML = iconName
  item.onclick = () => {
    sendEvent(EventType.ICON_CLICK, iconName)
  }
  return item
}


const quit = () => sendEvent(EventType.QUIT)

const sendEvent = ( type: EventType, data?: any ) => {
  parent.postMessage({ pluginMessage: { type: type, data: data} }, '*')
}