import Dexie from 'dexie'

// Create the database
const localDB = new Dexie('VirtualTourDB')
localDB.version(1).stores({
  settings: 'key'
})

// Consistently store setting value
export async function updateSetting (key, value) {
  await localDB.settings.put({ key, value })
}

export default localDB
