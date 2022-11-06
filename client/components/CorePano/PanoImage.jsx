import React from 'react'
import PropTypes from 'prop-types'

import CONFIG from '../../config.js'

import { useRecoilValue, useSetRecoilState } from 'recoil'
import { currentPanoKeyState, currentPanoDataState } from '../../state/fullTourState.js'
import { setTextureLoadingState } from '../../state/textureLoadingState.js'

import { useKTX2 } from '@react-three/drei'
import { Euler, MathUtils, BackSide } from 'three'

import CutoutMaterial from '../../shaders/CutoutShader.js'
import InfoHotspot from '../Hotspots/InfoHotspot.jsx'
import ExitIndicator from './ExitIndicator.jsx'

const NO_CROP = {
  x: 0.0, y: 0.0, width: 0.0, height: 0.0
}

export default function PanoImage (props) {
  const { xRotate, yRotate, zRotate } = props

  // Subscribe to changes in needed global state
  // const mediaPlaying = useLiveQuery(() => localDB.settings.get('mediaPlaying'))?.value || false

  // Subscribe to pano DB changes
  const currentPanoKey = useRecoilValue(currentPanoKeyState)
  const currentPanoData = useRecoilValue(currentPanoDataState)

  // // Load the pano image or video
  // const [panoVideo, setPanoVideo] = React.useState(null)
  // const [videoCrop, setVideoCrop] = React.useState(NO_CROP)

  // // Possibly load a video
  // React.useEffect(() => {
  //   if (currentPanoData?.video) {
  //     // Make a video HTML tag if we don't have one
  //     if (panoVideo === null) {
  //       // Create video HTML tag to stream media
  //       const vid = document.createElement('video')
  //       vid.crossOrigin = 'anonymous'
  //       vid.src = currentPanoData?.video.href
  //       vid.loop = !!currentPanoData?.video.loop
  //       setPanoVideo(vid)

  //       // Setup to stop showing video once its done
  //       vid.onended = () => setMediaPlaying(false)
  //     }

  //     // Update video state and crop box
  //     if (currentPanoData?.videoCrop) {
  //       setVideoCrop([
  //         currentPanoData?.videoCrop.x,
  //         currentPanoData?.videoCrop.y,
  //         currentPanoData?.videoCrop.x + currentPanoData?.videoCrop.width,
  //         currentPanoData?.videoCrop.y + currentPanoData?.videoCrop.height
  //       ])
  //     }

  //     // Clean up when the user leaves this pano
  //     return () => {
  //       // Stop streaming media
  //       if (panoVideo !== null) {
  //         panoVideo.pause()
  //         panoVideo.remove()
  //       }

  //       // Reset video state
  //       setMediaPlaying(false)
  //       setVideoCrop(NO_CROP)
  //     }
  //   } else {
  //     // No video to load so ensure video state is back to default
  //     setMediaPlaying(false)
  //     setVideoCrop(NO_CROP)
  //   }
  // }, [currentPanoData?.video, currentPanoData?.videoCrop, panoVideo])

  // // Respond to a change in the video playing state
  // React.useEffect(() => {
  //   if (mediaPlaying) { panoVideo?.play() }
  // }, [mediaPlaying, panoVideo])

  // Load the base image texture
  const setTextureLoading = useSetRecoilState(setTextureLoadingState)

  // Create array of texture filenames
  const textureFiles = React.useMemo(() => ([
    `${CONFIG.PANO_IMAGE_PATH}/${currentPanoKey}_Left.ktx2`,
    `${CONFIG.PANO_IMAGE_PATH}/${currentPanoKey}_Right.ktx2`
  ]), [currentPanoKey])

  React.useEffect(() => {
    setTextureLoading(textureFiles)
  }, [setTextureLoading, textureFiles])
  const panoImages = useKTX2(textureFiles)

  // Build the exit arrows
  const exitArrows = currentPanoData?.exits?.map((exit, i) => {
    return (
      <React.Suspense key={`${exit.key}-${i}`} fallback={null}>
        <ExitIndicator {...exit} destination={exit.key} />
      </React.Suspense>
    )
  })

  // Build the info hot spots
  const hotspots = currentPanoData?.hotspots?.map((info) => {
    const key = `${currentPanoKey}-${info.id}`
    switch (info.type) {
      case 'info': return (<InfoHotspot key={key} {...info} />)
    }
    return null
  })

  // Is there a video to show and is it playing
  // const showVideo = !!panoVideo && mediaPlaying

  return (
    <React.Fragment>
      {/* Add extra geometry objects */}
      {exitArrows}
      {hotspots}

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
          cropBox={NO_CROP} // cropBox
          // enableVideo={showVideo}
        >
          {/* {showVideo && <videoTexture attach="panoVideo" args={[panoVideo]}/>} */}
          <primitive attach="panoImage" object={panoImages[0] || null}/>
        </cutoutMaterial>
      </mesh>
    </React.Fragment>
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
