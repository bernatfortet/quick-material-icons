export enum EventType {
  INIT_UI = 'INIT_UI',
  FETCH = 'FETCH',
  QUIT = 'QUIT',
  ICON_CLICK = 'ICON_CLICK',
}

export type InitEventData = {
  history: string[]
  user: User
}

export const COLUMNS_COUNT = 8
