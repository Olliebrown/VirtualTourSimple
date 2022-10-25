import React, { useEffect } from 'react'
import PropTypes from 'prop-types'

import { currentPanoKeyState, textureStatusState } from '../../state/globalState.js'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { useLoader, useGraph } from '@react-three/fiber'
import { MathUtils, TextureLoader } from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

import { useSpring, animated } from '@react-spring/three'
import CONFIG from '../../config.js'

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

  // Track hovering state
  const [hovering, setHovering] = React.useState(false)

  // Extract status for this specific image
  const imageLoadingStatus = loadingStatus[`${CONFIG.PANO_IMAGE_PATH}/${destination}_Left.ktx2`]

  // Lookup the texture needed for the destination and get it pre-loading
  useEffect(() => {
    useLoader.preload(TextureLoader, `${CONFIG.PANO_IMAGE_PATH}/${destination}_Left.ktx2`)
  }, [destination])

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
  const loadedObj = useLoader(OBJLoader, 'geom/arrow.obj')
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
