import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'

import { OrbitControls } from '@react-three/drei'
import { useHotkeys } from 'react-hotkeys-hook'

import Arrow from './components/Arrow.jsx'
import PanoImage from './components/PanoImage.jsx'
import Progress from './components/Progress.jsx'

export default function VirtualTour (props) {
  // Sphere rotation state
  const [zRotate, setZRotate] = useState(-3.5)
  const [yRotate, setYRotate] = useState(15.5)

  // Setup some hotkeys to adjust the sphere
  useHotkeys('ctrl+shift+]', () => { setZRotate(zRotate - 0.5) }, {}, [zRotate])
  useHotkeys('ctrl+shift+[', () => { setZRotate(zRotate + 0.5) }, {}, [zRotate])
  useHotkeys('ctrl+]', () => { setYRotate(yRotate - 0.5) }, {}, [yRotate])
  useHotkeys('ctrl+[', () => { setYRotate(yRotate + 0.5) }, {}, [yRotate])

  return (
    <React.StrictMode>
      <Canvas camera={{ position: [0, 0, 0.1] }}>
        <OrbitControls enablePan={false} enableZoom={false} />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={<Progress />}>
          <Arrow direction={45} />
          <Arrow direction={270} />
          <PanoImage zRotate={zRotate} yRotate={yRotate} />
        </Suspense>
      </Canvas>
    </React.StrictMode>
  )
}
