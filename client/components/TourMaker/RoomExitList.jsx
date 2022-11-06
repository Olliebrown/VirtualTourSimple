import React from 'react'

import { useRecoilValue, useRecoilState } from 'recoil'
import { currentPanoKeyState, currentPanoDataState } from '../../state/fullTourState.js'

import { Box, Button } from '@mui/material'

import PanoExitEdit from './PanoExitEdit.jsx'

export default function RoomExitList (props) {
  // Subscribe to pano DB changes
  const currentPanoKey = useRecoilValue(currentPanoKeyState)
  const [currentPanoData, setCurrentPanoData] = useRecoilState(currentPanoDataState)

  // Which exit is currently being edited
  const [editExit, setEditExit] = React.useState(-1)
  const [alignExit, setAlignExit] = React.useState(-1)

  // Update one of the exits
  const updateExit = (i, newExit) => {
    const newExits = [...currentPanoData.exits]
    newExits[i] = newExit
    setCurrentPanoData({ exits: newExits })
  }

  // Add or delete an exit
  const addExit = () => {
    const newExits = [...currentPanoData.exits]
    newExits.push({ key: '', direction: 0, type: 'arrow' })
    setCurrentPanoData({ exits: newExits })
  }

  const deleteExit = i => {
    const newExits = [...currentPanoData.exits]
    newExits.splice(i, 1)
    setCurrentPanoData({ exits: newExits })
  }

  return (
    <Box sx={{ p: 1, overflowY: 'auto', maxHeight: '400px' }}>
      {currentPanoData?.exits.map((exit, i) => (
        <PanoExitEdit
          key={exit.key}
          exit={exit}
          currentPanoKey={currentPanoKey}
          enableEdit={editExit === i}
          enableAlign={alignExit === i}
          onChange={newExit => updateExit(i, newExit) }
          onDelete={() => deleteExit(i)}
          onEdit={() => { setAlignExit(-1); setEditExit(editExit === i ? -1 : i) }}
          onAlign={() => { setEditExit(-1); setAlignExit(alignExit === i ? -1 : i) }}
        />
      ))}
      <Button onClick={addExit} fullWidth sx={{ mb: 2 }}>New Exit</Button>
    </Box>
  )
}
