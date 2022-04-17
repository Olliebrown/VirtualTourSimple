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
  // State
  currentPanoIndex: CONFIG.START_INDEX,
  currentPano: indexToName(CONFIG.START_INDEX),

  // State mutators
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
  })
}))

// Expose for other modules to import
export default useStore
