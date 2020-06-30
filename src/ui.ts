import './ui.css'
import { EventType, Option } from './utils'
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
  console.log(`event.key`, event.key)
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
}

const populateList = (options: Option[]) => {
  list.innerHTML = ''
  options.forEach( (op, i) => {
    const item = createItem(op, i)
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