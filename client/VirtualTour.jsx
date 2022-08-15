// Establish our custom cutout material
import './shaders/CutoutShader.js'

import React from 'react'
import PropTypes from 'prop-types'

import { CssBaseline } from '@mui/material'

import PanoViewer from './components/PanoViewer.jsx'
import SettingsDial from './components/SettingsDial.jsx'
import InfoModal from './components/InfoModal.jsx'

export default function VirtualTour (props) {
  const { isMobile, allowMotion } = props

  React.useEffect(() => {
    if (_DEV_) {
      // if (isMobile) {
      //   alert('Detected mobile device')
      // } else {
      //   alert('Not a mobile device')
      // }
    }
  }, [isMobile])

  return (
    <React.StrictMode>
      {/* Main three.js fiber canvas */}
      <PanoViewer isMobile={isMobile} allowMotion={allowMotion} />

      {/* MUI overlay */}
      <CssBaseline />
      <SettingsDial allowMotion={allowMotion} />
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
