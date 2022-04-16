import React from 'react'

import { useTexture } from '@react-three/drei'
import { BackSide, MathUtils } from 'three'

import HEATING_PLANT_IMAGE_LIST from './heatingPlantImages.js'

export default function PanoImage (props) {
  const { zRotate, yRotate } = props

  // Load the pano image
  const panoImageTextures = useTexture(HEATING_PLANT_IMAGE_LIST.image01.filename)

  return (
    <mesh {...props} scale={[-1, 1, 1]} rotation-y={MathUtils.degToRad(yRotate)} rotation-z={MathUtils.degToRad(zRotate)}>
      <icosahedronGeometry args={[500, 50]} />
      <meshBasicMaterial color={0xffffff} map={panoImageTextures} side={BackSide} />
    </mesh>
  )
}
