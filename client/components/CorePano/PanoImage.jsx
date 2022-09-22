import React from 'react'
import PropTypes from 'prop-types'

import { useTexture } from '@react-three/drei'
import { Euler, MathUtils, BackSide } from 'three'

import useStore from '../../state/useStore.js'

import CutoutMaterial from '../../shaders/CutoutShader.js'
import Arrow from './Arrow.jsx'
import HEATING_PLANT_IMAGE_LIST from '../heatingPlantImages.js'
import InfoHotSpot from '../HotSpots/InfoHotSpot.jsx'
import AudioHotSpot from '../HotSpots/AudioHotSpot.jsx'

const NO_CROP = {
  x: 0.0, y: 0.0, width: 0.0, height: 0.0
}

export default function PanoImage (props) {
  const { xRotate, yRotate, zRotate } = props

  // Get the global state of the pano image
  const { currentPano, videoPlaying, setMediaPlaying } = useStore(state => ({
    currentPano: state.currentPano,
    videoPlaying: state.mediaPlaying,
    setMediaPlaying: state.setMediaPlaying
  }))

  // Load the pano image or video
  const [panoVideo, setPanoVideo] = React.useState(null)
  const [videoCrop, setVideoCrop] = React.useState(NO_CROP)

  // Possibly load a video
  React.useEffect(() => {
    const currentPanoData = HEATING_PLANT_IMAGE_LIST[currentPano]
    if (currentPanoData.video) {
      // Make a video HTML tag if we don't have one
      if (panoVideo === null) {
        // Create video HTML tag to stream media
        const vid = document.createElement('video')
        vid.crossOrigin = 'anonymous'
        vid.src = currentPanoData.video.href
        vid.loop = !!currentPanoData.video.loop
        setPanoVideo(vid)

        // Setup to stop showing video once its done
        vid.onended = () => setMediaPlaying(false)
      }

      // Update video state and crop box
      if (currentPanoData.videoCrop) {
        setVideoCrop([
          currentPanoData.videoCrop.x,
          currentPanoData.videoCrop.y,
          currentPanoData.videoCrop.x + currentPanoData.videoCrop.width,
          currentPanoData.videoCrop.y + currentPanoData.videoCrop.height
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
  }, [currentPano, panoVideo, setMediaPlaying])

  // Respond to a change in the video playing state
  React.useEffect(() => {
    if (videoPlaying) { panoVideo?.play() }
  }, [panoVideo, videoPlaying])

  // Load the base image texture
  const currentPanoData = HEATING_PLANT_IMAGE_LIST[currentPano]
  const panoImage = useTexture(currentPanoData.filename)

  // Build the exit arrows
  const exitArrows = currentPanoData?.exits.map((exit) => {
    return (
      <Arrow
        key={currentPano + '-' + exit.name}
        direction={exit.direction}
        destination={exit.name}
      />
    )
  })

  // Build the info hot spots
  const hotSpots = currentPanoData?.hotSpots?.map((info) => {
    const key = `${currentPano}-${info.id}`
    switch (info.type) {
      case 'audio': return (<AudioHotSpot key={key} {...info} />)
      case 'video': return (<InfoHotSpot key={key} {...info} />)
      case 'info': return (<InfoHotSpot key={key} {...info} />)
    }
    return null
  })

  // Is there a video to show and is it playing
  const showVideo = !!panoVideo && videoPlaying

  return (
    <>
      {/* Add extra geometry objects */}
      {exitArrows}
      {hotSpots}

      {/* The main pano image sphere geometry and shader */}
      <mesh
        scale={[-1, 1, 1]} // Deliberately turning this inside-out
        rotation={new Euler(
          MathUtils.degToRad(xRotate),
          MathUtils.degToRad(yRotate),
          MathUtils.degToRad(zRotate)
        )}
        {...props}
      >
        {/* Spherical geometry for the pano */}
        <icosahedronGeometry args={[500, 50]} />

        {/* Custom shader with pano texture and optional pinned video */}
        <cutoutMaterial
          key={CutoutMaterial.key}
          side={BackSide}
          cropBox={videoCrop}
          enableVideo={showVideo}
        >
          {showVideo && <videoTexture attach="panoVideo" args={[panoVideo]}/>}
          <primitive attach="panoImage" object={panoImage || null}/>
        </cutoutMaterial>

      </mesh>
    </>
  )
}

PanoImage.propTypes = {
  xRotate: PropTypes.number,
  yRotate: PropTypes.number,
  zRotate: PropTypes.number
}

PanoImage.defaultProps = {
  xRotate: 0,
  yRotate: 0,
  zRotate: 0
}
