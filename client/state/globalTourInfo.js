import { atom, selector } from 'recoil'

import CONFIG from '../config.js'

import { getPanoDataFromServer, setPanoDataOnServer } from './asyncDataHelper.js'

// Key of the current active pano room
export const currentPanoKeyState = atom({
  key: 'currentPanoKey',
  default: CONFIG.START_KEY
})

// Toggle to force refresh of state
export const currentPanoCacheState = atom({
  key: 'currentPanoCache',
  default: null
})

// Directly retrieve the active pano room data
export const currentPanoDataState = selector({
  key: 'currentPanoData',

  // Retrieve specific key from full data
  get: async ({ get }) => {
    const panoKey = get(currentPanoKeyState)
    return await getPanoDataFromServer(panoKey)
  },

  // Update specific key in data
  set: ({ get, set }, newValue) => {
    // Write back to DB if in use
    const panoKey = get(currentPanoKeyState)
    setPanoDataOnServer(panoKey, newValue)
    set(currentPanoCacheState, newValue)

    // // Sync with locally cached summary state
    // const tourInfo = get(fullTourDataState)
    // set(fullTourDataState, {
    //   ...tourInfo,
    //   [panoKey]: newValue
    // })
  }
})
