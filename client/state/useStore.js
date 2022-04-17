import create from 'zustand'

import HEATING_PLANT_IMAGE_LIST from '../components/heatingPlantImages.js'

const IMAGE_PREFIX = 'image'
function indexToName (index) {
  return IMAGE_PREFIX + (index).toString().padStart(2, '0')
}

// Create the state management store
const useStore = create(set => ({
  currentPanoIndex: 2,
  currentPano: indexToName(2),
  setPano: (newPano) => set(state => ({ currentPano: newPano })),
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
