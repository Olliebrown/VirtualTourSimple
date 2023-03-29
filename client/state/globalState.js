import { atom } from 'recoil'

export const loadingProgressState = atom({
  key: 'loadingProgress',
  default: 100
})

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

// Info/Zoom hotspot modal state
export const hotspotModalOpenState = atom({
  key: 'hotspotModalOpen',
  default: ''
})

// Data for the most recently hovered hotspot
export const hotspotHoverState = atom({
  key: 'hotspotHover',
  default: {
    title: '',
    type: 'unknown'
  }
})

// Data for the most recently clicked hotspot
export const hotspotDataState = atom({
  key: 'hotspotData',
  default: {
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
