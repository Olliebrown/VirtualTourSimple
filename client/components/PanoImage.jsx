import React from 'react'
import PropTypes from 'prop-types'

import { useTexture } from '@react-three/drei'
import { BackSide, MathUtils } from 'three'
import useStore from '../state/useStore.js'

import HEATING_PLANT_IMAGE_LIST from './heatingPlantImages.js'

export default function PanoImage (props) {
  const { xRotate, zRotate, yRotate } = props

  // Get the global state of the pano image
  const currentPano = useStore(state => state.currentPano)

  // Load the pano image
  const currentPanoData = HEATING_PLANT_IMAGE_LIST[currentPano]
  const panoImageTextures = useTexture(currentPanoData.filename)

  return (
    <mesh
      scale={[-1, 1, 1]}
      rotation-x={MathUtils.degToRad(xRotate)}
      rotation-y={MathUtils.degToRad(yRotate)}
      rotation-z={MathUtils.degToRad(zRotate)}
      {...props}
    >
      <icosahedronGeometry args={[500, 50]} />
      <meshBasicMaterial color={0xffffff} map={panoImageTextures} side={BackSide} />
    </mesh>
  )
}

PanoImage.propTypes = {
  xRotate: PropTypes.number,
  zRotate: PropTypes.number,
  yRotate: PropTypes.number
}

PanoImage.defaultProps = {
  xRotate: 0,
  zRotate: 0,
  yRotate: 0
}
