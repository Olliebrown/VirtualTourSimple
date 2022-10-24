// Establish our custom cutout material
import './shaders/CutoutShader.js'

import React from 'react'
import PropTypes from 'prop-types'

import { RecoilRoot } from 'recoil'

import { CssBaseline } from '@mui/material'

import PanoViewer from './components/CorePano/PanoViewer.jsx'
import SettingsDial from './components/Utility/SettingsDial.jsx'
import InfoModal from './components/HotSpots/InfoModal.jsx'
import MiniMap from './components/MiniMap/MiniMap.jsx'
import TourInfoEditor from './components/TourMaker/TourInfoEditor.jsx'

import { Canvas } from '@react-three/fiber'

export default function VirtualTour (props) {
  const { isMobile, allowMotion } = props

  return (
    <React.StrictMode>
      {/* Main three.js fiber canvas */}
      <Canvas linear camera={{ position: [0, 0, 0.1] }}>
        <RecoilRoot override={false}>
          <PanoViewer isMobile={isMobile} allowMotion={allowMotion} />
        </RecoilRoot>
      </Canvas>

      {/* MUI overlay */}
      <CssBaseline />
      <SettingsDial allowMotion={allowMotion} />
      <TourInfoEditor />
      <MiniMap />

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
