import React from 'react'
import PropTypes from 'prop-types'

import { panoMediaPlayingState, roomAudioState, hotspotDataState } from '../../state/globalState.js'
import { useRecoilState, useSetRecoilState } from 'recoil'

import HotSpotIndicator from './HotSpotIndicator.jsx'

export default function MediaHotspot (props) {
  const { id, title, type } = props
  const [panoMediaPlaying, setPanoMediaPlaying] = useRecoilState(panoMediaPlayingState)
  const [roomAudio, setRoomAudio] = useRecoilState(roomAudioState)
  const setHotspotData = useSetRecoilState(hotspotDataState)

  // Click callback function
  const onClick = React.useCallback(() => {
    switch (type) {
      case 'audio':
        setHotspotData({
          type,
          jsonFilename: id ? `audio/${id}.json` : undefined,
          title
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
  }, [type, setHotspotData, id, title, roomAudio, panoMediaPlaying, setRoomAudio, setPanoMediaPlaying])

  React.useEffect(() => {
    return () => setRoomAudio(false)
  }, [setRoomAudio])

  // Pack in groups to position in the scene
  return (
    <HotSpotIndicator
      hidden={panoMediaPlaying || roomAudio}
      texName='MediaIconTexture.png'
      onClick={onClick}
      {...props}
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
