import React from 'react'
import PropTypes from 'prop-types'

import { panoMediaPlayingState, roomAudioState } from '../../state/globalState.js'
import { useRecoilState } from 'recoil'

import HotSpotIndicator from './HotSpotIndicator.jsx'

export default function MediaHotspot (props) {
  const [panoMediaPlaying, setPanoMediaPlaying] = useRecoilState(panoMediaPlayingState)
  const [roomAudio, setRoomAudio] = useRecoilState(roomAudioState)

  // Click callback function
  const onClick = React.useCallback(() => {
    switch (props.type) {
      case 'audio':
        if (!roomAudio) {
          console.log('Setting room audio to true')
          setRoomAudio(true)
        }
        break

      case 'media':
        if (!panoMediaPlaying) {
          setPanoMediaPlaying(true)
        }
        break
    }
  }, [panoMediaPlaying, props.type, roomAudio, setPanoMediaPlaying, setRoomAudio])

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
  type: PropTypes.string
}

MediaHotspot.defaultProps = {
  type: 'unknown'
}
