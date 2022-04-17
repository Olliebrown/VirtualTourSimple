import React, { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'

import { OrbitControls } from '@react-three/drei'
import { useHotkeys } from 'react-hotkeys-hook'
import useStore from './state/useStore.js'

import Arrow from './components/Arrow.jsx'
import PanoImage from './components/PanoImage.jsx'
import Progress from './components/Progress.jsx'

import HEATING_PLANT_IMAGE_LIST from './components/heatingPlantImages.js'

export default function VirtualTour (props) {
  // Current pano state
  const { currentPano, increasePanoIndex, decreasePanoIndex } = useStore(state => state)

  // Load the pano image data
  const currentPanoData = HEATING_PLANT_IMAGE_LIST[currentPano]

  // Sphere rotation state
  const [zRotate, setZRotate] = useState(currentPanoData.zRotate)
  const [yRotate, setYRotate] = useState(currentPanoData.yRotate)

  // Ensure rotate values are synced with the loaded pano data
  useEffect(() => {
    setZRotate(currentPanoData.zRotate)
    setYRotate(currentPanoData.yRotate)
  }, [currentPanoData])

  // Setup some hotkeys to adjust the sphere
  useHotkeys('ctrl+shift+]', () => { setZRotate(zRotate - 0.5) }, {}, [zRotate])
  useHotkeys('ctrl+shift+[', () => { setZRotate(zRotate + 0.5) }, {}, [zRotate])
  useHotkeys('ctrl+]', () => { setYRotate(yRotate - 0.5) }, {}, [yRotate])
  useHotkeys('ctrl+[', () => { setYRotate(yRotate + 0.5) }, {}, [yRotate])

  // Hotkeys to change current pano image
  useHotkeys('ctrl+.', () => { increasePanoIndex() }, {}, [increasePanoIndex])
  useHotkeys('ctrl+,', () => { decreasePanoIndex() }, {}, [decreasePanoIndex])

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
