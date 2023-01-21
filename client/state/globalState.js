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

export const mediaSkipState = atom({
  key: 'mediaSkip',
  default: false
})

// Info hotspot modal state
export const infoModalOpenState = atom({
  key: 'infoModalOpen',
  default: false
})

// Info hotspot modal state
export const infoHotspotDataState = atom({
  key: 'infoHotspotData',
  default: {
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
