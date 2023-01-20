import React from 'react'

import { useRecoilState } from 'recoil'
import { currentPanoDataState } from '../../state/fullTourState.js'

import { getDataSubRoute } from '../../state/asyncDataHelper.js'

import { Box, Divider, MenuItem, Stack, TextField, Tabs, Tab, Button, Collapse } from '@mui/material'

import AlignmentEditor from './AlignmentEditor.jsx'
import VideoSettingsEditor from './VideoSettingsEditor.jsx'
import RoomExitList from './RoomExitList.jsx'
import RoomHotspotList from './RoomHotSpotList.jsx'
import TabPanel from '../Utility/TabPanel.jsx'

// Make aria props for tabs
function a11yProps (index) {
  return {
    id: `virtual-tour-tab-${index}`,
    'aria-controls': `virtual-tour-tabpanel-${index}`
  }
}

// All the different collapses
const COLLAPSE = Object.freeze({
  LABEL_AND_ORIENTATION: 0,
  VIDEO_SETTINGS: 1,
  MINI_MAP_INFO: 2,
  TABBED_INFO: 3
})

export default function TourInfoForm () {
  // Subscribe to pano DB changes
  const [currentPanoData, setCurrentPanoData] = useRecoilState(currentPanoDataState)

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

  // Update alignment values
  const updateAlignment = (x, y, z) => {
    const newAlignment = [
      isNaN(x) || x === null ? (currentPanoData?.alignment?.[0] || 0) : x,
      isNaN(y) || y === null ? (currentPanoData?.alignment?.[1] || 0) : y,
      isNaN(z) || z === null ? (currentPanoData?.alignment?.[2] || 0) : z
    ]
    setCurrentPanoData({ alignment: newAlignment })
  }

  // Sanitized local copy of video data
  const localVideo = currentPanoData?.video ? { ...currentPanoData.video } : {}

  // Update video crop values
  const updateVideo = (newData) => {
    setCurrentPanoData({ video: { ...localVideo, ...newData } })
  }

  // Update map info vales
  const updateMapInfo = newData => {
    setCurrentPanoData({
      mapInfo: { ...currentPanoData.mapInfo, ...newData }
    })
  }

  // Local collapse and tab states
  const [collapse, setCollapse] = React.useState(0)
  const [currentTab, setCurrentTab] = React.useState(0)
  const changeTab = (event, newIndex) => {
    setCurrentTab(newIndex)
    setCollapse(COLLAPSE.TABBED_INFO)
  }

  return (
    <Box sx={{ textAlign: 'left', width: '100%' }}>
      <Stack>
        <Button
          variant="text"
          onClick={() => setCollapse(COLLAPSE.LABEL_AND_ORIENTATION)}
          sx={{ mb: 1 }}
        >
          Label and Orientation
        </Button>
        <Collapse in={collapse === COLLAPSE.LABEL_AND_ORIENTATION} collapsedSize='0px'>
          <TextField
            label="Room Label"
            variant="standard"
            value={currentPanoData?.label}
            onChange={e => setCurrentPanoData({ label: e.target.value })}
            sx={{ mb: 2 }}
          />

          <AlignmentEditor alignment={currentPanoData?.alignment || [0, 0, 0]} updateAlignment={updateAlignment} />
        </Collapse>

        <Divider orientation="horizontal" sx={{ my: 2 }} />
        <Button
          variant="text"
          onClick={() => setCollapse(COLLAPSE.VIDEO_SETTINGS)}
          sx={{ mb: 1 }}
        >
          Video Settings
        </Button>
        <Collapse in={collapse === COLLAPSE.VIDEO_SETTINGS} collapsedSize='0px'>
          <VideoSettingsEditor video={localVideo} updateVideo={updateVideo} />
        </Collapse>

        <Divider orientation="horizontal" sx={{ my: 2 }} />

        <Button
          variant="text"
          onClick={() => setCollapse(COLLAPSE.MINI_MAP_INFO)}
          sx={{ mb: 1 }}
        >
          Mini-map Info
        </Button>
        <Collapse in={collapse === COLLAPSE.MINI_MAP_INFO} collapsedSize='0px'>
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
        <Tabs value={currentTab} onChange={changeTab} onClick={() => setCollapse(COLLAPSE.TABBED_INFO)}>
          <Tab label="Exits" {...a11yProps(0)} />
          <Tab label="Hotspots" {...a11yProps(1)} />
        </Tabs>

        <Collapse in={collapse === COLLAPSE.TABBED_INFO}>
          <TabPanel currentTab={currentTab} index={0}>
            <RoomExitList />
          </TabPanel>

          <TabPanel currentTab={currentTab} index={1}>
            <RoomHotspotList />
          </TabPanel>
        </Collapse>

      </Stack>
    </Box>
  )
}
