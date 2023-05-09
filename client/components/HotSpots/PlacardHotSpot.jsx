import React from 'react'
import PropTypes from 'prop-types'

import { panoMediaPlayingState, roomAudioState } from '../../state/globalState.js'
import { useRecoilValue } from 'recoil'

import HotSpotIndicator from './HotSpotIndicator.jsx'
import HotSpot from '../Utility/HotSpot.js'

export default function PlacardHotspot (props) {
  const { id, title, ...rest } = props

  // Subscribe to changes in global state
  const panoMediaPlaying = useRecoilValue(panoMediaPlayingState)
  const roomAudio = useRecoilValue(roomAudioState)

  const hotSpotBase = React.useMemo(
    () => new HotSpot({ id, title, type: 'placard', ...rest }),
    [id, title, rest]
  )

  return (
    <HotSpotIndicator
      hotSpotBase={hotSpotBase}
      hidden={panoMediaPlaying || roomAudio}
    />
  )
}

PlacardHotspot.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string.isRequired
}
