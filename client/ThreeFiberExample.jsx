import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

import Box from './components/Box.jsx'

export default function ThreeFiberExample (props) {
  return (
    <React.StrictMode>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <OrbitControls enablePan={false} enableDamping enableZoom enabled />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
      </Canvas>
    </React.StrictMode>
  )
}
