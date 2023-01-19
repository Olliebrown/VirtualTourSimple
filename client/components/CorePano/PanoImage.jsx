import React from 'react'
import PropTypes from 'prop-types'

import CONFIG from '../../config.js'

import localDB from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { loadingCurtainState, mediaPlayingState } from '../../state/globalState.js'
import { currentPanoKeyState, currentPanoDataState, enabledPanoRoomsState, enabledHotSpotsState } from '../../state/fullTourState.js'
import { setTextureLoadingState } from '../../state/textureLoadingState.js'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { useKTX2 } from '@react-three/drei'
import { Euler, MathUtils, BackSide } from 'three'

import { NO_CROP, useVideoData } from './videoDataHooks.js'

import CutoutMaterial from '../../shaders/CutoutShader.js'
import InfoHotspot from '../HotSpots/InfoHotSpot.jsx'
import ExitIndicator from './ExitIndicator.jsx'

export default function PanoImage (props) {
  const { xRotate, yRotate, zRotate } = props

  // Subscribe to changes in needed global state
  const showExits = useLiveQuery(() => localDB.settings.get('showExits'))?.value ?? true

  // Subscribe to pano DB changes
  const currentPanoKey = useRecoilValue(currentPanoKeyState)
  const currentPanoData = useRecoilValue(currentPanoDataState)
  const enabledRooms = useRecoilValue(enabledPanoRoomsState)
  const enabledHotSpots = useRecoilValue(enabledHotSpotsState)
  const mediaPlaying = useRecoilValue(mediaPlayingState)

  // Loading curtain state
  const setLoadingCurtain = useSetRecoilState(loadingCurtainState)

  // Create filtered arrays of exits and hotspots
  const filteredExits = enabledRooms.length > 0
    ? currentPanoData?.exits?.filter(exit => enabledRooms.includes(exit.key))
    : currentPanoData?.exits

  const filteredHotSpots = enabledHotSpots.length > 0
    ? currentPanoData?.hotspots?.filter(hotspot => enabledHotSpots.includes(hotspot.id))
    : currentPanoData?.hotspots

  // Load the base image texture
  const setTextureLoading = useSetRecoilState(setTextureLoadingState)

  // Create array of texture filenames
  const textureFiles = React.useMemo(() => ([
    `${CONFIG.PANO_IMAGE_PATH}/${currentPanoKey}_Left.ktx2`,
    // `${CONFIG.PANO_IMAGE_PATH}/${currentPanoKey}_Right.ktx2`,
    ...(filteredExits ? filteredExits.map(exit => `${CONFIG.PANO_IMAGE_PATH}/${exit.key}_Left.ktx2`) : [])
    // ...(filteredExits ? filteredExits.map(exit => `${CONFIG.PANO_IMAGE_PATH}/${exit.key}_Right.ktx2`) : [])
  ]), [filteredExits, currentPanoKey])

  React.useEffect(() => {
    setTextureLoading(textureFiles)
  }, [setTextureLoading, textureFiles])
  const panoImages = useKTX2(textureFiles)

  React.useEffect(() => {
    setLoadingCurtain({ text: '', open: true })
  }, [setLoadingCurtain, panoImages])

  // Possibly load video
  const [panoVideo, videoCrop] = useVideoData(currentPanoData)

  // Build the exit arrows
  const exitArrows = filteredExits?.map((exit, i) => {
    return (
      <React.Suspense key={`${exit.key}-${i}`} fallback={null}>
        <ExitIndicator {...exit} destination={exit.key} />
      </React.Suspense>
    )
  })

  // Build the info hot spots
  const hotspots = filteredHotSpots?.map(info => {
    const key = `${currentPanoKey}-${info.id}`
    switch (info.type) {
      case 'info': return (<InfoHotspot key={key} {...info} />)
    }
    return null
  })

  // Is there a video to show and is it playing
  const showVideo = !!panoVideo && mediaPlaying

  return (
    <React.Fragment>
      {/* Add extra geometry objects */}
      {showExits && exitArrows}
      {showExits && hotspots}

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
          cropBox={showVideo ? videoCrop : NO_CROP}
          enableVideo={showVideo}
        >
          {showVideo && <videoTexture attach="panoVideo" args={[panoVideo]}/>}
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
