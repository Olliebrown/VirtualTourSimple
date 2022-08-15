import React from 'react'
import PropTypes from 'prop-types'

import { useLoader, useGraph } from '@react-three/fiber'
import { MathUtils } from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

// Various colors for the texture loading state
const LOADED_COLOR = 0xFF0000

export default function InfoHotSpot (props) {
  // Destructure props
  const { name, href, longitude, latitude, radius, scale, ...rest } = props

  // Click callback function
  const onClick = () => {
    console.log(`Hot-spot "${name}" clicked`)
  }

  // Load the arrow geometry and clone our own instance
  const loadedObj = useLoader(OBJLoader, 'geom/icoSphere.obj')
  const { nodes } = useGraph(loadedObj.clone())

  // Build unique sub-meshes for all the loaded objects
  const color = LOADED_COLOR
  const meshes = Object.keys(nodes).map((meshName) => (
    <mesh key={`${meshName}-mesh`} geometry={nodes[meshName].geometry}>
      <meshPhongMaterial color={color} flatShading />
    </mesh>
  ))

  // Pack in groups to position in the scene
  return (
    <group
      rotation-y={MathUtils.degToRad(longitude)}
      {...rest}
      onClick={onClick}
    >
      <group rotation-x={MathUtils.degToRad(latitude)}>
        <group
          position={[0, 0, -radius]}
          scale={[scale, scale, scale]}
        >
          {meshes}
        </group>
      </group>
    </group>
  )
}

InfoHotSpot.propTypes = {
  name: PropTypes.string,
  href: PropTypes.string,

  longitude: PropTypes.number,
  latitude: PropTypes.number,
  radius: PropTypes.number,
  scale: PropTypes.number
}

InfoHotSpot.defaultProps = {
  href: '',
  name: 'N/A',

  longitude: 0,
  latitude: 0,
  radius: 5,
  scale: 0.5
}
