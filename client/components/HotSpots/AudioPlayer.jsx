import React from 'react'
import PropTypes from 'prop-types'

import { mediaPlayingState } from '../../state/globalState.js'
import { useRecoilState } from 'recoil'

import { Box, IconButton, Typography } from '@mui/material'
import {
  SkipPrevious as PreviousIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon
} from '@mui/icons-material'

// Audio and subtitle helpers
import { useAudioSource, useAudioSubtitles } from '../../state/audioHelper.js'

export default function AudioPlayer (props) {
  const { hotspotAudio } = props

  // Global state
  const [mediaPlaying, setMediaPlaying] = useRecoilState(mediaPlayingState)

  // Track subtitle information in local state
  const [subtitleIndex, setSubtitleIndex] = React.useState(-1)
  const [subtitleText, setSubtitleText] = React.useState('')
  const subtitles = useAudioSubtitles(hotspotAudio?.src)

  React.useEffect(() => {
    if (!Array.isArray(subtitles) || subtitles.length < 1) {
      setSubtitleIndex(-1)
      setSubtitleText('')
    }
  }, [subtitles])

  // Local state of playback time
  const [playbackTime, setPlaybackTime] = React.useState(0)
  const onPlayUpdate = React.useCallback((sound) => {
    if (sound && sound.playing()) {
      setPlaybackTime(sound.seek())
      setTimeout(onPlayUpdate, 100, sound)
    }
  }, [])

  // Audio source state management
  const curAudioObj = useAudioSource(
    hotspotAudio?.src,
    (soundObj) => {
      setSubtitleIndex(0)
      onPlayUpdate(soundObj)
      setMediaPlaying(true)
    },
    (soundObj) => {
      setMediaPlaying(false)
    }
  )

  // Be sure to unload audio when unmounted
  React.useEffect(() => {
    return () => curAudioObj?.unload()
  }, [curAudioObj])

  // Play/pause management
  const onPlayPause = () => {
    if (mediaPlaying) {
      curAudioObj?.pause()
      setMediaPlaying(false)
    } else {
      curAudioObj?.play()
      setMediaPlaying(true)
    }
  }

  const onRewind = () => {
    if (curAudioObj) {
      curAudioObj.seek(0)
      setPlaybackTime(0)
      setSubtitleIndex(0)
    }
  }

  // Check for and update subtitle text
  React.useEffect(() => {
    if (subtitleIndex >= 0 && subtitleIndex < subtitles.length) {
      let newSubtitleText = ''
      if (playbackTime >= subtitles[subtitleIndex].startTime) {
        if (playbackTime < subtitles[subtitleIndex].endTime) {
          newSubtitleText = subtitles[subtitleIndex].text.replace(/\s+/g, ' ')
        } else {
          setSubtitleIndex(subtitleIndex + 1)
        }
      }

      if (newSubtitleText !== subtitleText) {
        setSubtitleText(newSubtitleText)
      }
    }
  }, [playbackTime, subtitleIndex, subtitleText, subtitles])

  // Return the buttons when audio object exists
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mr: 'auto' }}>
      <IconButton
        aria-label="previous"
        disabled={playbackTime <= 0}
        onClick={onRewind}
      >
        <PreviousIcon />
      </IconButton>
      <IconButton
        aria-label="play/pause"
        onClick={onPlayPause}
        sx={{ mr: 2 }}
        disabled={!curAudioObj}
      >
        {mediaPlaying
          ? <PauseIcon sx={{ height: 38, width: 38 }} />
          : <PlayIcon sx={{ height: 38, width: 38 }} />}
      </IconButton>
      <Typography variant='body1'>{curAudioObj ? subtitleText : ''}</Typography>
    </Box>
  )
}

AudioPlayer.propTypes = {
  hotspotAudio: PropTypes.shape({
    src: PropTypes.string.isRequired
  })
}

AudioPlayer.defaultProps = {
  hotspotAudio: null
}
