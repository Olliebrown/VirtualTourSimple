import React from 'react'
import PropTypes from 'prop-types'

import { panoMediaPlayingState, roomAudioState, hotspotDataState } from '../../state/globalState.js'
import { useRecoilState, useSetRecoilState } from 'recoil'

import HotSpotIndicator from './HotSpotIndicator.jsx'
import HotSpot from '../Utility/HotSpot.js'

export default function MediaHotspot (props) {
  const { id, title, type, ...rest } = props
  const [panoMediaPlaying, setPanoMediaPlaying] = useRecoilState(panoMediaPlayingState)
  const [roomAudio, setRoomAudio] = useRecoilState(roomAudioState)
  const setHotspotData = useSetRecoilState(hotspotDataState)

  const hotSpotBase = React.useMemo(
    () => new HotSpot({ id, title, type, ...rest }),
    [id, title, type, rest]
  )

  // Click callback function
  const onClick = React.useCallback(() => {
    switch (hotSpotBase.type) {
      case 'audio':
        setHotspotData({
          type: hotSpotBase.type,
          title: hotSpotBase.title,
          jsonFilename: hotSpotBase.jsonFilename()
        })

        if (!roomAudio) {
          setRoomAudio(true)
        }
        break

      case 'media':
        if (!panoMediaPlaying) {
          setPanoMediaPlaying(true)
        }
        break
    }
  }, [hotSpotBase, setHotspotData, roomAudio, panoMediaPlaying, setRoomAudio, setPanoMediaPlaying])

  React.useEffect(() => {
    return () => setRoomAudio(false)
  }, [setRoomAudio])

  // Pack in groups to position in the scene
  return (
    <HotSpotIndicator
      hotSpotBase={hotSpotBase}
      hidden={panoMediaPlaying || roomAudio}
      onClick={onClick}
    />
  )
}

MediaHotspot.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string
}

MediaHotspot.defaultProps = {
  title: ''
}
