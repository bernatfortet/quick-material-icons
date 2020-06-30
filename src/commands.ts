const VISUAL_TYPE = ["FRAME", "GROUP", "COMPONENT", "INSTANCE", "BOOLEAN_OPERATION", "VECTOR", "STAR", "ELLIPSE", "POLYGON", "RECTANGLE"]


const commands = {
  borderRadius: (node: any, arg: string) => {
    if (VISUAL_TYPE.indexOf(node.type) >= -1){
      if (arg) node.cornerRadius = parseInt(arg)
    }
  }
}

export default commands