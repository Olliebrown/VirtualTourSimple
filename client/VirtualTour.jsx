// Establish our custom cutout material
import './shaders/CutoutShader.js'

import React, { useEffect } from 'react'

import { Container, CssBaseline } from '@mui/material'

import PanoViewer from './components/PanoViewer.jsx'
import SettingsDial from './components/SettingsDial.jsx'

export default function VirtualTour (props) {
  const { isMobile, allowMotion } = props

  useEffect(() => {
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
    </React.StrictMode>
  )
}
