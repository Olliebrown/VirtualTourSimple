import React from 'react'

import { currentPanoDataState } from '../../state/globalTourInfo.js'
import { useRecoilState } from 'recoil'

import { Box, Stack, TextField } from '@mui/material'
import NumberField from '../Utility/NumberField.jsx'

export default function TourInfoForm () {
  const [currentPanoData, setCurrentPanoData] = useRecoilState(currentPanoDataState)

  const updatePanoData = newData => {
    setCurrentPanoData({
      ...currentPanoData,
      ...newData
    })
  }

  const updateAlignment = (x, y, z) => {
    const newAlignment = [
      isNaN(x) || x === null ? currentPanoData.alignment[0] : x,
      isNaN(y) || y === null ? currentPanoData.alignment[1] : y,
      isNaN(z) || z === null ? currentPanoData.alignment[2] : z
    ]
    setCurrentPanoData({
      ...currentPanoData,
      alignment: newAlignment
    })
  }

  return (
    <Box sx={{ overflowX: 'scroll', overflowY: 'scroll', textAlign: 'left' }}>
      <Stack spacing={2}>
        <TextField
          label="Room Label"
          variant="standard"
          value={currentPanoData.label}
          onChange={e => updatePanoData({ label: e.target.value })}
        />

        <Stack direction="row" spacing={2}>
          <NumberField
            label='X Rot'
            value={currentPanoData.alignment[0]}
            onChange={newVal => updateAlignment(newVal, null, null)}
            variant='standard'
          />

          <NumberField
            label='Y Rot'
            value={currentPanoData.alignment[1]}
            onChange={newVal => updateAlignment(null, newVal, null)}
            variant='standard'
          />

          <NumberField
            label='Z Rot'
            value={currentPanoData.alignment[2]}
            onChange={newVal => updateAlignment(null, null, newVal)}
            variant='standard'
          />
        </Stack>
      </Stack>
    </Box>
  )
}
