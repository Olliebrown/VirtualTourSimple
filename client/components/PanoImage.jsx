import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { useTexture } from '@react-three/drei'
import { Euler, MathUtils, BackSide } from 'three'

import useStore from '../state/useStore.js'

import CutoutMaterial from '../shaders/CutoutShader.js'
import Arrow from './Arrow.jsx'
import HEATING_PLANT_IMAGE_LIST from './heatingPlantImages.js'

const NO_CROP = {
  x: 0.0, y: 0.0, width: 0.0, height: 0.0
}

export default function PanoImage (props) {
  const { xRotate, yRotate, zRotate } = props

  // Get the global state of the pano image
  const currentPano = useStore(state => state.currentPano)

  // Load the pano image or video
  const [panoVideo, setPanoVideo] = React.useState(null)
  const [videoCrop, setVideoCrop] = React.useState(NO_CROP)
  let panoImage = null

  // Possibly load a video
  useEffect(() => {
    const currentPanoData = HEATING_PLANT_IMAGE_LIST[currentPano]
    if (currentPanoData.video) {
      const vid = document.createElement('video')
      vid.crossOrigin = 'anonymous'
      vid.src = currentPanoData.video
      vid.loop = true
      vid.play()

      setPanoVideo(vid)
      if (currentPanoData.videoCrop) {
        setVideoCrop([
          currentPanoData.videoCrop.x,
          currentPanoData.videoCrop.y,
          currentPanoData.videoCrop.x + currentPanoData.videoCrop.width,
          currentPanoData.videoCrop.y + currentPanoData.videoCrop.height
        ])
      }

      return () => {
        vid.pause()
        vid.remove()
      }
    } else {
      setPanoVideo(null)
    }
  }, [currentPano])

  // Load the base image texture
  const currentPanoData = HEATING_PLANT_IMAGE_LIST[currentPano]
  panoImage = useTexture(currentPanoData.filename)

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

  return (
    <>
      <mesh
        scale={[-1, 1, 1]}
        rotation={new Euler(
          MathUtils.degToRad(xRotate),
          MathUtils.degToRad(yRotate),
          MathUtils.degToRad(zRotate)
        )}
        {...props}
      >
        <icosahedronGeometry args={[500, 50]} />

        {/* Custom Shader with Pinned Video */}
        <cutoutMaterial
          key={CutoutMaterial.key}
          side={BackSide}
          cropBox={videoCrop}
        >
          {panoVideo && <videoTexture attach="panoVideo" args={[panoVideo]}/>}
          <primitive attach="panoImage" object={panoImage || null}/>
        </cutoutMaterial>

        {/* Standard Material with video or texture */}
        {/* <meshBasicMaterial color={0xffffff} side={BackSide}>
          {panoVideo
            ? <videoTexture attach="map" args={[panoVideo]}/>
            : <primitive attach="map" object={panoImage || null}/>}
        </meshBasicMaterial> */}
      </mesh>
      {exitArrows}
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
