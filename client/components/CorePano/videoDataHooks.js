import CONFIG from '../../config.js'
import React from 'react'

import { panoMediaPlayingState, mediaSkipState } from '../../state/globalState.js'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { currentRoomPriorityState } from '../../state/fullTourState.js'

// A default crop of zero area
export const NO_CROP = Object.freeze({
  x: 0.0, y: 0.0, width: 0.0, height: 0.0
})

// quick test to see if video is playing
const isVideoPlaying = video => (
  !!(video?.currentTime > 0 && !video?.paused && !video?.ended && video?.readyState > 2)
)

export function useVideoData (currentPanoData) {
  // Load the pano image or video
  const [panoVideo, setPanoVideo] = React.useState(null)
  const [videoCrop, setVideoCrop] = React.useState(NO_CROP)

  // Global state
  const [panoMediaPlaying, setMediaPlaying] = useRecoilState(panoMediaPlayingState)
  const [mediaSkip, setMediaSkip] = useRecoilState(mediaSkipState)
  const updateRoomTaskCompletion = useSetRecoilState(currentRoomPriorityState)

  // Possibly load a video
  React.useEffect(() => {
    // Only process video data if 'video' is defined and the 'href' is not empty
    if (currentPanoData?.video?.href) {
      // Make a video HTML tag if we don't have one
      if (panoVideo === null) {
        // Create video HTML tag to stream media
        const vid = document.createElement('video')
        vid.crossOrigin = 'anonymous'
        vid.src = `${CONFIG.PANO_VIDEO_PATH}/${currentPanoData.video.href}`
        vid.loop = !!currentPanoData.video?.loop
        vid.autoplay = !!currentPanoData.video?.autoPlay
        setPanoVideo(vid)

        // Synchronize playback state
        vid.onplay = () => setMediaPlaying(true)
        vid.onended = () => {
          updateRoomTaskCompletion(currentPanoData.video.href)
          setMediaPlaying(false)
        }
      }

      // Update video crop box
      if (currentPanoData.video?.crop) {
        setVideoCrop([
          currentPanoData.video.crop?.x,
          currentPanoData.video.crop?.y,
          currentPanoData.video.crop?.x + currentPanoData.video.crop?.width,
          currentPanoData.video.crop?.y + currentPanoData.video.crop?.height
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
      setPanoVideo(null)
      setMediaPlaying(false)
      setVideoCrop(NO_CROP)
    }
  }, [currentPanoData?.video, panoVideo, setMediaPlaying, updateRoomTaskCompletion])

  // Respond to a change in the video playing state
  React.useEffect(() => {
    if (mediaSkip && isVideoPlaying(panoVideo)) {
      panoVideo.currentTime = panoVideo.duration - 1.0
      setMediaSkip(false)
    }

    if (panoMediaPlaying && !isVideoPlaying(panoVideo)) {
      panoVideo?.play()
    }
  }, [mediaSkip, panoMediaPlaying, panoVideo, setMediaSkip])

  return [panoVideo, videoCrop]
}
