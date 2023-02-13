// React and AJAX libraries
import React from 'react'
import Axios from 'axios'

// Audio and subtitles
import srtParser from 'subtitles-parser-vtt'

export function useSubtitles (subtitlePath, playbackTime) {
  // Subtitle file state
  const [curSubtitlePath, setCurSubtitlePath] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [subtitles, setSubtitles] = React.useState([])

  // Current subtitle index and text
  const [subtitleIndex, setSubtitleIndex] = React.useState(-1)
  const [subtitleText, setSubtitleText] = React.useState('')

  // Reading of the subtitle file
  React.useEffect(() => {
    // Try to read subtitle file
    const readSubtitles = async () => {
      if (!isLoading) {
        setIsLoading(true)
        try {
          // Read and parse the subtitles
          const response = await Axios.get(subtitlePath)
          const newSubtitles = srtParser.fromVtt(response.data, 's')

          setCurSubtitlePath(subtitlePath)
          setSubtitles(newSubtitles)
          setSubtitleText('')
          setSubtitleIndex(0)
          console.log('Subtitle path updated to', subtitlePath)
        } catch (err) {
          console.error('Error reading subtitle file, skipping')
          console.error(err)

          // Update local state (go ahead and set prefix so we don't try to load again)
          setCurSubtitlePath(subtitlePath)
          setSubtitles([])

          setSubtitleText('')
          setSubtitleIndex(-1)
          console.log('Subtitle path errored to', subtitlePath)
        } finally {
          setIsLoading(false)
        }
      }
    }

    // Only read if prefix has changed
    if (curSubtitlePath !== subtitlePath) {
      if (subtitlePath) {
        console.log(`Reading subtitles from "${subtitlePath}" (old path was "${curSubtitlePath}")`)
        readSubtitles()
      } else {
        // When nullish, just record and set an empty array
        if (subtitlePath) setCurSubtitlePath(subtitlePath)
        setSubtitles([])

        setSubtitleText('')
        setSubtitleIndex(-1)
      }
    }
  }, [subtitlePath, curSubtitlePath, isLoading])

  React.useEffect(() => {
    if (!isLoading && playbackTime <= 0.0 && subtitleIndex > 0) {
      setSubtitleIndex(0)
      setSubtitleText('')
    }
  }, [isLoading, playbackTime, subtitleIndex])

  // Check for and update subtitle text
  React.useEffect(() => {
    // Check for new subtitle text
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

  // Return current index, text, and start time of text (if any)
  return [subtitleText, subtitleIndex, subtitles[subtitleIndex]?.startTime ?? 0.0]
}
