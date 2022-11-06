import { atom, selector } from 'recoil'

import CONFIG from '../config.js'

// Ability to send updates to server
import { setPanoDataOnServer } from './asyncDataHelper'

// Raw pano tour data
import fullTourData from './heatingPlantTourInfo.json'

// All the pano tour data loaded in state
export const fullTourDataState = atom({
  key: 'fullTourData',
  default: fullTourData
})

// The currently displayed pano room
export const currentPanoKeyState = atom({
  key: 'currentPanoKey',
  default: CONFIG.START_KEY
})

// Convenience derived state for the data for the current pano only
export const currentPanoDataState = selector({
  key: 'currentPanoData',

  get: ({ get }) => {
    const fullTourData = get(fullTourDataState)
    const currentPanoKey = get(currentPanoKeyState)
    return fullTourData[currentPanoKey]
  },

  set: ({ get, set }, newData) => {
    // Retrieve needed state
    const fullTourData = get(fullTourDataState)
    const currentPanoKey = get(currentPanoKeyState)

    // Merge the old and new data
    const newPanoData = {
      ...fullTourData[currentPanoKey],
      ...newData
    }

    // Update server data if enabled
    if (CONFIG.ENABLE_DATA_EDITING) {
      // CAUTION: this is asynchronous
      setPanoDataOnServer(currentPanoKey, newData)
    }

    // Merge and reset the current pano
    set(fullTourDataState, {
      ...fullTourData,
      [currentPanoKey]: newPanoData
    })
  }
})

// Convenience derived state for just the pano keys
export const allPanoKeysState = selector({
  key: 'allPanoKeys',
  get: ({ get }) => {
    const fullTourData = get(fullTourDataState)
    return Object.keys(fullTourData).sort()
  }
})
