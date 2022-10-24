import React from 'react'

import { currentPanoDataState } from '../../state/globalTourInfo.js'
import { useRecoilState } from 'recoil'

import { Box } from '@mui/material'

export default function TourInfoForm () {
  const [currentPanoData, setCurrentPanoData] = useRecoilState(currentPanoDataState)

  return (
    <Box sx={{ overflowX: 'scroll', overflowY: 'scroll', textAlign: 'left' }}>
      <pre>{JSON.stringify(currentPanoData, null, 2)}</pre>
    </Box>
  )
}
