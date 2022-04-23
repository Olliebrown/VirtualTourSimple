import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { useTexture } from '@react-three/drei'
import { BackSide, Euler, MathUtils } from 'three'
import useStore from '../state/useStore.js'

import Arrow from './Arrow.jsx'
import HEATING_PLANT_IMAGE_LIST from './heatingPlantImages.js'

export default function PanoImage (props) {
  const { xRotate, yRotate, zRotate } = props

  // Get the global state of the pano image
  const currentPano = useStore(state => state.currentPano)

  // Load the pano image or video
  const [panoVideo, setPanoVideo] = React.useState(null)
  let panoImage = null

  // Possibly load a video
  useEffect(() => {
    const currentPanoData = HEATING_PLANT_IMAGE_LIST[currentPano]
    if (currentPanoData.video) {
      const vid = document.createElement('video')
      vid.src = currentPanoData.video
      vid.crossOrigin = 'Anonymous'
      vid.loop = true
      vid.play()
      setPanoVideo(vid)
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
        <meshBasicMaterial color={0x999999} side={BackSide}>
          {panoVideo
            ? <videoTexture attach="map" args={[panoVideo]}/>
            : <primitive attach="map" object={panoImage}/>}
        </meshBasicMaterial>
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
