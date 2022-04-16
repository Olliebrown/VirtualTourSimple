import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'

import PanoImage from './components/PanoImage.jsx'
import Progress from './components/Progress.jsx'

export default function VirtualTour (props) {
  return (
    <React.StrictMode>
      <Canvas camera={{ position: [0, 0, 0] }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={<Progress />}>
          <PanoImage />
        </Suspense>
      </Canvas>
    </React.StrictMode>
  )
}
