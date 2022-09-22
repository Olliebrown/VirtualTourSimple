import React from 'react'

import useStore from '../../state/useStore.js'

export default function HotSpotContent (props) {
  // Subscribe to pieces of global state
  const { lastHotSpotHref } = useStore(state => ({
    lastHotSpotHref: state.lastHotSpotHref
  }))

  return (
    <iframe
      style={{ width: '100%', height: '100%' }}
      sandbox="allow-same-origin allow-scripts"
      src={lastHotSpotHref}
      title="Hot-Spot Info"
    />
  )
}
