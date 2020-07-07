import './ui.css'
import 'material-icons/iconfont/material-icons.css'

import { EventType, Option, ResultsListType } from './utils'
import options from './options'

const input: any = document.getElementById('input')
const list = document.getElementById('list')
let selectedIndex = 0
let query = ''


const onChange = event => {
  if (input.value == '') populateList([])
  else {
    onType(input.value)
  }
}

const onKeyDown = event => {
  if (event.key == 'Escape') return quit()
  if (event.key == 'Enter') return execute()
}

const onType = ( q: string ) => {
  query = q
  sendEvent(EventType.QUERY, query)
}

input.focus()
input.addEventListener('input', onChange)
input.onkeydown = event => onKeyDown(event)

onmessage = (event) => {
  const { type, data } = event.data.pluginMessage
  if (type == EventType.OPTIONS){
    const options: Option[] = data
    populateList(options)
  }
  else if (type == EventType.ICONS) {
    const icons: string[] = data
    populateIconList(icons)
  }
}

const populateList = (options: any[]) => {
  list.innerHTML = ''
  options.forEach( (op: any, i) => {
    const item = createItem(op, i)
    list.appendChild(item)
  })
}

const populateIconList = (icons: string[]) => {
  list.innerHTML = ''
  icons.forEach( (op: any, i) => {
    const item = createIconItem(op)
    list.appendChild(item)
  })
}

const createItem = (option: Option, position: number) => {
  const { name, shorthand } = option
  const item = document.createElement("div"); 
  const selectedClass = position == selectedIndex ? 'selected': '' 
  item.innerHTML = `
    <div class='item ${selectedClass}'>
      <div class='title'>${name}</div>
    </div>
  `
  return item
}

const createIconItem = (iconName: string) => {
  const item = document.createElement("div"); 
  item.className = 'icon-item material-icons'
  item.innerHTML = iconName
  item.onclick = () => {
    sendEvent(EventType.ICON_CLICK, iconName)
  }
  
  return item
}

const execute = () => {
  sendEvent(EventType.EXECUTE, query)
  // const split = query.split(' ')
  // if (split[1]) {
  //   const arg = split[1]
  //   console.log(`arg`, arg)
  // }
  // // quit()
}

const quit = () => sendEvent(EventType.QUIT)

const sendEvent = ( type: EventType, data?: any ) => {
  parent.postMessage({ pluginMessage: { type: type, data: data} }, '*')
}