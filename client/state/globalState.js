import CONFIG from '../config.js'

import { atom } from 'recoil'

// The currently displayed pano room
export const currentPanoKeyState = atom({
  key: 'currentPanoKey',
  default: CONFIG.START_KEY
})

// The camera rotation
export const currentCameraYawState = atom({
  key: 'currentCameraYaw',
  default: 0.0
})

// Current Media State
export const mediaPlayingState = atom({
  key: 'mediaPlaying',
  default: false
})

// Info hotspot modal state
export const infoHotspotState = atom({
  key: 'infoHotspot',
  default: {
    modalOpen: false,
    title: '',
    jsonFilename: ''
  }
})

// Info hotspot content editor modal state
export const hotspotContentEditJSONState = atom({
  key: 'hotspotContentEditJSON',
  default: {
    modalOpen: false,
    jsonFilename: ''
  }
})
