import CONFIG from '../config.js'

// React and AJAX libraries
import React from 'react'
import Axios from 'axios'

// Audio and subtitles
import srtParser from 'subtitles-parser-vtt'
import { Howl } from 'howler'

export function useAudioSubtitles (audioSrcPrefix) {
  const [curAudioSrcPrefix, setCurAudioSrcPrefix] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [subtitles, setSubtitles] = React.useState([])

  React.useEffect(() => {
    // Try to read subtitle file
    const readSubtitles = async () => {
      if (!isLoading) {
        setIsLoading(true)
        try {
          // Read and parse the subtitles
          const response = await Axios.get(`${CONFIG.INFO_AUDIO_PATH}/${audioSrcPrefix}.srt`)
          const newSubtitles = srtParser.fromVtt(response.data, 's')

          setCurAudioSrcPrefix(audioSrcPrefix)
          setSubtitles(newSubtitles)
        } catch (err) {
          console.error('Error reading subtitle file, skipping')
          console.error(err)

          // Update local state (go ahead and set prefix so we don't try to load again)
          setCurAudioSrcPrefix(audioSrcPrefix)
          setSubtitles([])
        } finally {
          setIsLoading(false)
        }
      }
    }

    // Only read if prefix has changed
    if (curAudioSrcPrefix !== audioSrcPrefix) {
      if (audioSrcPrefix) {
        readSubtitles()
      } else {
        // When nullish, just record and set an empty array
        setCurAudioSrcPrefix(audioSrcPrefix)
        setSubtitles([])
      }
    }
  }, [audioSrcPrefix, curAudioSrcPrefix, isLoading])

  // May be an empty array
  return subtitles
}

export function useAudioSource (audioSrcPrefix, onPlay, onEnd) {
  const [curAudioSrcPrefix, setCurAudioSrcPrefix] = React.useState('')
  const [curAudioObj, setCurAudioObj] = React.useState(null)

  React.useEffect(() => {
    if (audioSrcPrefix !== curAudioSrcPrefix) {
      // Unload previous audio object if any
      curAudioObj?.unload()

      if (audioSrcPrefix) {
        // Load the audio for playback using howler.js
        const newSound = new Howl({
          html5: true,
          src: [`${CONFIG.INFO_AUDIO_PATH}/${audioSrcPrefix}.mp3`],

          // Report any audio errors to the console
          onloaderror: (err) => {
            console.error('Failed to load audio:', err)
            setCurAudioSrcPrefix(audioSrcPrefix)
            curAudioObj?.unload()
            setCurAudioObj(null)
          },
          onplayerror: (err) => {
            console.error('Audio playback error:', err)
            if (onEnd) { onEnd(null) }
          }
        })

        // Set callbacks
        newSound.on('play', () => { onPlay(newSound) })
        newSound.on('end', () => { onEnd(newSound) })

        // Update state
        setCurAudioSrcPrefix(audioSrcPrefix)
        setCurAudioObj(newSound)

        // Return cleanup for unmounting
        return () => {
          if (newSound?.playing()) {
            newSound.stop()
          }
          newSound?.unload()
          if (onEnd) { onEnd(newSound) }
        }
      } else {
        setCurAudioSrcPrefix(audioSrcPrefix)
        setCurAudioObj(null)
      }
    }
  }, [audioSrcPrefix, curAudioObj, curAudioSrcPrefix, onEnd, onPlay])

  return curAudioObj
}
