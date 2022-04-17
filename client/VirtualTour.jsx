import React, { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'

import { OrbitControls } from '@react-three/drei'
import { useHotkeys } from 'react-hotkeys-hook'
import useStore from './state/useStore.js'

import Arrow from './components/Arrow.jsx'
import PanoImage from './components/PanoImage.jsx'
import Progress from './components/Progress.jsx'

import HEATING_PLANT_IMAGE_LIST from './components/heatingPlantImages.js'
import PanoGrid from './components/PanoGrid.jsx'

export default function VirtualTour (props) {
  // Current pano state
  const { currentPano, increasePanoIndex, decreasePanoIndex } = useStore(state => state)

  // Load the pano image data
  const currentPanoData = HEATING_PLANT_IMAGE_LIST[currentPano]

  // Sphere rotation state
  const [xRotate, setXRotate] = useState(currentPanoData.xRotate)
  const [yRotate, setYRotate] = useState(currentPanoData.yRotate)
  const [zRotate, setZRotate] = useState(currentPanoData.zRotate)

  // Ensure rotate values are synced with the loaded pano data
  useEffect(() => {
    setXRotate(currentPanoData.xRotate)
    setYRotate(currentPanoData.yRotate)
    setZRotate(currentPanoData.zRotate)
  }, [currentPanoData])

  // Setup some hotkeys to adjust the sphere offset rotation
  useHotkeys('ctrl+num_divide', () => { setXRotate(xRotate - 0.5) }, {}, [xRotate])
  useHotkeys('ctrl+num_multiply', () => { setXRotate(xRotate + 0.5) }, {}, [xRotate])
  useHotkeys('ctrl+shift+num_divide', () => { setXRotate(xRotate - 0.1) }, {}, [xRotate])
  useHotkeys('ctrl+shift+num_multiply', () => { setXRotate(xRotate + 0.1) }, {}, [xRotate])
  useHotkeys('ctrl+shift+alt+num_divide', () => { setXRotate(xRotate - 0.02) }, {}, [xRotate])
  useHotkeys('ctrl+shift+alt+num_multiply', () => { setXRotate(xRotate + 0.02) }, {}, [xRotate])

  useHotkeys('ctrl+]', () => { setYRotate(yRotate - 0.5) }, {}, [yRotate])
  useHotkeys('ctrl+[', () => { setYRotate(yRotate + 0.5) }, {}, [yRotate])
  useHotkeys('ctrl+shift+]', () => { setYRotate(yRotate - 0.1) }, {}, [yRotate])
  useHotkeys('ctrl+shift+[', () => { setYRotate(yRotate + 0.1) }, {}, [yRotate])
  useHotkeys('ctrl+shift+alt+]', () => { setYRotate(yRotate - 0.02) }, {}, [yRotate])
  useHotkeys('ctrl+shift+alt+[', () => { setYRotate(yRotate + 0.02) }, {}, [yRotate])

  useHotkeys('ctrl+;', () => { setZRotate(zRotate - 0.5) }, {}, [zRotate])
  useHotkeys('ctrl+\'', () => { setZRotate(zRotate + 0.5) }, {}, [zRotate])
  useHotkeys('ctrl+shift+;', () => { setZRotate(zRotate - 0.1) }, {}, [zRotate])
  useHotkeys('ctrl+shift+\'', () => { setZRotate(zRotate + 0.1) }, {}, [zRotate])
  useHotkeys('ctrl+shift+alt+;', () => { setZRotate(zRotate - 0.02) }, {}, [zRotate])
  useHotkeys('ctrl+shift+alt+\'', () => { setZRotate(zRotate + 0.02) }, {}, [zRotate])

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
          <PanoImage xRotate={xRotate} zRotate={zRotate} yRotate={yRotate} />
          <PanoGrid />
        </Suspense>
      </Canvas>
    </React.StrictMode>
  )
}
