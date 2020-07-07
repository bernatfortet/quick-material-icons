import { EventUI, EventType, getStyle } from './utils'
import options from './options'
import commands from './commands'
figma.showUI(__html__);



figma.ui.onmessage = (eventUI: EventUI ) => {
  const { type, data } = eventUI

  if (type == EventType.QUIT ) quit()
  if (type == EventType.QUERY ) onQuery(data)
  if (type == EventType.EXECUTE ) onExecute(data)


  figma.ui.postMessage(options)

  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  // if (msg.type === 'create-rectangles') {
  //   const nodes: SceneNode[] = [];
  //   for (let i = 0; i < msg.count; i++) {
  //     const rect = figma.createRectangle();
  //     rect.x = i * 150;
  //     rect.fills = [{type: 'SOLID', color: {r: 1, g: 0.5, b: 0}}];
  //     figma.currentPage.appendChild(rect);
  //     nodes.push(rect);
  //   }
  //   figma.currentPage.selection = nodes;
  //   figma.viewport.scrollAndZoomIntoView(nodes);
  // }

};

const onQuery = (query: string) => {
  sendOptions()
}

const onExecute = async (query: string) => {
  let [cmd, ...other] = query.split(' ')
  const args = other.join(' ')

  const selection: any = figma.currentPage.selection

  // console.log('asdf', getStyle(selection[0]))
  for(const node of selection){
    if (cmd == 'br') commands['borderRadius'](node, args)
    else if (cmd == 'fs') commands['fontSize'](node, args)
    else if (cmd == 'c') await commands['color'](node, args)
  }
  quit()
}

const sendOptions = () => {
  sendToUI(EventType.OPTIONS, options)
}


const sendToUI = (type: EventType, data: any) => {
  figma.ui.postMessage({ type: type, data: data })
}

function quit(){  figma.closePlugin()}

