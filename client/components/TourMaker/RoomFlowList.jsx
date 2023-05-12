import React from 'react'

import { useRecoilState } from 'recoil'
import { currentPanoDataState } from '../../state/fullTourState.js'

import { Box, Button } from '@mui/material'

import PanoFlowItemEdit from './PanoFlowItemEdit.jsx'

export default function RoomFlowList (props) {
  // Subscribe to pano DB changes
  const [currentPanoData, setCurrentPanoData] = useRecoilState(currentPanoDataState)

  // Which hotspot is currently being edited
  const [editHotspot, setEditHotspot] = React.useState(-1)

  // Update one of the hotspots
  const updateHotspot = (i, updatedHotspot) => {
    const newHotspots = [...currentPanoData.hotspots]
    newHotspots[i] = { ...newHotspots[i], ...updatedHotspot }
    setCurrentPanoData({ hotspots: newHotspots })
  }

  // Add or delete an exit
  const addHotspot = () => {
    const newHotspots = [...currentPanoData.hotspots]
    newHotspots.push({
      id: '',
      title: '',
      longitude: 0,
      latitude: 0,
      radius: 6,
      scale: 1,
      type: 'info',
      modal: true
    })
    setCurrentPanoData({ hotspots: newHotspots })
  }

  const deleteHotspot = i => {
    const newHotspots = [...currentPanoData.hotspots]
    newHotspots.splice(i, 1)
    setCurrentPanoData({ ...currentPanoData, hotspots: newHotspots })
  }

  return (
    <Box sx={{ p: 1, overflowY: 'auto', maxHeight: '400px' }}>
      {currentPanoData?.hotspots.map((hotspot, i) => (
        <PanoFlowItemEdit
          key={i}
          hotspotInfo={hotspot}
          enableEdit={editHotspot === i}
          onChange={updatedHotspot => updateHotspot(i, updatedHotspot) }
          onDelete={() => deleteHotspot(i)}
          onEdit={() => { setEditHotspot(editHotspot === i ? -1 : i) }}
        />
      ))}
      <Button onClick={addHotspot} fullWidth sx={{ mb: 2 }}>New Hotspot</Button>
    </Box>
  )
}
