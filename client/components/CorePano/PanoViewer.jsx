import CONFIG from '../../config.js'

import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import localDB, { updateSetting } from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { currentPanoKeyState, preloadPanoKeyState, currentPanoDataState, enabledPanoRoomsState, enabledHotSpotsState } from '../../state/fullTourState'
import { currentCameraYawState } from '../../state/globalState.js'

import { useRecoilValue, useSetRecoilState } from 'recoil'

import { Vector3 } from 'three'
import { useThree } from '@react-three/fiber'
import { OrbitControls, DeviceOrientationControls } from '@react-three/drei'

import { useHotkeys } from 'react-hotkeys-hook'

import PanoImage from './PanoImage.jsx'
import PanoTextureLoader from './PanoTextureLoader.jsx'
import PanoGrid from './PanoGrid.jsx'
import PanoExtras from './PanoExtras.jsx'

export default function PanoViewer (props) {
  const { isMobile, allowMotion } = props

  // Subscribe to changes in global state
  const showGrid = useLiveQuery(() => localDB.settings.get('showGrid'))?.value ?? true
  const showExits = useLiveQuery(() => localDB.settings.get('showExits'))?.value ?? true
  const showHUDInterface = useLiveQuery(() => localDB.settings.get('showHUDInterface'))?.value ?? true

  const enableMotionControls = useLiveQuery(() => localDB.settings.get('enableMotionControls'))?.value ?? false
  const invertOrbitControls = useLiveQuery(() => localDB.settings.get('invertOrbitControls'))?.value ?? false

  // Subscribe to pano DB changes
  const currentPanoKey = useRecoilValue(currentPanoKeyState)
  const preloadPanoKey = useRecoilValue(preloadPanoKeyState)
  const currentPanoData = useRecoilValue(currentPanoDataState)

  // Update camera yaw in global state
  const setCurrentCameraYaw = useSetRecoilState(currentCameraYawState)

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => { updateSetting('invertOrbitControls', isMobile) }, [])
  /* eslint-enable react-hooks/exhaustive-deps */

  // Create filtered arrays of exits and hotspots
  const enabledRooms = useRecoilValue(enabledPanoRoomsState)
  const filteredExits = enabledRooms.length > 0
    ? currentPanoData?.exits?.filter(exit => enabledRooms.includes(exit.key))
    : currentPanoData?.exits

  const enabledHotSpots = useRecoilValue(enabledHotSpotsState)
  const filteredHotSpots = enabledHotSpots.length > 0
    ? currentPanoData?.hotspots?.filter(hotspot => enabledHotSpots.includes(hotspot.id))
    : currentPanoData?.hotspots

  // Sphere rotation state
  const [xRotate, setXRotate] = useState(currentPanoData?.alignment?.[0] || 0)
  const [yRotate, setYRotate] = useState(currentPanoData?.alignment?.[1] || 0)
  const [zRotate, setZRotate] = useState(currentPanoData?.alignment?.[2] || 0)

  // Ensure rotate values are synced with the loaded pano data
  useEffect(() => {
    setXRotate(currentPanoData?.alignment?.[0] || 0)
    setYRotate(currentPanoData?.alignment?.[1] || 0)
    setZRotate(currentPanoData?.alignment?.[2] || 0)
  }, [currentPanoData?.alignment])

  // Setup some hotkeys to adjust the sphere offset rotation
  /* eslint-disable react-hooks/rules-of-hooks */
  if (CONFIG.ENABLE_ROTATE_HOTKEYS) {
    useHotkeys('ctrl+G', () => { updateSetting('showGrid', !showGrid) }, {}, [showGrid])
    useHotkeys('ctrl+H', () => { updateSetting('showExits', !showExits) }, {}, [showExits])
    useHotkeys('ctrl+I', () => { updateSetting('showHUDInterface', !showHUDInterface) }, {}, [showHUDInterface])

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

    useHotkeys('ctrl+/', () => { console.log(`Settings: ${currentPanoKey}, <${xRotate}, ${yRotate}, ${zRotate}>`) }, {}, [xRotate, yRotate, zRotate])
  }
  /* eslint-enable react-hooks/rules-of-hooks */

  const getThreeJS = useThree(state => state.get)
  const orbitChangeEvent = () => {
    const camera = getThreeJS().camera
    const camAngles = camera.getWorldDirection(new Vector3())
    setCurrentCameraYaw(Math.atan2(camAngles.z, camAngles.x) + Math.PI)
  }

  return (
    <>
      {/* <color attach="background" args={['red']} /> */}
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

      <React.Suspense fallback={null}>
        {!!preloadPanoKey && <PanoTextureLoader />}
      </React.Suspense>

      {!!currentPanoKey && showExits && <PanoExtras exits={filteredExits} hotSpots={filteredHotSpots} panoKey={currentPanoKey} />}
      {!!currentPanoKey && <PanoImage xRotate={xRotate} yRotate={yRotate} zRotate={zRotate} exits={filteredExits} />}

      {CONFIG.ENABLE_ALIGNMENT_GRID && showGrid && <PanoGrid />}
    </>
  )
}

PanoViewer.propTypes = {
  isMobile: PropTypes.bool,
  allowMotion: PropTypes.bool
}

PanoViewer.defaultProps = {
  isMobile: false,
  allowMotion: false
}
