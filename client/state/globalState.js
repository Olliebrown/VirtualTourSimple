import { atom } from 'recoil'

// Motion control Settings
export const enableMotionControlsState = atom({
  key: 'enableMotionControls',
  default: false
})

// Invert the y-axis controls
export const invertOrbitControlsState = atom({
  key: 'invertOrbitControls',
  default: false
})

// Hot Spot info
export const lastHotSpotHrefState = atom({
  key: 'lastHotSpotHref',
  default: ''
})

export const lastHotSpotTitleState = atom({
  key: 'lastHotSpotTitle',
  default: ''
})

export const hotSpotModalOpenState = atom({
  key: 'hotSpotModalOpen',
  default: false
})

// Is there media of some sort already playing
export const mediaPlayingState = atom({
  key: 'mediaPlaying',
  default: false
})

// General Camera State
export const currentCameraYawState = atom({
  key: 'currentCameraYaw',
  default: -Math.PI / 2
})
