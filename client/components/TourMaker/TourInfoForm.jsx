import React from 'react'

import { useRecoilValue } from 'recoil'
import { currentPanoKeyState } from '../../state/globalState.js'

import localDB, { setCurrentPanoData } from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'
import { getDataSubRoute } from '../../state/asyncDataHelper.js'

import { Box, Button, Divider, MenuItem, Stack, TextField, Typography } from '@mui/material'

import PanoExitEdit from './PanoExitEdit.jsx'
import AlignmentEditor from './AlignmentEditor.jsx'

export default function TourInfoForm () {
  // Subscribe to pano DB changes
  const currentPanoKey = useRecoilValue(currentPanoKeyState)
  const currentPanoData = useLiveQuery(() => localDB.panoInfoState.get(currentPanoKey), [currentPanoKey], null)

  // Select dropdown choices
  const [buildingNameChoices, setBuildingNameChoices] = React.useState([])
  const [buildingFloorChoices, setBuildingFloorChoices] = React.useState([])
  const [mapImageChoices, setMapImageChoices] = React.useState([])

  // Which exit is currently being edited
  const [editExit, setEditExit] = React.useState(-1)
  const [alignExit, setAlignExit] = React.useState(-1)

  // Populate dropdown choices
  React.useEffect(() => {
    const getDataChoices = async () => {
      const nameChoices = await getDataSubRoute('buildingNames', [])
      const floorChoices = await getDataSubRoute('buildingFloors', [])
      const imageChoices = await getDataSubRoute('buildingImages', [])

      setBuildingNameChoices(nameChoices)
      setBuildingFloorChoices(floorChoices)
      setMapImageChoices(imageChoices)
    }

    getDataChoices()
  }, [])

  // General root pano info updates
  const updatePanoData = newData => {
    setCurrentPanoData(currentPanoKey, {
      ...currentPanoData,
      ...newData
    })
  }

  // Update alignment values
  const updateAlignment = (x, y, z) => {
    const newAlignment = [
      isNaN(x) || x === null ? currentPanoData?.alignment[0] : x,
      isNaN(y) || y === null ? currentPanoData?.alignment[1] : y,
      isNaN(z) || z === null ? currentPanoData?.alignment[2] : z
    ]
    setCurrentPanoData(currentPanoKey, {
      ...currentPanoData,
      alignment: newAlignment
    })
  }

  // Update map info vales
  const updateMapInfo = newData => {
    setCurrentPanoData(currentPanoKey, {
      ...currentPanoData,
      mapInfo: {
        ...currentPanoData.mapInfo,
        ...newData
      }
    })
  }

  // Update one of the exits
  const updateExit = (i, newExit) => {
    const newExits = [...currentPanoData.exits]
    newExits[i] = newExit
    setCurrentPanoData(currentPanoKey, {
      ...currentPanoData,
      exits: newExits
    })
  }

  // Add or delete an exit
  const addExit = () => {
    const newExits = [...currentPanoData.exits]
    newExits.push({ key: '', direction: 0, type: 'arrow' })
    setCurrentPanoData(currentPanoKey, {
      ...currentPanoData,
      exits: newExits
    })
  }

  const deleteExit = i => {
    const newExits = [...currentPanoData.exits]
    newExits.splice(i, 1)
    setCurrentPanoData(currentPanoKey, {
      ...currentPanoData,
      exits: newExits
    })
  }

  return (
    <Box sx={{ textAlign: 'left' }}>
      <Stack>
        <Typography variant="h6" component="div" gutterBottom>Label and Orientation:</Typography>
        <TextField
          label="Room Label"
          variant="standard"
          value={currentPanoData?.label}
          onChange={e => updatePanoData({ label: e.target.value })}
          sx={{ mb: 2 }}
        />

        <Typography variant="body1" gutterBottom>Orientation (X, Y, Z)</Typography>
        <AlignmentEditor alignment={currentPanoData?.alignment || [0, 0, 0]} updateAlignment={updateAlignment} />

        <Divider orientation="horizontal" sx={{ my: 2 }} />
        <Typography variant="h6" component="div" gutterBottom>Mini-map Info:</Typography>
        <TextField
          label="Building Name"
          variant="standard"
          value={buildingNameChoices.length > 0 ? currentPanoData?.mapInfo.building || '' : ''}
          onChange={e => updateMapInfo({ building: e.target.value })}
          select
          sx={{ mb: 2 }}
        >
          {buildingNameChoices.map(name => (<MenuItem key={name} value={name}>{name}</MenuItem>))}
        </TextField>
        <TextField
          label="Building Floor"
          variant="standard"
          value={buildingFloorChoices.length > 0 ? currentPanoData?.mapInfo.floor || '' : ''}
          onChange={e => updateMapInfo({ floor: e.target.value })}
          select
          sx={{ mb: 2 }}
        >
          {buildingFloorChoices.map(floor => (<MenuItem key={floor} value={floor}>{floor}</MenuItem>))}
        </TextField>
        <TextField
          label="Map Image"
          variant="standard"
          value={mapImageChoices.length > 0 ? currentPanoData?.mapInfo.image || '' : ''}
          onChange={e => updateMapInfo({ image: e.target.value })}
          select
          sx={{ mb: 2 }}
        >
          {mapImageChoices.map(image => (<MenuItem key={image} value={image}>{image}</MenuItem>))}
        </TextField>

        <Divider orientation="horizontal" sx={{ mb: 2 }} />
        <Typography variant="h6" component="div" gutterBottom>Room Exits:</Typography>
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
      </Stack>
    </Box>
  )
}
