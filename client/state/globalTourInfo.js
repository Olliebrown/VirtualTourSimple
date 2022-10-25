import { atom, selector } from 'recoil'

import CONFIG from '../config.js'
import heatingPlantTourInfo from './heatingPlantTourInfo.json'

// Tour and current pano room state
export const fullTourDataState = atom({
  key: 'fullTourData',
  default: heatingPlantTourInfo
})

// Key of the current active pano room
export const currentPanoKeyState = atom({
  key: 'currentPanoKey',
  default: CONFIG.START_KEY
})

// Directly retrieve the active pano room data
export const currentPanoDataState = selector({
  key: 'currentPanoData',
  get: ({ get }) => {
    const tourInfo = get(fullTourDataState)
    const panoKey = get(currentPanoKeyState)
    return tourInfo[panoKey]
  },
  set: ({ get, set }, newValue) => {
    const tourInfo = get(fullTourDataState)
    const panoKey = get(currentPanoKeyState)
    set(fullTourDataState, { ...tourInfo, [panoKey]: newValue })
  }
})
