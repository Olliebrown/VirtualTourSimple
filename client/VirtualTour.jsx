// Establish our custom cutout material
import './shaders/CutoutShader.js'

import React from 'react'
import PropTypes from 'prop-types'

// Global config variables
import CONFIG from './config.js'

import localDB from './state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { preloadPanoKeyState, enabledHotSpotsState, enabledPanoRoomsState, disablePriorityState } from './state/fullTourState.js'
import { loadingCurtainState, mediaSkipState, mediaPauseState, mediaRewindState, panoMediaPlayingState } from './state/globalState.js'

// eslint-disable-next-line camelcase
import { useRecoilBridgeAcrossReactRoots_UNSTABLE, useSetRecoilState, useRecoilState, useRecoilValue } from 'recoil'

import { Fade, Fab, Tooltip, Button, ButtonGroup } from '@mui/material'
import {
  Close as CloseIcon,
  FastForward as FastForwardIcon,
  Pause as PauseIcon,
  PlayArrow as PlayIcon,
  SkipPrevious as RewindIcon
} from '@mui/icons-material'

import PanoViewer from './components/CorePano/PanoViewer.jsx'
import SettingsDial from './components/Utility/SettingsDial.jsx'
import InfoModal from './components/HotSpots/InfoModal.jsx'
import MiniMap from './components/MiniMap/MiniMap.jsx'
import TourInfoEditor from './components/TourMaker/TourInfoEditor.jsx'
import RoomAudioPlayer from './components/HotSpots/RoomAudioPlayer.jsx'
import HotSpotTooltip from './components/HotSpots/HotSpotTooltip.jsx'

import { Canvas } from '@react-three/fiber'
import { useProgress } from '@react-three/drei'
import { Vector3, Spherical } from 'three'

import { setTextureAllDoneState, setTextureDoneState, setTextureFailedState } from './state/textureLoadingState.js'
import EditHotspotContentModal from './components/HotSpots/EditHotspotContentModal.jsx'

// Button to skip playing media
function SkipButton (props) {
  const panoMediaPlaying = useRecoilValue(panoMediaPlayingState)
  const setMediaRewind = useSetRecoilState(mediaRewindState)
  const [mediaPaused, setMediaPaused] = useRecoilState(mediaPauseState)
  const setMediaSkip = useSetRecoilState(mediaSkipState)

  return (
    <Fade in={panoMediaPlaying}>
      <ButtonGroup
        size="large"
        variant="contained"
        sx={{ position: 'absolute', bottom: 24, right: 200 }}
      >
        <Tooltip title="Restart Video">
          <Button onClick={() => setMediaRewind(true)}>
            <RewindIcon />
          </Button>
        </Tooltip>

        <Tooltip title={mediaPaused ? 'Resume Video' : 'Pause Video'}>
          <Button onClick={() => setMediaPaused(!mediaPaused)}>
            {mediaPaused ? <PlayIcon/> : <PauseIcon />}
          </Button>
        </Tooltip>

        <Tooltip title="Skip to End of Video">
          <Button onClick={() => setMediaSkip(true)}>
            <FastForwardIcon />
          </Button>
        </Tooltip>
      </ButtonGroup>
    </Fade>
  )
}

// Button to close the tour
function CloseTour (params) {
  const { reactRoot, rootElement } = params
  const setLoadingCurtain = useSetRecoilState(loadingCurtainState)

  const close = () => {
    setLoadingCurtain({ text: '', open: false })
    setTimeout(() => {
      rootElement.style.width = '0%'
      rootElement.style.height = '0%'
      document.body.style.overflow = 'auto'
      reactRoot.unmount()
    }, CONFIG.FADE_TIMEOUT)
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
  const { isMobile, allowMotion, startingRoom, initialYaw, enableClose, disablePriority, enabledRooms, enabledHotSpots, reactRoot, rootElement } = props

  // Subscribe to global setting data
  const showHUDInterface = useLiveQuery(() => localDB.settings.get('showHUDInterface'))?.value ?? true

  // Share recoil state across Canvas root
  const RecoilBridge = useRecoilBridgeAcrossReactRoots_UNSTABLE()

  const [fadeInTimeout, setFadeInTimeout] = React.useState(false)
  React.useEffect(() => {
    setTimeout(() => setFadeInTimeout(true), CONFIG.FADE_TIMEOUT)
  }, [])

  // On the first render, initialize some state
  const setDisablePriority = useSetRecoilState(disablePriorityState)
  const setLoadingCurtain = useSetRecoilState(loadingCurtainState)
  React.useEffect(() => {
    setDisablePriority(disablePriority)
    setLoadingCurtain({ open: false, text: 'Loading' })
  }, [setLoadingCurtain, disablePriority, setDisablePriority])

  // Initialize to the starting room if one was provided
  const setPreloadPanoKey = useSetRecoilState(preloadPanoKeyState)
  React.useEffect(() => {
    console.log('Setting starting room to:', startingRoom)
    setPreloadPanoKey(startingRoom)
  }, [setPreloadPanoKey, startingRoom])

  // Initialize the enabled rooms and hotspots if provided
  const setEnabledPanoRooms = useSetRecoilState(enabledPanoRoomsState)
  const setEnabledHotSpots = useSetRecoilState(enabledHotSpotsState)
  React.useEffect(() => {
    setEnabledPanoRooms(enabledRooms)
    setEnabledHotSpots(enabledHotSpots)
  }, [enabledHotSpots, enabledRooms, setEnabledHotSpots, setEnabledPanoRooms])

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

  // Calculate initial camera position
  const startPosition = new Vector3().setFromSpherical(
    new Spherical(0.1, Math.PI / 2, initialYaw / 180 * Math.PI)
  )

  return (
    <React.StrictMode>
      {/* Main three.js fiber canvas */}
      <Canvas linear camera={{ position: startPosition }}>
        <RecoilBridge>
          {/* Panorama viewer/tour */}
          {fadeInTimeout &&
            <PanoViewer isMobile={isMobile} allowMotion={allowMotion} startingRoom={startingRoom} />}
        </RecoilBridge>
      </Canvas>

      {/* MUI overlay */}
      {fadeInTimeout &&
        <React.Fragment>
          {enableClose && <CloseTour rootElement={rootElement} reactRoot={reactRoot} />}
          <InfoModal />
          <HotSpotTooltip />
          <SkipButton />

          {showHUDInterface &&
            <React.Fragment>
              <SettingsDial allowMotion={allowMotion} />
              <MiniMap />
              <RoomAudioPlayer />

              {/* Editing interface */}
              {CONFIG.ENABLE_DATA_EDITING && <TourInfoEditor />}
              {CONFIG.ENABLE_DATA_EDITING && <EditHotspotContentModal />}
            </React.Fragment>}
        </React.Fragment>}

    </React.StrictMode>
  )
}

VirtualTour.propTypes = {
  isMobile: PropTypes.bool,
  allowMotion: PropTypes.bool,
  startingRoom: PropTypes.string,
  initialYaw: PropTypes.number,
  enableClose: PropTypes.bool,
  disablePriority: PropTypes.bool,
  enabledRooms: PropTypes.arrayOf(PropTypes.string),
  enabledHotSpots: PropTypes.arrayOf(PropTypes.string),

  rootElement: PropTypes.any.isRequired,
  reactRoot: PropTypes.any.isRequired
}

VirtualTour.defaultProps = {
  isMobile: false,
  allowMotion: false,
  enableClose: false,
  disablePriority: false,
  startingRoom: CONFIG.START_KEY,
  initialYaw: 0,
  enabledRooms: [],
  enabledHotSpots: []
}
