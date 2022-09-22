import CONFIG from '../config.js'

import create from 'zustand'

import HEATING_PLANT_IMAGE_LIST from '../components/heatingPlantImages.js'

const IMAGE_PREFIX = 'image'

// Convert an index to an image name
function indexToName (index) {
  return IMAGE_PREFIX + (index).toString().padStart(2, '0')
}

// Convert an image name to an index
function nameToIndex (name) {
  return parseInt(name.slice(IMAGE_PREFIX.length))
}

// Create the state management store
const useStore = create(set => ({
  // Motion control Settings
  enableMotionControls: false,
  invertOrbitControls: false,

  // Control setting mutators
  toggleMotionControls: () => set(state => ({
    enableMotionControls: !state.enableMotionControls
  })),
  toggleInvertOrbitControls: () => set(state => {
    console.log('Toggling orbit controls', state.invertOrbitControls)
    return { invertOrbitControls: !state.invertOrbitControls }
  }),

  // Hot spot info state
  lastHotSpotHref: '',
  lastHotSpotTitle: '',
  hotSpotModalOpen: false,

  // Hot spot state mutators
  setLastHotSpotHref: (href) => set(state => {
    return { lastHotSpotHref: href }
  }),
  setLastHotSpotTitle: (title) => set(state => {
    return { lastHotSpotTitle: title }
  }),
  setHotSpotModalOpen: (isOpen) => set(state => {
    return { hotSpotModalOpen: !!isOpen }
  }),

  // Texture Loading State
  loadingStatus: {},

  // Texture Loading State Mutators
  loadingBusy: (url) => set(state => {
    return {
      loadingStatus: {
        ...state.loadingStatus,
        [url]: 'BUSY'
      }
    }
  }),
  loadingCompleted: (url) => set(state => {
    if (url === '*') {
      // Set all to done
      const newLoadingStatus = {}
      Object.keys(state.loadingStatus).forEach((key) => {
        newLoadingStatus[key] = 'DONE'
      })
      return { loadingStatus: newLoadingStatus }
    } else {
      return {
        loadingStatus: {
          ...state.loadingStatus,
          [url]: 'DONE'
        }
      }
    }
  }),
  loadingFailed: (url) => set(state => {
    return {
      loadingStatus: {
        ...state.loadingStatus,
        [url]: 'FAILED'
      }
    }
  }),

  // Pano Image State
  currentPanoIndex: CONFIG.START_INDEX,
  currentPano: indexToName(CONFIG.START_INDEX),
  mediaPlaying: false,

  // Pano Image State mutators
  setPano: (newPano) => set(state => ({
    currentPanoIndex: nameToIndex(newPano),
    currentPano: newPano
  })),
  increasePanoIndex: () => set(state => {
    if (state.currentPanoIndex < HEATING_PLANT_IMAGE_LIST.indexMax) {
      return {
        currentPanoIndex: state.currentPanoIndex + 1,
        currentPano: indexToName(state.currentPanoIndex + 1)
      }
    } else {
      console.error('Already at max index')
    }
  }),
  decreasePanoIndex: () => set(state => {
    if (state.currentPanoIndex > HEATING_PLANT_IMAGE_LIST.indexMin) {
      return {
        currentPanoIndex: state.currentPanoIndex - 1,
        currentPano: indexToName(state.currentPanoIndex - 1)
      }
    } else {
      console.error('Already at min index')
    }
  }),
  setMediaPlaying: (isPlaying) => set(state => {
    return { mediaPlaying: isPlaying }
  }),

  // General Camera State
  currentCameraYaw: -Math.PI / 2,
  setCurrentCameraYaw: (cameraYaw) => set(state => {
    return { currentCameraYaw: cameraYaw }
  })
}))

// Expose for other modules to import
export default useStore
