// Establish our custom cutout material
import './shaders/CutoutShader.js'

import React from 'react'
import PropTypes from 'prop-types'

// Global config variables
import CONFIG from './config.js'

// eslint-disable-next-line camelcase
import { useRecoilBridgeAcrossReactRoots_UNSTABLE, useSetRecoilState } from 'recoil'
import { CssBaseline } from '@mui/material'

import PanoViewer from './components/CorePano/PanoViewer.jsx'
import SettingsDial from './components/Utility/SettingsDial.jsx'
import InfoModal from './components/Hotspots/InfoModal.jsx'
import MiniMap from './components/MiniMap/MiniMap.jsx'
import TourInfoEditor from './components/TourMaker/TourInfoEditor.jsx'

import { Canvas } from '@react-three/fiber'
import { useProgress } from '@react-three/drei'

import { setTextureAllDoneState, setTextureDoneState, setTextureFailedState } from './state/textureLoadingState.js'
import EditHotspotContentModal from './components/Hotspots/EditHotspotContentModal.jsx'

export default function VirtualTour (props) {
  const { isMobile, allowMotion } = props

  // Share recoil state across Canvas root
  const RecoilBridge = useRecoilBridgeAcrossReactRoots_UNSTABLE()

  // Track texture state
  const setTextureDone = useSetRecoilState(setTextureDoneState)
  const setTextureAllDone = useSetRecoilState(setTextureAllDoneState)
  const setTextureFailed = useSetRecoilState(setTextureFailedState)

  // Use drei progress hook to update texture state
  const { loadedItem, loadingErrors, loadingProgress } = useProgress((state) => ({
    loadedItem: state.item,
    loadingErrors: state.errors,
    loadingProgress: state.progress
  }))

  React.useEffect(() => {
    // Record any completed textures
    if (loadedItem.toLowerCase().includes('.ktx2')) {
      setTextureDone(loadedItem)
    }

    // Record any failed textures
    if (Array.isArray(loadingErrors)) {
      loadingErrors
        .filter(item => item.toLowerCase().includes('.ktx2'))
        .forEach(setTextureFailed)
    }

    // Record when everything is done
    if (loadingProgress === 100) { setTextureAllDone() }
  }, [loadedItem, loadingErrors, loadingProgress, setTextureAllDone, setTextureDone, setTextureFailed])

  return (
    <React.StrictMode>
      {/* Main three.js fiber canvas */}
      <Canvas linear camera={{ position: [0, 0, 0.1] }}>
        <RecoilBridge>
          {/* Panorama viewer/tour */}
          <PanoViewer isMobile={isMobile} allowMotion={allowMotion} />
        </RecoilBridge>
      </Canvas>

      {/* MUI overlay */}
      <CssBaseline />
      <SettingsDial allowMotion={allowMotion} />
      <MiniMap />

      {/* Editing interface */}
      {CONFIG.ENABLE_DATA_EDITING && <TourInfoEditor />}
      {CONFIG.ENABLE_DATA_EDITING && <EditHotspotContentModal />}

      <InfoModal />
    </React.StrictMode>
  )
}

VirtualTour.propTypes = {
  isMobile: PropTypes.bool,
  allowMotion: PropTypes.bool
}

VirtualTour.defaultProps = {
  isMobile: false,
  allowMotion: false
}
