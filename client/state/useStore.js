import create from 'zustand'

// Create the state management store
const useStore = create(set => ({
  currentPano: 'media/panoImg/IMG_20220401_091556_00_merged.jpg',
  changePano: (newPano) => set(state => ({ currentPano: newPano }))
}))

// Expose for other modules to import
export default useStore
