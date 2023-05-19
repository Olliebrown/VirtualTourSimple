import React from 'react'

import { hotspotModalOpenState, hotspotDataState } from '../../state/globalState.js'
import { useSetRecoilState } from 'recoil'

import HotSpotIndicator from './HotSpotIndicator.jsx'
import HotSpot from '../Utility/HotSpot.js'

export default function ZoomHotspot (props) {
  // Subscribe to pieces of global state
  const setHotspotModalOpen = useSetRecoilState(hotspotModalOpenState)
  const setHotspotData = useSetRecoilState(hotspotDataState)

  const hotSpotBase = React.useMemo(
    () => new HotSpot({ type: 'zoom', ...props }),
    [props]
  )

  // Click callback function
  const onClick = React.useCallback(() => {
    setHotspotData({
      type: hotSpotBase.type,
      title: hotSpotBase.title,
      jsonFilename: hotSpotBase.jsonFilename()
    })
    setHotspotModalOpen('zoom')
  }, [hotSpotBase, setHotspotData, setHotspotModalOpen])

  return (
    <HotSpotIndicator
      hotSpotBase={hotSpotBase}
      onClick={onClick}
    />
  )
}
