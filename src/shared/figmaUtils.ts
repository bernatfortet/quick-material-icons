export type PaintableNode =
  | FrameNode
  | InstanceNode
  | ComponentNode
  | RectangleNode
  | EllipseNode
  | PolygonNode
  | TextNode
  | LineNode
  | VectorNode
  | StarNode
  | BooleanOperationNode

export const getIsPaintableNode = ({ type }: SceneNode) => {
  return (
    type === 'FRAME' ||
    type === 'INSTANCE' ||
    type === 'COMPONENT' ||
    type === 'RECTANGLE' ||
    type === 'ELLIPSE' ||
    type === 'POLYGON' ||
    type === 'TEXT' ||
    type === 'LINE' ||
    type === 'VECTOR' ||
    type === 'STAR' ||
    type === 'BOOLEAN_OPERATION'
  )
}

export const filterPaintableNodes = (
  nodes: SceneNode[] | readonly SceneNode[],
): PaintableNode[] => {
  return nodes.filter((node) => getIsPaintableNode(node)) as PaintableNode[]
}
