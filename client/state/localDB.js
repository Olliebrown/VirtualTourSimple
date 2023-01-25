import Dexie from 'dexie'

// Create the database
const localDB = new Dexie('VirtualTourDB')
localDB.version(1).stores({
  settings: 'key'
})

// Defaults to use if the settings are not yet defined
export const MOTION_CONTROLS_DEFAULT = false
export const INVERT_CONTROLS_DEFAULT = true

// Consistently store setting value
export async function updateSetting (key, value) {
  await localDB.settings.put({ key, value })
}

export default localDB
