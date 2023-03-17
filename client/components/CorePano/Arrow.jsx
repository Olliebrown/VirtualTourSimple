import React from 'react'
import PropTypes from 'prop-types'

import CONFIG from '../../config.js'

import { currentPanoKeyState } from '../../state/fullTourState.js'
import { setTextureLoadingState, textureStatusState } from '../../state/textureLoadingState.js'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { useLoader, useGraph } from '@react-three/fiber'
import { onKTX2Load, useKTX2WithOnLoad } from '../Utility/useKTX2WithOnLoad.js'
import { MathUtils } from 'three'

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

import { useSpring, animated } from '@react-spring/three'

// Various colors for the texture loading state
const LOADING_COLOR = 0x777777
const LOADED_COLOR = 0x156289
const FAILED_COLOR = 0x883333

export default function Arrow (props) {
  // Destructure props
  const { height, distance, direction, destination, ...rest } = props

  const setCurrentPanoKey = useSetRecoilState(currentPanoKeyState)

  // Global texture loader status and pano image state
  const loadingStatus = useRecoilValue(textureStatusState)
  const setTextureLoading = useSetRecoilState(setTextureLoadingState)
  const imageLoadingStatus = loadingStatus[`${CONFIG().PANO_IMAGE_PATH}/${destination}_Left.ktx2`]

  // Create a valid texture filename
  const textureFile = (
    destination !== ''
      ? `${CONFIG().PANO_IMAGE_PATH}/${destination}_Left.ktx2`
      : `${CONFIG().PANO_IMAGE_PATH}/1S01_22_Left.ktx2`
  )

  // Start loading (harmless if already loaded)
  setTextureLoading(textureFile)
  useKTX2WithOnLoad(textureFile, onKTX2Load)

  // Track hovering state
  const [hovering, setHovering] = React.useState(false)

  // Click callback function
  const onClick = () => {
    if (destination) {
      setCurrentPanoKey(destination)
    }
  }

  // Animated values
  const springs = useSpring({
    scale: hovering ? 1 : 0.75,
    opacity: hovering ? 1.0 : 0.333
  })

  // Load the arrow geometry and clone our own instance
  const loadedObj = useLoader(OBJLoader, `${CONFIG().GEOMETRY_FILE_PATH}/arrow.obj`)
  const { nodes } = useGraph(loadedObj.clone())

  let color = LOADING_COLOR
  switch (imageLoadingStatus) {
    case 'DONE':
      color = LOADED_COLOR
      break
    case 'FAILED':
      color = FAILED_COLOR
      break
  }

  // Build unique sub-meshes for all the loaded objects
  const meshes = Object.keys(nodes).map((meshName) => (
    <animated.mesh scale={springs.scale} key={`${meshName}-mesh`} geometry={nodes[meshName].geometry}>
      <meshPhongMaterial color={color} flatShading />
    </animated.mesh>
  ))

  // Pack in groups to position in the scene
  return (
    <group
      rotation-y={MathUtils.degToRad(direction)}
      {...rest}
      onClick={onClick}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
    >
      <group position={[0, height, distance]} rotation-x={Math.PI / 2.0} rotation-z={Math.PI}>
        {meshes}
      </group>
    </group>
  )
}

Arrow.propTypes = {
  height: PropTypes.number,
  distance: PropTypes.number,
  direction: PropTypes.number,
  destination: PropTypes.string
}

Arrow.defaultProps = {
  height: -2.5,
  distance: 5,
  direction: 0,
  destination: ''
}
