import CONFIG from '../../config.js'

import React from 'react'
import PropTypes from 'prop-types'

import { mediaSkipState, mediaPauseState, mediaRewindState, panoMediaPlayingState } from '../../state/globalState.js'
import { currentPanoDataState } from '../../state/fullTourState.js'

import { useSetRecoilState, useRecoilState, useRecoilValue } from 'recoil'

import { Fade, Tooltip, Button, ButtonGroup } from '@mui/material'
import {
  SkipNext as FastForwardIcon,
  Pause as PauseIcon,
  PlayArrow as PlayIcon,
  SkipPrevious as RewindIcon
} from '@mui/icons-material'

import { useSubtitles } from '../../state/subtitlesHelper.js'

// Button to skip playing media
export default function VideoPlayerControls (props) {
  const { videoTime } = props

  // Global media playback state
  const currentPanoData = useRecoilValue(currentPanoDataState)
  const panoMediaPlaying = useRecoilValue(panoMediaPlayingState)
  const setMediaRewind = useSetRecoilState(mediaRewindState)
  const [mediaPaused, setMediaPaused] = useRecoilState(mediaPauseState)
  const setMediaSkip = useSetRecoilState(mediaSkipState)

  // Determine path to subtitle file
  let subtitlePath = currentPanoData?.video?.href
  if (typeof subtitlePath === 'string') {
    const basename = subtitlePath.substring(0, subtitlePath.lastIndexOf('.'))
    subtitlePath = `${CONFIG.PANO_VIDEO_PATH}/${basename}.srt`
  }

  // Determine current subtitle
  const [subtitleText] = useSubtitles(subtitlePath, videoTime)

  return (
    <Fade in={panoMediaPlaying}>
      <ButtonGroup
        size="large"
        variant="contained"
        sx={{ position: 'absolute', bottom: 45, right: 100 }}
      >
        <Button
          disableRipple
          sx={{
            fontSize: '1.2rem',
            backgroundColor: 'white',
            color: 'black',
            width: '50vw',
            justifyContent: 'left',
            textTransform: 'none',
            cursor: 'default',
            '&:hover': {
              backgroundColor: 'white',
              color: 'black'
            }
          }}
        >
          {subtitleText}
        </Button>
        <Tooltip title="Restart Video">
          <Button onClick={() => setMediaRewind(true)}>
            <RewindIcon />
          </Button>
        </Tooltip>

        <Tooltip title={mediaPaused ? 'Resume Video' : 'Pause Video'}>
          <Button onClick={() => setMediaPaused(!mediaPaused)}>
            {mediaPaused ? <PlayIcon/> : <PauseIcon />}
          </Button>
        </Tooltip>

        <Tooltip title="Skip to End of Video">
          <Button onClick={() => setMediaSkip(true)}>
            <FastForwardIcon />
          </Button>
        </Tooltip>
      </ButtonGroup>
    </Fade>
  )
}

VideoPlayerControls.propTypes = {
  videoTime: PropTypes.number
}

VideoPlayerControls.defaultProps = {
  videoTime: 0.0
}
