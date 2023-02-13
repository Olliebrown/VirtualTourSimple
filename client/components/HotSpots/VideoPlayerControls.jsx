import CONFIG from '../../config.js'

import React from 'react'
import PropTypes from 'prop-types'

import { mediaSkipState, mediaPauseState, mediaRewindState, panoMediaPlayingState } from '../../state/globalState.js'
import { currentPanoDataState } from '../../state/fullTourState.js'

import { useSetRecoilState, useRecoilState, useRecoilValue } from 'recoil'

import { Fade, Tooltip, Button, ButtonGroup, Paper } from '@mui/material'
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
      <div>
        <Paper
          sx={{
            padding: 2,
            fontSize: '1.2rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '84px',
            width: '500px',
            whiteSpace: 'pre-line',
            position: 'absolute',
            bottom: 45,
            marginLeft: 'auto',
            marginRight: 'auto',
            left: 0,
            right: 0
          }}
        >
          {subtitleText}
        </Paper>

        <ButtonGroup
          size="large"
          variant="contained"
          sx={{ position: 'absolute', bottom: 16, right: 100 }}
        >
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
      </div>
    </Fade>
  )
}

VideoPlayerControls.propTypes = {
  videoTime: PropTypes.number
}

VideoPlayerControls.defaultProps = {
  videoTime: 0.0
}
