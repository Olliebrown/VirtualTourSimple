import React from 'react'

import { useRecoilState } from 'recoil'
import { currentPanoDataState } from '../../state/fullTourState.js'

import { Box, Button } from '@mui/material'

import PanoFlowItemEdit from './PanoFlowItemEdit.jsx'

export default function RoomFlowList (props) {
  // Subscribe to pano DB changes
  const [currentPanoData, setCurrentPanoData] = useRecoilState(currentPanoDataState)

  // Which hotspot is currently being edited
  const [editFlowItem, setEditFlowItem] = React.useState(-1)
  const [stylingFlowItem, setStylingFlowItem] = React.useState(-1)
  const [alignFlowItem, setAlignFlowItem] = React.useState(-1)

  // Update one of the hotspots
  const updateFlowItem = (i, updatedFlowItem) => {
    const newFlowItems = [...(currentPanoData.flowItems ?? [])]
    newFlowItems[i] = { ...newFlowItems[i], ...updatedFlowItem }
    setCurrentPanoData({ flowItems: newFlowItems })
  }

  // Add or delete an exit
  const addFlowItem = () => {
    const newFlowItems = [...(currentPanoData.flowItems ?? [])]
    newFlowItems.push({
      key: '',
      longitude: 0,
      latitude: 0,
      radius: 6,
      scale: 1,
      alignment: [0, 0, 0]
    })
    setCurrentPanoData({ flowItems: newFlowItems })
  }

  const deleteFlowItem = i => {
    const newFlowItems = [...(currentPanoData.flowItems ?? [])]
    newFlowItems.splice(i, 1)
    setCurrentPanoData({ ...currentPanoData, flowItems: newFlowItems })
  }

  return (
    <Box sx={{ p: 1, overflowY: 'auto', maxHeight: '400px' }}>
      {currentPanoData?.flowItems?.map((flowItem, i) => (
        <PanoFlowItemEdit
          key={i}
          flowItemInfo={flowItem}
          enableEdit={editFlowItem === i}
          enableStyling={stylingFlowItem === i}
          enableAlign={alignFlowItem === i}
          onChange={updatedFlowItem => updateFlowItem(i, updatedFlowItem) }
          onDelete={() => deleteFlowItem(i)}
          onEdit={() => {
            setEditFlowItem(editFlowItem === i ? -1 : i)
            setStylingFlowItem(-1)
            setAlignFlowItem(-1)
          }}
          onStyling={() => {
            setEditFlowItem(-1)
            setStylingFlowItem(stylingFlowItem === i ? -1 : i)
            setAlignFlowItem(-1)
          }}
          onAlign={() => {
            setEditFlowItem(-1)
            setStylingFlowItem(-1)
            setAlignFlowItem(alignFlowItem === i ? -1 : i)
          }}
        />
      ))}
      <Button onClick={addFlowItem} fullWidth sx={{ mb: 2 }}>New Flow Item</Button>
    </Box>
  )
}
