import React from 'react'
import PropTypes from 'prop-types'

import { useLoader, useGraph } from '@react-three/fiber'
import { MathUtils } from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

import useStore from '../state/useStore.js'

export default function Arrow (props) {
  // Destructure props
  const { height, distance, direction, destination, ...rest } = props

  // Global pano image state
  const { setPano } = useStore(state => state)

  // Click callback function
  const onClick = () => {
    console.log('Clicked on arrow for "' + destination + '"')
    if (destination) { setPano(destination) }
  }

  // Load the arrow geometry and clone our own instance
  const loadedObj = useLoader(OBJLoader, 'geom/arrow.obj')
  const { nodes } = useGraph(loadedObj.clone())

  // Build unique sub-meshes for all the loaded objects
  const meshes = Object.keys(nodes).map((meshName) => (
    <mesh key={`${meshName}-mesh`} geometry={nodes[meshName].geometry}>
      <meshPhongMaterial color={0x156289} emissive={0x072534} flatShading />
    </mesh>
  ))

  // Pack in groups to position in the scene
  return (
    <group rotation-y={MathUtils.degToRad(direction)} {...rest} onClick={onClick}>
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
