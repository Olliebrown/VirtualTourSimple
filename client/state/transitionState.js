import { atom, selector } from 'recoil'

// Direction of the exit clicked (as an angle in degrees)
export const exitDirectionState = atom({
  key: 'exitDirection',
  default: 0
})

// Global flags about the transition state
export const transitionStartedState = atom({
  key: 'transitionStarted',
  default: false
})

export const transitionCompleteState = atom({
  key: 'transitionComplete',
  default: false
})

// Helper functions to set the transition state
export const startTransitionState = selector({
  key: 'startTransition',
  get: ({ get }) => {
    return get(transitionStartedState)
  },
  set: ({ set }) => {
    set(transitionStartedState, true)
    set(transitionCompleteState, false)
  }
})

export const endTransitionState = selector({
  key: 'endTransition',
  get: ({ get }) => {
    return get(transitionCompleteState)
  },
  set: ({ set }) => {
    set(transitionStartedState, false)
    set(transitionCompleteState, true)
  }
})
