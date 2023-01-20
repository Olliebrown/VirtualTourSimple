import { atom } from 'recoil'

// The loading curtain state
export const loadingCurtainState = atom({
  key: 'loadingCurtain',
  default: {
    open: true,
    text: ''
  }
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
    hovering: false,
    showAlways: false,
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
