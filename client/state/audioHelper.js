import CONFIG from '../config.js'
import React from 'react'
import { Howl } from 'howler'

export function useAudioSource (audioSrcPrefix, autoplay, onPlay, onEnd) {
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
          autoplay,
          src: [
            `${CONFIG().INFO_AUDIO_PATH}/${audioSrcPrefix}.webm`,
            `${CONFIG().INFO_AUDIO_PATH}/${audioSrcPrefix}.mp3`,
            `${CONFIG().INFO_AUDIO_PATH}/${audioSrcPrefix}.ac3`,
            `${CONFIG().INFO_AUDIO_PATH}/${audioSrcPrefix}.m4a`,
            `${CONFIG().INFO_AUDIO_PATH}/${audioSrcPrefix}.wav`
          ],

          // Report any audio errors to the console
          onloaderror: (soundId, err) => {
            console.error('Failed to load audio:', soundId, '/', err)
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
        setCurAudioObj(newSound)
        setCurAudioSrcPrefix(audioSrcPrefix)

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
  }, [audioSrcPrefix, curAudioObj, curAudioSrcPrefix, autoplay, onEnd, onPlay])

  return curAudioObj
}
