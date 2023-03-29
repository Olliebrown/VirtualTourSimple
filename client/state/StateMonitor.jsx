import React from 'react'

import { hotspotDataState, hotspotModalOpenState } from './globalState.js'
import { useRecoilCallback } from 'recoil'

export default function StateMonitor () {
  const logState = useRecoilCallback(({ snapshot }) => () => {
    console.log('Hotspot Data: ', snapshot.getLoadable(hotspotDataState).contents)
    console.log('Modal Open: ', snapshot.getLoadable(hotspotModalOpenState).contents)
  })

  // Just always log the state
  logState()

  return (
    <div />
  )
}
