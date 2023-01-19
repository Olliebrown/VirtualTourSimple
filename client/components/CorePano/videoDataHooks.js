import React from 'react'

import { mediaPlayingState } from '../../state/globalState.js'
import { useRecoilState } from 'recoil'

// A default crop of zero area
export const NO_CROP = Object.freeze({
  x: 0.0, y: 0.0, width: 0.0, height: 0.0
})

export function useVideoData (currentPanoData) {
  // Load the pano image or video
  const [panoVideo, setPanoVideo] = React.useState(null)
  const [videoCrop, setVideoCrop] = React.useState(NO_CROP)

  // Global state
  const [mediaPlaying, setMediaPlaying] = useRecoilState(mediaPlayingState)

  // Possibly load a video
  React.useEffect(() => {
    if (currentPanoData?.video) {
      // Make a video HTML tag if we don't have one
      if (panoVideo === null) {
        // Create video HTML tag to stream media
        const vid = document.createElement('video')
        vid.crossOrigin = 'anonymous'
        vid.src = currentPanoData?.video.href
        vid.loop = !!currentPanoData?.video.loop
        setPanoVideo(vid)

        // Setup to stop showing video once its done
        vid.onended = () => setMediaPlaying(false)
      }

      // Update video state and crop box
      if (currentPanoData?.video.crop) {
        setVideoCrop([
          currentPanoData?.video.crop.x,
          currentPanoData?.video.crop.y,
          currentPanoData?.video.crop.x + currentPanoData?.video.crop.width,
          currentPanoData?.video.crop.y + currentPanoData?.video.crop.height
        ])
      }

      // Clean up when the user leaves this pano
      return () => {
        // Stop streaming media
        if (panoVideo !== null) {
          panoVideo.pause()
          panoVideo.remove()
        }

        // Reset video state
        setMediaPlaying(false)
        setVideoCrop(NO_CROP)
      }
    } else {
      // No video to load so ensure video state is back to default
      setMediaPlaying(false)
      setVideoCrop(NO_CROP)
    }
  }, [currentPanoData?.video, panoVideo, setMediaPlaying])

  // Respond to a change in the video playing state
  React.useEffect(() => {
    if (mediaPlaying) { panoVideo?.play() }
  }, [mediaPlaying, panoVideo])

  return [panoVideo, videoCrop]
}
