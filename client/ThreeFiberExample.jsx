import React from 'react'
import { Canvas } from '@react-three/fiber'

import Box from './components/Box.jsx'

export default function ThreeFiberExample (props) {
  return (
    <React.StrictMode>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
      </Canvas>
    </React.StrictMode>
  )
}
