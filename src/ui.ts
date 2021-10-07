import './ui.css'
import 'material-icons/iconfont/material-icons.css'
import iconNameList from './commands/icons/iconNameList'

import { EventType, Option } from './utils'

let currentList = []
let selectedIndex = 0

// Bind UI Elements
const input: any = document.getElementById('input')
const list = document.getElementById('list')

// Init
input.focus()
input.addEventListener('input', onChange)
input.onkeydown = event => onKeyDown(event)


// UI Events
function onChange() {
  const query = input.value
  const filteredIcons = iconNameList.filter( i => {
    return i.indexOf(query) > -1
  })
  populateIconList(currentList)
}

function onKeyDown (event) {
  if (event.key == 'Escape') return quit()
  if (event.key == 'Enter') {
    onPressEnter()
    sendEvent(EventType.ICON_CLICK, currentList[selectedIndex])
  }
  if (event.key == 'ArrowRight') {
    selectedIndex++
    if (selectedIndex > currentList.length - 1) selectedIndex = 0
    populateIconList(currentList)
  }
  if (event.key == 'ArrowLeft') { 
    selectedIndex--
    if (selectedIndex < 0) selectedIndex = currentList.length - 1
    populateIconList(currentList)
  }
}

const onReceiveHistory = (data) => {
  const icons: string[] = data
  populateIconList(icons)
}

const onPressEnter = () => {
  const icon = currentList[selectedIndex]
  onSelectIcon(icon)
}

const onSelectIcon = (icon) => sendEvent(EventType.ICON_CLICK, icon)

const quit = () => sendEvent(EventType.QUIT)




// Rendering
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



// UI to Code communication
onmessage = (event) => {
  const { type, data } = event.data.pluginMessage
  if (type == EventType.HISTORY && data) {
    onReceiveHistory(data)
  }
}

const sendEvent = ( type: EventType, data?: any ) => {
  parent.postMessage({ pluginMessage: { type: type, data: data} }, '*')
}
