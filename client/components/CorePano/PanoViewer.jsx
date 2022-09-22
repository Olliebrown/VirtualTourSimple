import CONFIG from '../../config.js'

import React, { Suspense, useEffect, useState } from 'react'
import { DefaultLoadingManager, Vector3 } from 'three'

import { OrbitControls, DeviceOrientationControls } from '@react-three/drei'
import { useHotkeys } from 'react-hotkeys-hook'

import useStore from '../../state/useStore.js'

import PanoImage from './PanoImage.jsx'
import Progress from '../Utility/Progress.jsx'

import HEATING_PLANT_IMAGE_LIST from '../heatingPlantImages.js'
import PanoGrid from './PanoGrid.jsx'
import { useThree } from '@react-three/fiber'

export default function PanoViewer (props) {
  const { isMobile, allowMotion } = props

  // Access to the global state store
  const {
    currentPano, increasePanoIndex, decreasePanoIndex,
    loadingBusy, loadingCompleted, loadingFailed, setCurrentCameraYaw,
    enableMotionControls, invertOrbitControls, toggleInvertOrbitControls
  } = useStore(state => state)

  useEffect(() => {
    if (isMobile) {
      toggleInvertOrbitControls()
    }
  }, [])

  // Setup monitoring of texture loading state
  useEffect(() => {
    DefaultLoadingManager.onStart = loadingBusy
    DefaultLoadingManager.onError = loadingFailed
    DefaultLoadingManager.onLoad = () => { loadingCompleted('*') }
    DefaultLoadingManager.onProgress = (url, number, total) => {
      if (number === total) {
        loadingCompleted(url)
      } else {
        loadingBusy(url)
      }
    }
  }, [loadingBusy, loadingCompleted, loadingFailed])

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

  const getThreeJS = useThree(state => state.get)
  const orbitChangeEvent = () => {
    const camera = getThreeJS().camera
    const camAngles = camera.getWorldDirection(new Vector3())
    setCurrentCameraYaw(Math.atan2(camAngles.z, camAngles.x) + Math.PI)
  }

  return (
    <React.StrictMode>
      <color attach="background" args={['red']} />
      <DeviceOrientationControls
        enabled={allowMotion && enableMotionControls}
        enablePan={false}
        enableZoom={false}
        onChange={orbitChangeEvent}
      />
      <OrbitControls
        enabled={!allowMotion || !enableMotionControls}
        enablePan={false}
        enableZoom={false}
        reverseOrbit={invertOrbitControls}
        onChange={orbitChangeEvent}
      />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={<Progress />}>
        <PanoImage xRotate={xRotate} yRotate={yRotate} zRotate={zRotate} />
        {CONFIG.ENABLE_ALIGNMENT_GRID &&
          <PanoGrid />}
      </Suspense>
    </React.StrictMode>
  )
}
