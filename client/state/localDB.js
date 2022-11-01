import Dexie from 'dexie'
import { setPanoDataOnServer } from './asyncDataHelper'

import heatingPlantTourInfo from './heatingPlantTourInfo.json'

// Create the database
const localDB = new Dexie('VirtualTourDB')
localDB.version(1).stores({
  panoInfoState: 'key',
  settings: 'key'
})

// Ensure DB is synchronized to the JSON every time
Object.keys(heatingPlantTourInfo).forEach(async panoKey => {
  localDB.panoInfoState.put({ key: panoKey, ...heatingPlantTourInfo[panoKey] })
})

// Synchronize local cached data and server data
export async function setCurrentPanoData (panoKey, newData) {
  await localDB.panoInfoState.put({ ...newData, key: panoKey })
  await setPanoDataOnServer(panoKey, newData)
}

// Consistently store setting value
export async function updateSetting (key, value) {
  await localDB.settings.put({ key, value })
}

export default localDB
