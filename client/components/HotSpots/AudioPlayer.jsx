import CONFIG from '../../config.js'

import React from 'react'
import PropTypes from 'prop-types'

import { infoAudioPlayingState } from '../../state/globalState.js'
import { useRecoilState } from 'recoil'

import { Box, IconButton, Typography } from '@mui/material'
import {
  SkipPrevious as PreviousIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon
} from '@mui/icons-material'

// Audio and subtitle helpers
import { useAudioSource } from '../../state/audioHelper.js'
import { useSubtitles } from '../../state/subtitlesHelper.js'

export default function AudioPlayer (props) {
  const { hotspotAudio, setSlideIndex, autoplay } = props

  // Global state
  const [infoAudioPlaying, setInfoAudioPlaying] = useRecoilState(infoAudioPlayingState)

  // Local state of playback time
  const [playbackTime, setPlaybackTime] = React.useState(0)
  const onPlayUpdate = React.useCallback((sound) => {
    if (sound && sound.playing()) {
      setPlaybackTime(sound.seek())
      setTimeout(onPlayUpdate, 100, sound)
    }
  }, [])

  // Track subtitle information in local state
  const [subtitleText, subtitleIndex, subtitleStartTime] =
    useSubtitles(`${CONFIG().INFO_AUDIO_PATH}/${hotspotAudio?.src}.srt`, playbackTime)

  // Sync slide timing with subtitle index
  React.useEffect(() => {
    if (setSlideIndex && hotspotAudio?.slideTiming) {
      if (subtitleText !== '' && playbackTime >= subtitleStartTime) {
        if (hotspotAudio.slideTiming[subtitleIndex] !== undefined) {
          const timing = hotspotAudio.slideTiming[subtitleIndex].split('-')
          const slide = parseInt(timing[0])
          const build = (timing[1] ? parseInt(timing[1]) : 0)
          setSlideIndex([slide, build])
        }
      }
    }
  }, [hotspotAudio.slideTiming, setSlideIndex, playbackTime, subtitleStartTime, subtitleText, subtitleIndex])

  // Audio source state management
  const curAudioObj = useAudioSource(
    hotspotAudio?.src,
    autoplay,
    (soundObj) => {
      onPlayUpdate(soundObj)
      setInfoAudioPlaying(true)
    },
    (soundObj) => {
      setInfoAudioPlaying(false)
    }
  )

  // Be sure to unload audio when unmounted
  React.useEffect(() => {
    return () => {
      curAudioObj?.unload()
      setInfoAudioPlaying(false)
    }
  }, [curAudioObj, setInfoAudioPlaying])

  // Play/pause management
  const onPlayPause = () => {
    if (infoAudioPlaying) {
      curAudioObj?.pause()
      setInfoAudioPlaying(false)
    } else {
      curAudioObj?.play()
      setInfoAudioPlaying(true)
    }
  }

  const onRewind = () => {
    if (curAudioObj) {
      curAudioObj.seek(0)
      setPlaybackTime(0)
      if (setSlideIndex) {
        setSlideIndex([0, 0])
      }
    }
  }

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
        {infoAudioPlaying
          ? <PauseIcon sx={{ height: 38, width: 38 }} />
          : <PlayIcon sx={{ height: 38, width: 38 }} />}
      </IconButton>
      <Typography variant='body1' sx={{ fontSize: '1.2rem' }}>{curAudioObj ? subtitleText?.replace(/\s+/g, ' ') : ''}</Typography>
    </Box>
  )
}

AudioPlayer.propTypes = {
  hotspotAudio: PropTypes.shape({
    src: PropTypes.string.isRequired,
    slideTiming: PropTypes.object
  }),
  setSlideIndex: PropTypes.func,
  autoplay: PropTypes.bool
}

AudioPlayer.defaultProps = {
  hotspotAudio: null,
  setSlideIndex: null,
  autoplay: false
}
