import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'

import PanoImage from './components/PanoImage.jsx'

export default function VirtualTour (props) {
  return (
    <React.StrictMode>
      <Canvas>
        <Suspense fallback={null}>
          <PanoImage />
        </Suspense>
      </Canvas>
    </React.StrictMode>
  )
}
