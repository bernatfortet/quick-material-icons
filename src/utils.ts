export enum EventType {
  QUIT = 'QUIT',
  QUERY = 'QUERY',
  OPTIONS = 'OPTIONS',
  EXECUTE = 'EXECUTE'
}

export type Option = {
  name: string
  shorthand: string
  unit: string | string[]
  command: string
}

export type EventUI = {
  type: EventType,
  data: any
}