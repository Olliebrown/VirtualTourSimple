import create from 'zustand'

// Create the state management store
const useStore = create(set => ({
  currentPano: '',
  changePano: (newPano) => set(state => ({ currentPano: newPano }))
}))

// Expose for other modules to import
export default useStore
