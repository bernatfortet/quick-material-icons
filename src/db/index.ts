import { getClientStorageAsync, setClientStorageAsync } from 'shared/clientStorage'
import iconNameList from 'config/iconNameList'

const STORAGE_KEY = 'history'
const MAX_HISTORY = 60

export async function saveIconSelection(iconName: string) {
  console.log('saveIconSelection -> ', iconName)
  const selectionHistory = await getSelectionHistory()
  console.log('selectionHistory: ', selectionHistory)
  const newSelectionHistory = [iconName, ...selectionHistory.filter((i) => i != iconName)].slice(0, MAX_HISTORY)
  setClientStorageAsync(STORAGE_KEY, newSelectionHistory)
}

export async function getSelectionHistory() {
  const history = await getClientStorageAsync(STORAGE_KEY)
  console.log('getSelectionHistory -> ', history)
  return history || []
}

function reset() {
  setClientStorageAsync(STORAGE_KEY, [])
}
