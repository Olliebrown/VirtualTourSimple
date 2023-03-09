import { atom, selector } from 'recoil'

import CONFIG from '../config.js'

// Ability to send updates to server
import { setPanoDataOnServer } from './asyncDataHelper'

// Raw pano tour data
import fullTourData from './heatingPlantTourInfo.json'

// All the pano tour data loaded in state
export const fullTourDataState = atom({
  key: 'fullTourData',
  default: fullTourData
})

// The currently displayed pano room
export const currentPanoKeyState = atom({
  key: 'currentPanoKey',
  default: ''
})

// The pano room being loaded
export const preloadPanoKeyState = atom({
  key: 'preloadPanoKey',
  default: ''
})

// The list of enabled rooms (empty means all enabled)
export const enabledPanoRoomsState = atom({
  key: 'enabledPanoRooms',
  default: []
})

// The list of enabled hotspots (empty means all enabled)
export const enabledHotSpotsState = atom({
  key: 'enabledHotSpots',
  default: []
})

// Disable any priority calculations
export const disablePriorityState = atom({
  key: 'disablePriority',
  default: false
})

// The completed task list of each room
// - Note: This list's length is the "priority level" of that room
// - Only exits and hotspots with equal or higher priorities to the room are shown
export const roomCompletedTasksState = atom({
  key: 'roomCompletedTasks',
  default: {}
})

// Convenience derived state for the priority of the current room only
// - Getter returns an integer that is the length of the task list
// - Call the setter with a new task key to update the list
export const currentRoomPriorityState = selector({
  key: 'currentRoomPriority',

  get: ({ get }) => {
    // If disabled, just return max priority every time
    const priorityDisabled = get(disablePriorityState)
    if (priorityDisabled) {
      return Number.MAX_SAFE_INTEGER
    }

    // Grab data and current room key
    const roomCompletedTasks = get(roomCompletedTasksState)
    const currentPanoKey = get(currentPanoKeyState)

    // Return the length of the task list or zero if it does not exist
    return roomCompletedTasks[currentPanoKey]?.length ?? 0
  },

  set: ({ get, set }, newTaskKey) => {
    // Don't add a null task key
    if (!newTaskKey) {
      console.error('Bad Task key', newTaskKey)
      return
    }

    // Grab data and current room key
    const roomCompletedTasks = get(roomCompletedTasksState)
    const currentPanoKey = get(currentPanoKeyState)

    // Extract the priority array
    const existingPriority = roomCompletedTasks[currentPanoKey] ?? []

    // Only update if this task is not already in the list
    if (!existingPriority.some(item => item === newTaskKey)) {
      // Spread existing priority object and overwrite priority of current room
      set(roomCompletedTasksState, {
        ...roomCompletedTasks,
        [currentPanoKey]: [...existingPriority, newTaskKey]
      })
    }
  }
})

// Convenience derived state for the data for the current pano only
export const currentPanoDataState = selector({
  key: 'currentPanoData',

  get: ({ get }) => {
    const fullTourData = get(fullTourDataState)
    const currentPanoKey = get(currentPanoKeyState)
    return fullTourData[currentPanoKey]
  },

  set: ({ get, set }, newData) => {
    // Retrieve needed state
    const fullTourData = get(fullTourDataState)
    const currentPanoKey = get(currentPanoKeyState)

    // Merge the old and new data
    const newPanoData = {
      ...fullTourData[currentPanoKey],
      ...newData
    }

    // Update server data if enabled
    if (CONFIG().ENABLE_DATA_EDITING) {
      // CAUTION: this is asynchronous
      setPanoDataOnServer(currentPanoKey, newData)
    }

    // Merge and reset the current pano
    set(fullTourDataState, {
      ...fullTourData,
      [currentPanoKey]: newPanoData
    })
  }
})

// Convenience derived state for the data for the pano room that is preloading
export const preloadPanoDataState = selector({
  key: 'preloadPanoData',

  get: ({ get }) => {
    const fullTourData = get(fullTourDataState)
    const preloadPanoKey = get(preloadPanoKeyState)
    return fullTourData[preloadPanoKey]
  }
})

// Convenience derived state for just the pano keys
export const allPanoKeysState = selector({
  key: 'allPanoKeys',
  get: ({ get }) => {
    const fullTourData = get(fullTourDataState)
    return Object.keys(fullTourData).sort()
  }
})
