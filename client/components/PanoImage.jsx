import React from 'react'
import { useTexture } from '@react-three/drei'
import { BackSide } from 'three'

import HEATING_PLANT_IMAGE_LIST from './heatingPlantImages.js'

export default function PanoImage (props) {
  // Load the pano image
  const panoImageTextures = useTexture(HEATING_PLANT_IMAGE_LIST)

  return (
    <mesh {...props} scale={[-1, 1, 1]}>
      <icosahedronGeometry args={[500, 50]} />
      <meshBasicMaterial color={0xffffff} map={panoImageTextures.image01} side={BackSide} />
    </mesh>
  )
}
