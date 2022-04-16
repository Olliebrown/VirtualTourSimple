import React from 'react'
import PropTypes from 'prop-types'

import { useLoader, useGraph } from '@react-three/fiber'
import { Euler, MathUtils } from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

export default function Arrow (props) {
  const { height, distance, direction, ...rest } = props

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
    <group rotation={new Euler(0, MathUtils.degToRad(direction), 0)} {...rest}>
      <group position={[0, height, distance]} rotation-x={Math.PI / 2.0} rotation-z={Math.PI}>
        {meshes}
      </group>
    </group>
  )
}

Arrow.propTypes = {
  height: PropTypes.number,
  distance: PropTypes.number,
  direction: PropTypes.number
}

Arrow.defaultProps = {
  height: -2.5,
  distance: 5,
  direction: 0
}
