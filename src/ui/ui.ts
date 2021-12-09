import 'ui/ui.css'
import 'material-icons/iconfont/material-icons.css'
import iconNameList from 'config/iconNameList'
import { matchSorter } from 'match-sorter'

import { dispatch, handleEvent } from 'src/shared/uiMessageHandlers'
import { EventType, InitEventData } from 'config/types'
import { logSession } from 'shared/figma-analytics'

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

handleEvent(EventType.INIT_UI, (data) => {
  onReceiveHistory(data.history)
  logSession(data.user)
})

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
        if (a === query) return -1
        else return 0
      })
    },
  })
  const iconsListResults = matchSorter(iconNameList, query).filter((i) => historyResults.indexOf(i) == -1)

  let results = [...historyResults, ...iconsListResults]

  populateIconList(results)
}

function onKeyDown(event) {
  if (event.key == 'Escape') return quit()
  if (event.key == 'Enter') {
    onPressEnter()
    dispatch(EventType.ICON_CLICK, currentList[selectedIndex])
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
  if (event.key == 'ArrowUp') {
    if (selectedIndex >= 8) selectedIndex -= 8
    populateIconList(currentList)
  }
  if (event.key == 'ArrowDown') {
    if (selectedIndex < currentList.length - 8) selectedIndex += 8
    populateIconList(currentList)
  }
}

const onReceiveHistory = (iconHistory) => {
  history = iconHistory?.length > 0 ? iconHistory : iconNameList
  populateIconList(history)
}

const onPressEnter = () => {
  const icon = currentList[selectedIndex]
  onSelectIcon(icon)
}

const onSelectIcon = (iconName) => dispatch(EventType.ICON_CLICK, iconName)

const quit = () => dispatch(EventType.QUIT)

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
  item.className = `item-icon material-icons ${index === selectedIndex && 'selected'}`
  item.innerHTML = iconName
  item.title = iconName
  item.onclick = () => {
    onSelectIcon(iconName)
  }
  return item
}
