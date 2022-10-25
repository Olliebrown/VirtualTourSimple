import CONFIG from '../../config.js'

import React, { Suspense, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

import localDB, { updateSetting } from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { setTextureLoadingState, setTextureFailedState, setTextureAllDoneState, currentPanoKeyState, currentCameraYawState } from '../../state/globalState.js'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { DefaultLoadingManager, Vector3 } from 'three'

import { OrbitControls, DeviceOrientationControls } from '@react-three/drei'
import { useHotkeys } from 'react-hotkeys-hook'

import PanoImage from './PanoImage.jsx'
import Progress from '../Utility/Progress.jsx'

import PanoGrid from './PanoGrid.jsx'
import { useThree } from '@react-three/fiber'

export default function PanoViewer (props) {
  const { isMobile, allowMotion } = props

  // Subscribe to changes in global state
  const enableMotionControls = useLiveQuery(() => localDB.settings.get('enableMotionControls'))?.value || false
  const invertOrbitControls = useLiveQuery(() => localDB.settings.get('invertOrbitControls'))?.value || false

  // Subscribe to pano DB changes
  const currentPanoKey = useRecoilValue(currentPanoKeyState)
  const currentPanoData = useLiveQuery(() => localDB.panoInfoState.get(currentPanoKey), [currentPanoKey], null)

  // Subscribe to global state changes and global state mutator
  const setTextureLoading = useSetRecoilState(setTextureLoadingState)
  const setTextureAllDone = useSetRecoilState(setTextureAllDoneState)
  const setTextureFailed = useSetRecoilState(setTextureFailedState)

  // Update camera yaw in global state
  const setCurrentCameraYaw = useSetRecoilState(currentCameraYawState)

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => { updateSetting('invertOrbitControls', isMobile) }, [])
  /* eslint-enable react-hooks/exhaustive-deps */

  // Setup monitoring of texture loading state
  useEffect(() => {
    DefaultLoadingManager.onStart = setTextureLoading
    DefaultLoadingManager.onError = setTextureFailed
    DefaultLoadingManager.onLoad = setTextureAllDone
    DefaultLoadingManager.onProgress = (url, loaded, total) => {
      if (loaded === total) {
        setTextureAllDone()
      } else {
        setTextureLoading(url)
      }
    }
  }, [setTextureAllDone, setTextureFailed, setTextureLoading])

  // Sphere rotation state
  const [xRotate, setXRotate] = useState(currentPanoData?.alignment[0])
  const [yRotate, setYRotate] = useState(currentPanoData?.alignment[1])
  const [zRotate, setZRotate] = useState(currentPanoData?.alignment[2])

  // Ensure rotate values are synced with the loaded pano data
  useEffect(() => {
    setXRotate(currentPanoData?.alignment[0])
    setYRotate(currentPanoData?.alignment[1])
    setZRotate(currentPanoData?.alignment[2])
  }, [currentPanoData?.alignment])

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

PanoViewer.propTypes = {
  isMobile: PropTypes.bool,
  allowMotion: PropTypes.bool
}

PanoViewer.defaultProps = {
  isMobile: false,
  allowMotion: false
}
