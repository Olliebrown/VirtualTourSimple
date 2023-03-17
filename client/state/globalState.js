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
export const infoAudioPlayingState = atom({
  key: 'infoAudioPlaying',
  default: false
})

export const roomAudioState = atom({
  key: 'roomAudio',
  default: false
})

export const panoMediaPlayingState = atom({
  key: 'panoMediaPlaying',
  default: false
})

export const destroyMediaState = atom({
  key: 'destroyMedia',
  default: false
})

export const mediaRewindState = atom({
  key: 'mediaRewind',
  default: false
})

export const mediaPauseState = atom({
  key: 'mediaPause',
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

// Zoom hotspot modal state
export const zoomModalOpenState = atom({
  key: 'zoomModalOpen',
  default: false
})

// Info hotspot modal state
export const hotspotDataState = atom({
  key: 'hotspotData',
  default: {
    hovering: false,
    showAlways: false,
    title: '',
    jsonFilename: '',
    type: 'unknown'
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
