import CONFIG from '../config.js'
import React from 'react'

import { panoMediaPlayingState, mediaRewindState, mediaPauseState, mediaSkipState, destroyMediaState } from './globalState.js'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { currentRoomPriorityState } from './fullTourState.js'

// A default crop of zero area
export const NO_CROP = Object.freeze({
  x: 0.0, y: 0.0, width: 0.0, height: 0.0
})

// quick test to see if video is playing
const isVideoPlaying = video => (
  !!(video?.currentTime > 0 && !video?.paused && !video?.ended && video?.readyState > 2)
)

export function useVideoSource (currentPanoData) {
  // Load the pano image or video
  const [currentSrc, setCurrentSrc] = React.useState('')
  const [panoVideo, setPanoVideo] = React.useState(null)
  const [videoCrop, setVideoCrop] = React.useState(NO_CROP)

  // Global state
  const [panoMediaPlaying, setMediaPlaying] = useRecoilState(panoMediaPlayingState)
  const [mediaRewind, setMediaRewind] = useRecoilState(mediaRewindState)
  const [mediaPause, setMediaPaused] = useRecoilState(mediaPauseState)
  const [mediaSkip, setMediaSkip] = useRecoilState(mediaSkipState)
  const destroyMedia = useRecoilValue(destroyMediaState)
  const updateRoomTaskCompletion = useSetRecoilState(currentRoomPriorityState)

  // Make a video tag if we don't have one
  React.useEffect(() => {
    const vid = document.createElement('video')
    vid.crossOrigin = 'anonymous'
    vid.onplay = () => {
      setMediaPaused(false)
      setMediaPlaying(true)
    }
    setPanoVideo(vid)
  }, [setMediaPaused, setMediaPlaying])

  // Remove the video tag
  React.useEffect(() => {
    if (destroyMedia && panoVideo) {
      panoVideo.removeAttribute('src')
      panoVideo.load()
      panoVideo.remove()
    }
  }, [destroyMedia, panoVideo])

  // Possibly load a video
  React.useEffect(() => {
    // Only process video data if 'video' is defined and the 'href' is not empty
    if (currentPanoData?.video?.href && panoVideo !== null) {
      if (currentSrc !== currentPanoData?.video?.href) {
        // Update video element attributes
        panoVideo.src = `${CONFIG.PANO_VIDEO_PATH}/${currentPanoData.video.href}`
        panoVideo.loop = !!currentPanoData.video?.loop
        panoVideo.autoplay = !!currentPanoData.video?.autoPlay
        setCurrentSrc(currentPanoData.video.href)

        // Synchronize playback state
        panoVideo.onended = () => {
          updateRoomTaskCompletion(currentPanoData.video.href)
          setMediaPlaying(false)
        }

        // Update crop box if there is one
        if (currentPanoData.video.crop) {
          setVideoCrop([
            currentPanoData.video.crop?.x,
            currentPanoData.video.crop?.y,
            currentPanoData.video.crop?.x + currentPanoData.video.crop?.width,
            currentPanoData.video.crop?.y + currentPanoData.video.crop?.height
          ])
        }
      }
    } else {
      if (panoVideo) {
        panoVideo.removeAttribute('src')
        panoVideo.load()
      }

      setMediaPlaying(false)
      setVideoCrop(NO_CROP)
    }
  }, [currentPanoData?.video?.autoPlay, currentPanoData?.video?.crop, currentPanoData?.video?.href, currentPanoData?.video?.loop, currentSrc, panoVideo, setMediaPlaying, updateRoomTaskCompletion])

  // Respond to a change in the video playing state
  React.useEffect(() => {
    if (mediaRewind && panoVideo.currentTime > 0) {
      panoVideo.currentTime = 0
      setMediaRewind(false)
    }

    if (mediaSkip) {
      // Jump to the end and unpause if needed
      panoVideo.currentTime = panoVideo.duration - 1.0
      setMediaPaused(false)
      setMediaSkip(false)
    }

    if (isVideoPlaying(panoVideo)) {
      if (mediaPause) {
        panoVideo?.pause()
      }
    } else if (!isVideoPlaying(panoVideo)) {
      if (panoMediaPlaying && !mediaPause) {
        const playPromise = panoVideo?.play()
        if (playPromise) {
          playPromise.catch((error) => {
            console.error('Playback failed')
            console.error(error)
          })
        }
      }
    }
  }, [mediaPause, mediaRewind, mediaSkip, panoMediaPlaying, panoVideo, setMediaPaused, setMediaRewind, setMediaSkip])

  return [panoVideo, videoCrop]
}
