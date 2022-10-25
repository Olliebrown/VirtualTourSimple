import { atom, selector } from 'recoil'

import CONFIG from '../config.js'

// Texture Loading State (different for each texture URL)
export const LOADING_STATUS = Object.freeze({
  LOADING: 'LOADING', // Loading has begun but is not finished
  DONE: 'DONE', // Loading is complete and was successful
  FAILED: 'FAILED' // Loading is complete and FAILED
})

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

// The list of textures and their statuses
export const textureStatusState = atom({
  key: 'textureStatus',
  default: {}
})

// Set a texture to be loading
export const setTextureLoadingState = selector({
  key: 'textureLoadingStatus',
  get: ({ get }) => {
    return get(textureStatusState)
  },
  set: ({ get, set }, newValue) => {
    const textureStatus = get(textureStatusState)
    set(textureStatusState, { ...textureStatus, [newValue]: LOADING_STATUS.LOADING })
  }
})

// Set a texture to done
export const setTextureAllDoneState = selector({
  key: 'textureAllDoneStatus',
  get: ({ get }) => {
    return get(textureStatusState)
  },
  set: ({ get, set }) => {
    const textureStatus = get(textureStatusState)
    const newStatus = {}
    Object.keys(textureStatus).forEach(textureKey => { newStatus[textureKey] = LOADING_STATUS.DONE })
    set(textureStatusState, newStatus)
  }
})

// Set a texture to have failed to load
export const setTextureFailedState = selector({
  key: 'textureFailedStatus',
  get: ({ get }) => {
    return get(textureStatusState)
  },
  set: ({ get, set }, newValue) => {
    const textureStatus = get(textureStatusState)
    set(textureStatusState, { ...textureStatus, [newValue]: LOADING_STATUS.FAILED })
  }
})
