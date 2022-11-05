import React from 'react'
import PropTypes from 'prop-types'

import CONFIG from '../../config.js'

import localDB from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { useRecoilValue, useSetRecoilState } from 'recoil'
import { currentPanoKeyState, setTextureLoadingState } from '../../state/globalState.js'

import { useKTX2 } from '@react-three/drei'
import { Euler, MathUtils, BackSide } from 'three'

import CutoutMaterial from '../../shaders/CutoutShader.js'
import InfoHotSpot from '../HotSpots/InfoHotSpot.jsx'
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
  const currentPanoData = useLiveQuery(() => localDB.panoInfoState.get(currentPanoKey), [currentPanoKey], null)

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
  //       vid.onended = () => updateSetting('mediaPlaying', false)
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
  //       updateSetting('mediaPlaying', false)
  //       setVideoCrop(NO_CROP)
  //     }
  //   } else {
  //     // No video to load so ensure video state is back to default
  //     updateSetting('mediaPlaying', false)
  //     setVideoCrop(NO_CROP)
  //   }
  // }, [currentPanoData?.video, currentPanoData?.videoCrop, panoVideo])

  // // Respond to a change in the video playing state
  // React.useEffect(() => {
  //   if (mediaPlaying) { panoVideo?.play() }
  // }, [mediaPlaying, panoVideo])

  // Load the base image texture
  const setTextureLoading = useSetRecoilState(setTextureLoadingState)
  setTextureLoading(`${CONFIG.PANO_IMAGE_PATH}/${currentPanoKey}_Left.ktx2`)
  const panoImage = useKTX2(`${CONFIG.PANO_IMAGE_PATH}/${currentPanoKey}_Left.ktx2`)

  // Build the exit arrows
  const exitArrows = currentPanoData?.exits.map((exit, i) => {
    return (
      <ExitIndicator {...exit} key={`${exit.key}-${i}`} destination={exit.key} />
    )
  })

  // Build the info hot spots
  const hotSpots = currentPanoData?.hotSpots?.map((info) => {
    const key = `${currentPanoKey}-${info.id}`
    switch (info.type) {
      case 'info': return (<InfoHotSpot key={key} {...info} />)
    }
    return null
  })

  // Is there a video to show and is it playing
  // const showVideo = !!panoVideo && mediaPlaying

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
          cropBox={NO_CROP} // cropBox
          // enableVideo={showVideo}
        >
          {/* {showVideo && <videoTexture attach="panoVideo" args={[panoVideo]}/>} */}
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
