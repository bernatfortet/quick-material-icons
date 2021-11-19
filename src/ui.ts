import './ui.css'
import 'material-icons/iconfont/material-icons.css'
import iconNameList from './commands/icons/iconNameList'
import * as fuzzysort from 'fuzzysort'
import { matchSorter } from 'match-sorter'

import { EventType, InitEventData, Option } from './utils'

let history: string[] = []
let currentList: string[] = []
let selectedIndex = 0

// Bind UI Elements
const input: any = document.getElementById('input')
const list = document.getElementById('list')

// Init
input.focus()
input.addEventListener('input', onChange)
input.onkeydown = (event) => onKeyDown(event)

// UI Events
function onChange() {
  const query = input.value
  selectedIndex = 0

  if (query.length == 0) {
    populateIconList(history)

    return
  }

  const historyResults = matchSorter(history, query, {
    sorter: (rankedItems) => {
      return rankedItems.sort((a, b) => {
        console.log(`a`, a)
        console.log(`b`, b)
        if (a === query) return -1
        else return 0
      })
    },
  })
  const iconsListResults = matchSorter(iconNameList, query).filter(
    (i) => historyResults.indexOf(i) == -1,
  )

  let results = [...historyResults, ...iconsListResults]

  populateIconList(results)
}

function onKeyDown(event) {
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

const onReceiveHistory = (iconHistory) => {
  history = iconHistory || iconNameList
  populateIconList(history)
}

const onPressEnter = () => {
  const icon = currentList[selectedIndex]
  onSelectIcon(icon)
}

const onSelectIcon = (iconName) => sendEvent(EventType.ICON_CLICK, iconName)

const quit = () => sendEvent(EventType.QUIT)

// Rendering
const populateIconList = (icons: string[]) => {
  if (!icons) return
  currentList = icons
  list.innerHTML = ''
  icons.forEach((op: any, index) => {
    const item = createIconItem(op, index)
    list.appendChild(item)
  })
}

const createIconItem = (iconName: string, index: number) => {
  const item = document.createElement('div')
  item.className = `item-icon material-icons ${
    index === selectedIndex && 'selected'
  }`
  item.innerHTML = iconName
  item.title = iconName
  item.onclick = () => {
    onSelectIcon(iconName)
  }
  return item
}

// UI to Code communication
onmessage = (event) => {
  if (!event.data?.pluginMessage) return

  const { type, data } = event.data?.pluginMessage
  if (type == EventType.INIT && data) {
    onInit(data)
  }
}

function onInit(data: InitEventData) {
  onReceiveHistory(data.history)
}

const sendEvent = (type: EventType, data?: any) => {
  parent.postMessage({ pluginMessage: { type: type, data: data } }, '*')
}

// Helpers
function isTextInIconsList(text: string) {
  return iconNameList.indexOf(text) > -1
}
