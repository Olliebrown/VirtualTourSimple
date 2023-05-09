import React from 'react'
import PropTypes from 'prop-types'

import { hotspotModalOpenState, hotspotDataState, panoMediaPlayingState, roomAudioState } from '../../state/globalState.js'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import HotSpotIndicator from './HotSpotIndicator.jsx'
import HotSpot from '../Utility/HotSpot.js'

export default function ZoomHotspot (props) {
  const { id, title, ...rest } = props

  // Subscribe to pieces of global state
  const panoMediaPlaying = useRecoilValue(panoMediaPlayingState)
  const roomAudio = useRecoilValue(roomAudioState)
  const setHotspotModalOpen = useSetRecoilState(hotspotModalOpenState)
  const setHotspotData = useSetRecoilState(hotspotDataState)

  const hotSpotBase = React.useMemo(
    () => new HotSpot({ id, title, type: 'zoom', ...rest }),
    [id, title, rest]
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
      hidden={panoMediaPlaying || roomAudio}
      onClick={onClick}
    />
  )
}

ZoomHotspot.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string
}
