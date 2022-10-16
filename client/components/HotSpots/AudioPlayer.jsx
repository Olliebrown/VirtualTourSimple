import React from 'react'
import PropTypes from 'prop-types'

import Axios from 'axios'

import useStore from '../../state/useStore.js'

import { Box, IconButton, Typography } from '@mui/material'
import {
  SkipPrevious as PreviousIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon
} from '@mui/icons-material'

// Audio and subtitles
import srtParser from 'subtitles-parser-vtt'
import { Howl } from 'howler'

export default function AudioPlayer (props) {
  const { hotSpotAudio } = props

  // Subscribe to pieces of global state
  const { setMediaPlaying, mediaPlaying } = useStore(state => ({
    lastHotSpotHref: state.lastHotSpotHref,
    setMediaPlaying: state.setMediaPlaying,
    mediaPlaying: state.mediaPlaying
  }))

  // Track the loaded audio and its playback in local state
  const [curAudioObj, setCurAudioObj] = React.useState(null)
  const [playbackTime, setPlaybackTime] = React.useState(0)

  // Track subtitle information in local state
  const [subtitles, setSubtitles] = React.useState([])
  const [subtitleIndex, setSubtitleIndex] = React.useState(-1)
  const [subtitleText, setSubtitleText] = React.useState('')

  // Playing continuous callback
  const onPlayUpdate = React.useCallback((sound) => {
    if (sound && sound.playing()) {
      setPlaybackTime(sound.seek())
      setTimeout(onPlayUpdate, 100, sound)
    }
  }, [])

  // Load audio using howler
  React.useEffect(() => {
    // Are there audio sounds to examine?
    if (!curAudioObj && hotSpotAudio?.src) {
      // Try to read subtitle file
      const readSubtitles = async () => {
        try {
          const response = await Axios.get(`${hotSpotAudio.src}.srt`)
          const newSubtitles = srtParser.fromVtt(response.data, 's')
          console.log(newSubtitles)
          setSubtitles(newSubtitles)
          setSubtitleIndex(0)
        } catch (err) {
          console.log('Error reading subtitle file, skipping')
          setSubtitles([])
          setSubtitleIndex(-1)
        }
      }
      readSubtitles()

      // Load the audio for playback using howler.js
      const newSound = new Howl({
        html5: true,
        src: [`${hotSpotAudio.src}.mp3`],

        // Report any audio errors to the console
        onloaderror: (err) => console.error('Failed to load audio:', err),
        onplayerror: (err) => console.error('Audio playback error:', err)
      })

      // Set callbacks
      newSound.on('play', () => {
        setSubtitleIndex(0)
        onPlayUpdate(newSound)
        setMediaPlaying(true)
      })

      newSound.on('end', () => {
        setMediaPlaying(false)
      })

      // Update state
      setCurAudioObj(newSound)
    }

    return () => {
      // Be sure to unload the audio (so it stops playing) when this unmounts
      curAudioObj?.unload()
      setMediaPlaying(false)
    }
  }, [curAudioObj, hotSpotAudio?.src, onPlayUpdate, setMediaPlaying])

  // Play/pause management
  const onPlayPause = () => {
    if (mediaPlaying) {
      curAudioObj.pause()
      setMediaPlaying(false)
    } else {
      curAudioObj.play()
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
          newSubtitleText = subtitles[subtitleIndex].text
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
  if (curAudioObj) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', mr: 'auto' }}>
        <IconButton
          aria-label="previous"
          disabled={playbackTime <= 0}
          onClick={onRewind}
        >
          <PreviousIcon />
        </IconButton>
        <IconButton aria-label="play/pause" onClick={onPlayPause} sx={{ mr: 2 }}>
          {mediaPlaying
            ? <PauseIcon sx={{ height: 38, width: 38 }} />
            : <PlayIcon sx={{ height: 38, width: 38 }} />}
        </IconButton>
        <Typography variant='body1'>{subtitleText}</Typography>
      </Box>
    )
  }

  // Return nothing if no audio object
  return <div />
}

AudioPlayer.propTypes = {
  hotSpotAudio: PropTypes.shape({
    src: PropTypes.string.isRequired
  })
}

AudioPlayer.defaultProps = {
  hotSpotAudio: null
}
