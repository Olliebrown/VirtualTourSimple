import React from 'react'

import { useRecoilValue } from 'recoil'
import { currentPanoKeyState } from '../../state/globalState.js'

import localDB, { setCurrentPanoData } from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { Box, Button } from '@mui/material'

import PanoHotspotEdit from './PanoHotspotEdit.jsx'

export default function RoomHotspotList (props) {
  // Subscribe to pano DB changes
  const currentPanoKey = useRecoilValue(currentPanoKeyState)
  const currentPanoData = useLiveQuery(
    () => localDB.panoInfoState.get(currentPanoKey),
    [currentPanoKey],
    null
  )

  // Which hotspot is currently being edited
  const [editHotspot, setEditHotspot] = React.useState(-1)

  // Update one of the exits
  const updateHotspot = (i, updatedHotspot) => {
    const newHotspots = [...currentPanoData.hotspots]
    newHotspots[i] = updatedHotspot
    setCurrentPanoData(currentPanoKey, {
      ...currentPanoData,
      hotspots: newHotspots
    })
  }

  // Add or delete an exit
  const addHotspot = () => {
    const newHotspots = [...currentPanoData.hotspots]
    newHotspots.push({
      title: '',
      json: '',
      longitude: 0,
      latitude: 0,
      radius: 0,
      scale: 1,
      type: 'info'
    })
    setCurrentPanoData(currentPanoKey, {
      ...currentPanoData,
      hotspots: newHotspots
    })
  }

  const deleteHotspot = i => {
    const newHotspots = [...currentPanoData.hotspots]
    newHotspots.splice(i, 1)
    setCurrentPanoData(currentPanoKey, {
      ...currentPanoData,
      hotspots: newHotspots
    })
  }

  return (
    <Box sx={{ p: 1, overflowY: 'auto', maxHeight: '400px' }}>
      {currentPanoData?.hotspots.map((hotspot, i) => (
        <PanoHotspotEdit
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
