import { atom, selector } from 'recoil'

// Texture Loading State (different for each texture URL)
export const LOADING_STATUS = Object.freeze({
  LOADING: 'LOADING', // Loading has begun but is not finished
  DONE: 'DONE', // Loading is complete and was successful
  FAILED: 'FAILED' // Loading is complete and FAILED
})

// The list of textures and their statuses
export const textureStatusState = atom({
  key: 'textureStatus',
  default: {}
})

// Set a texture to be loading
export const setTextureLoadingState = selector({
  key: 'textureLoadingStatus',
  get: ({ get }) => { return get(textureStatusState) },
  set: ({ get, set }, newValues) => {
    // Pack in array if not already
    if (!Array.isArray(newValues)) {
      newValues = [newValues]
    }

    const newTextureStatus = { ...get(textureStatusState) }
    newValues.forEach(newValue => {
      // Don't update if it already exists
      if (!newTextureStatus[newValue]) {
        newTextureStatus[newValue] = LOADING_STATUS.LOADING
        // console.log(`${newValue} has STARTED loading`)
      }
    })
    set(textureStatusState, newTextureStatus)
  }
})

// Set a specific texture to done
export const setTextureDoneState = selector({
  key: 'textureDoneStatus',
  get: ({ get }) => { return get(textureStatusState) },
  set: ({ get, set }, newValues) => {
    // Pack in array if not already
    if (!Array.isArray(newValues)) {
      newValues = [newValues]
    }

    const newTextureStatus = { ...get(textureStatusState) }
    newValues.forEach(newValue => {
      // Only update textures with a 'LOADING' status
      if (newTextureStatus[newValue] === LOADING_STATUS.LOADING) {
        newTextureStatus[newValue] = LOADING_STATUS.DONE
        // console.log(`${newValue} has FINISHED loading`)
      }
    })
    set(textureStatusState, newTextureStatus)
  }
})

// Set all textures to done
export const setTextureAllDoneState = selector({
  key: 'textureAllDoneStatus',
  get: ({ get }) => { return get(textureStatusState) },
  set: ({ get, set }) => {
    // Copy status so we can modify it
    const textureStatus = get(textureStatusState)
    const newStatus = { ...textureStatus }

    // Complete only textures that haven't failed
    Object.keys(textureStatus).forEach(key => {
      if (key.toLocaleLowerCase().includes('.ktx2') && textureStatus[key] !== LOADING_STATUS.FAILED) {
        newStatus[key] = LOADING_STATUS.DONE
      }
    })

    // Update status
    set(textureStatusState, newStatus)
    // console.log('ALL textures have FINISHED loading')
  }
})

// Set a texture to have failed to load
export const setTextureFailedState = selector({
  key: 'textureFailedStatus',
  get: ({ get }) => { return get(textureStatusState) },
  set: ({ get, set }, newValues) => {
    // Pack in array if not already
    if (!Array.isArray(newValues)) {
      newValues = [newValues]
    }

    // Update all the given texture's status
    const newTextureStatus = { ...get(textureStatusState) }
    newValues.forEach(newValue => {
      newTextureStatus[newValue] = LOADING_STATUS.FAILED
      // console.log(`${newValue} has ERRORED while loading`)
    })
    set(textureStatusState, newTextureStatus)
  }
})
