import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'

import { OrbitControls } from '@react-three/drei'

import Arrow from './components/Arrow.jsx'
import PanoImage from './components/PanoImage.jsx'
import Progress from './components/Progress.jsx'

export default function VirtualTour (props) {
  return (
    <React.StrictMode>
      <Canvas camera={{ position: [0, 0, 0.1] }}>
        <OrbitControls enablePan={false} enableZoom={false} />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={<Progress />}>
          <Arrow direction={45} />
          <Arrow direction={270} />
          <PanoImage />
        </Suspense>
      </Canvas>
    </React.StrictMode>
  )
}
