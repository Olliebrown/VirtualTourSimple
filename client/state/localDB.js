import Dexie from 'dexie'
import { setPanoDataOnServer } from './asyncDataHelper'

import heatingPlantTourInfo from './heatingPlantTourInfo.json'

// Create the database
const localDB = new Dexie('VirtualTourDB')
localDB.version(1).stores({
  panoInfoState: 'key',
  settings: 'key'
})

// Ensure DB is initialized form JSON
Object.keys(heatingPlantTourInfo).forEach(async panoKey => {
  const current = await localDB.panoInfoState.get(panoKey)
  if (!current) {
    localDB.panoInfoState.put({ key: panoKey, ...heatingPlantTourInfo[panoKey] })
  }
})

// Grab local cached data
export async function getCurrentPanoData (panoKey) {
  const data = await localDB.panoInfoState.get(panoKey)
  return data
}

// Synchronize local cached data and server data
export async function setCurrentPanoData (panoKey, newData) {
  await localDB.panoInfoState.set({ ...newData, key: panoKey })
  await setPanoDataOnServer(panoKey, newData)
}

// Consistently retrieve and store setting values
export async function getSetting (key, defaultValue = null) {
  const setting = await localDB.settings.get(key)
  return (setting === undefined ? defaultValue : setting.value)
}

export async function updateSetting (key, value) {
  await localDB.settings.put({ key, value })
}

export default localDB
