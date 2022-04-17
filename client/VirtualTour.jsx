import CONFIG from './config.js'

import React, { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'

import { OrbitControls } from '@react-three/drei'
import { useHotkeys } from 'react-hotkeys-hook'
import useStore from './state/useStore.js'

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
  /* eslint-disable react-hooks/rules-of-hooks */
  if (CONFIG.ENABLE_ROTATE_HOTKEYS) {
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

    useHotkeys('ctrl+/', () => { console.log(`Settings: ${currentPano}, <${xRotate}, ${yRotate}, ${zRotate}>`) }, {}, [xRotate, yRotate, zRotate])
  }

  // Hotkeys to change current pano image
  if (CONFIG.ENABLE_INDEX_ADVANCING_HOTKEYS) {
    useHotkeys('ctrl+.', () => { increasePanoIndex() }, {}, [increasePanoIndex])
    useHotkeys('ctrl+,', () => { decreasePanoIndex() }, {}, [decreasePanoIndex])
  }
  /* eslint-enable react-hooks/rules-of-hooks */

  return (
    <React.StrictMode>
      <Canvas camera={{ position: [0, 0, 0.1] }}>
        <OrbitControls enablePan={false} enableZoom={false} />
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={<Progress />}>
          <PanoImage xRotate={xRotate} yRotate={yRotate} zRotate={zRotate} />
          {CONFIG.ENABLE_ALIGNMENT_GRID &&
            <PanoGrid />}
        </Suspense>
      </Canvas>
    </React.StrictMode>
  )
}
