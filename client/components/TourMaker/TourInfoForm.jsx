import React from 'react'

import { useRecoilValue } from 'recoil'
import { currentPanoKeyState } from '../../state/globalState.js'

import localDB, { setCurrentPanoData } from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'
import { getDataSubRoute } from '../../state/asyncDataHelper.js'

import { Box, Divider, MenuItem, Stack, TextField, Tabs, Tab, Button, Collapse } from '@mui/material'

import AlignmentEditor from './AlignmentEditor.jsx'
import RoomExitList from './RoomExitList.jsx'
import RoomHotSpotList from './RoomHotSpotList.jsx'
import TabPanel from '../TabPanel.jsx'

function a11yProps (index) {
  return {
    id: `virtual-tour-tab-${index}`,
    'aria-controls': `virtual-tour-tabpanel-${index}`
  }
}

export default function TourInfoForm () {
  // Subscribe to pano DB changes
  const currentPanoKey = useRecoilValue(currentPanoKeyState)
  const currentPanoData = useLiveQuery(() => localDB.panoInfoState.get(currentPanoKey), [currentPanoKey], null)

  // Select dropdown choices
  const [buildingNameChoices, setBuildingNameChoices] = React.useState([])
  const [buildingFloorChoices, setBuildingFloorChoices] = React.useState([])
  const [mapImageChoices, setMapImageChoices] = React.useState([])

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

  const [collapse, setCollapse] = React.useState(0)
  const [currentTab, setCurrentTab] = React.useState(0)
  const changeTab = (event, newIndex) => {
    setCurrentTab(newIndex)
    setCollapse(2)
  }

  return (
    <Box sx={{ textAlign: 'left', width: '100%' }}>
      <Stack>
        <Button
          variant="text"
          onClick={() => setCollapse(0)}
          sx={{ mb: 1 }}
        >
          Label and Orientation
        </Button>
        <Collapse in={collapse === 0} collapsedSize='0px'>
          <TextField
            label="Room Label"
            variant="standard"
            value={currentPanoData?.label}
            onChange={e => updatePanoData({ label: e.target.value })}
            sx={{ mb: 2 }}
          />

          <AlignmentEditor alignment={currentPanoData?.alignment || [0, 0, 0]} updateAlignment={updateAlignment} />
        </Collapse>

        <Divider orientation="horizontal" sx={{ my: 2 }} />
        <Button
          variant="text"
          onClick={() => setCollapse(1)}
          sx={{ mb: 1 }}
        >
          Mini-map Info
        </Button>
        <Collapse in={collapse === 1} collapsedSize='0px'>
          <Stack spacing={2}>
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
          </Stack>
        </Collapse>

        <Divider orientation="horizontal" sx={{ mb: 2 }} />
        <Tabs value={currentTab} onChange={changeTab} onClick={() => setCollapse(2)}>
          <Tab label="Exits" {...a11yProps(0)} />
          <Tab label="Hotspots" {...a11yProps(1)} />
        </Tabs>

        <Collapse in={collapse === 2}>
          <TabPanel currentTab={currentTab} index={0}>
            <RoomExitList />
          </TabPanel>

          <TabPanel currentTab={currentTab} index={1}>
            <RoomHotSpotList />
          </TabPanel>
        </Collapse>

      </Stack>
    </Box>
  )
}
