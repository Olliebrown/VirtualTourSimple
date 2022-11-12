// Establish our custom cutout material
import './shaders/CutoutShader.js'

import React from 'react'
import PropTypes from 'prop-types'

// Global config variables
import CONFIG from './config.js'

import localDB from './state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { preloadPanoKeyState } from './state/fullTourState.js'

// eslint-disable-next-line camelcase
import { useRecoilBridgeAcrossReactRoots_UNSTABLE, useSetRecoilState } from 'recoil'

import { Fab, Tooltip } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

import PanoViewer from './components/CorePano/PanoViewer.jsx'
import SettingsDial from './components/Utility/SettingsDial.jsx'
import InfoModal from './components/HotSpots/InfoModal.jsx'
import MiniMap from './components/MiniMap/MiniMap.jsx'
import TourInfoEditor from './components/TourMaker/TourInfoEditor.jsx'

import { Canvas } from '@react-three/fiber'
import { useProgress } from '@react-three/drei'

import { setTextureAllDoneState, setTextureDoneState, setTextureFailedState } from './state/textureLoadingState.js'
import EditHotspotContentModal from './components/HotSpots/EditHotspotContentModal.jsx'

function CloseTour (params) {
  const { rootElement } = params
  const close = () => {
    rootElement.unmount()
    document.body.style.overflow = 'auto'
  }

  return (
    <Tooltip title="Close Tour">
      <Fab size="medium" aria-label="close tour" onClick={close} sx={{ position: 'absolute', top: 80, right: 10 }}>
        <CloseIcon />
      </Fab>
    </Tooltip>
  )
}

export default function VirtualTour (props) {
  const { isMobile, allowMotion, startingRoom, rootElement } = props

  // Subscribe to global setting data
  const showHUDInterface = useLiveQuery(() => localDB.settings.get('showHUDInterface'))?.value ?? true

  // Share recoil state across Canvas root
  const RecoilBridge = useRecoilBridgeAcrossReactRoots_UNSTABLE()

  // Initialize to the starting room if one was provided
  const setPreloadPanoKey = useSetRecoilState(preloadPanoKeyState)
  React.useEffect(() => {
    console.log('Setting starting room to:', startingRoom)
    setPreloadPanoKey(startingRoom)
  }, [setPreloadPanoKey, startingRoom])

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
          <PanoViewer isMobile={isMobile} allowMotion={allowMotion} startingRoom={startingRoom} />
        </RecoilBridge>
      </Canvas>

      {/* MUI overlay */}
      <CloseTour rootElement={rootElement} />
      <InfoModal />

      {showHUDInterface &&
        <React.Fragment>
          <SettingsDial allowMotion={allowMotion} />
          <MiniMap />

          {/* Editing interface */}
          {CONFIG.ENABLE_DATA_EDITING && <TourInfoEditor />}
          {CONFIG.ENABLE_DATA_EDITING && <EditHotspotContentModal />}
        </React.Fragment>}
    </React.StrictMode>
  )
}

VirtualTour.propTypes = {
  isMobile: PropTypes.bool,
  allowMotion: PropTypes.bool,
  startingRoom: PropTypes.string,
  rootElement: PropTypes.any.isRequired
}

VirtualTour.defaultProps = {
  isMobile: false,
  allowMotion: false,
  startingRoom: CONFIG.START_KEY
}
