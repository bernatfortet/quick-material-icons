import { clone, collectedStyleData } from "./utils"

const VISUAL_TYPE = ["FRAME", "GROUP", "COMPONENT", "INSTANCE", "BOOLEAN_OPERATION", "VECTOR", "STAR", "ELLIPSE", "POLYGON", "RECTANGLE"]
const BLACK_STYLE_ID = 'S:ff960f70500498f74cd4699686bb6a8bdd759d6c,20:0'
const BRAND_STYLE_ID = 'S:0c5baa513e3f80718152d9b017c377227a246f43,22:0'
// type VisualType = FrameNode | InstanceNode | VectorNode | StarNode | EllipseNode | PolygonNode | RectangleNode

type VisualType = RectangleNode

const commands = {
  borderRadius: (node: any, arg: string) => {
    console.log('arg: ', arg);
    console.log('node: ', node);

    if (!arg) return
    if (VISUAL_TYPE.indexOf(node.type) >= -1){
      const [topLeftOrFull, topRigh, bottomRight, bottomLeft ] = arg.split(' ')
      if (bottomLeft) {
        node.topLeftRadius = parseInt(topLeftOrFull)
        node.topRightRadius = parseInt(topRigh)
        node.bottomLeftRadius = parseInt(bottomRight)
        node.bottomRightRadius = parseInt(bottomLeft)
      } else {
        node.cornerRadius = parseInt(topLeftOrFull)
      }
    }
  },
  fontSize: async (node: any, arg: string) => {
    if ( node.fontName !== figma.mixed){
      await figma.loadFontAsync(node.fontName as FontName)
      node.fontSize = parseInt(arg)
    }
  },
  color: async (node: any, arg: string) => {
    console.log(`color--------`)
    let style
    if (arg == 'black') style = importStyleByKey(BLACK_STYLE_ID)
    if (arg == 'brand') style = importStyleByKey(BRAND_STYLE_ID)
    // const fills = clone(node.fills)
    node.fillStyleId = style
  },
}


const importStyleByKey = async (key: string) => {
  try {
    const style = await figma.importStyleByKeyAsync(key) as PaintStyle
    return style
  } catch (error) { console.log(`error`, error) }
}


export default commands