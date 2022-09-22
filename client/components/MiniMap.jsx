import React from 'react'
// import PropTypes from 'prop-types'

import { useHotkeys } from 'react-hotkeys-hook'
import useStore from '../state/useStore.js'
import { Box, Paper } from '@mui/material'

import HEATING_PLANT_IMAGE_LIST from './heatingPlantImages.js'
import MiniMapPin from './MiniMapPin.jsx'
import MiniMapArrow from './MiniMapArrow.jsx'

import config from '../config.js'

export default function MiniMap (props) {
  // Get the global state of the pano image
  const { currentPano, currentCameraYaw } = useStore(state => ({
    currentPano: state.currentPano,
    currentCameraYaw: state.currentCameraYaw
  }))

  // Mini map local state
  const [mapInfo, setMapInfo] = React.useState(null)

  /* eslint-disable react-hooks/rules-of-hooks */
  if (config.ENABLE_MINIMAP_HOTKEYS) {
    useHotkeys('shift+left', () => { setMapInfo({ ...mapInfo, x: mapInfo.x - 1 }) }, {}, [mapInfo])
    useHotkeys('shift+right', () => { setMapInfo({ ...mapInfo, x: mapInfo.x + 1 }) }, {}, [mapInfo])
    useHotkeys('shift+up', () => { setMapInfo({ ...mapInfo, y: mapInfo.y - 1 }) }, {}, [mapInfo])
    useHotkeys('shift+down', () => { setMapInfo({ ...mapInfo, y: mapInfo.y + 1 }) }, {}, [mapInfo])
  }
  /* eslint-enable react-hooks/rules-of-hooks */

  React.useEffect(() => {
    const currentPanoData = HEATING_PLANT_IMAGE_LIST[currentPano]
    if (currentPanoData.mapInfo) {
      setMapInfo(currentPanoData.mapInfo)
    } else {
      setMapInfo(null)
    }
  }, [currentPano])

  // Compute all pins
  const allPins = React.useMemo(() => {
    if (mapInfo) {
      const currentPanoData = HEATING_PLANT_IMAGE_LIST[currentPano]
      return Object.keys(HEATING_PLANT_IMAGE_LIST)
        .filter(key => key !== currentPano)
        .map(key => ({ ...HEATING_PLANT_IMAGE_LIST[key].mapInfo, key }))
        .filter(curInfo => curInfo && curInfo.floor === mapInfo.floor && (curInfo.x !== 0 || curInfo.y !== 0))
        .map(curInfo => (
          <MiniMapPin
            key={curInfo.key}
            {...curInfo}
            adjacent={currentPanoData.exits.some(exit => curInfo.key === exit.name)}
          />
        ))
    } else {
      return []
    }
  }, [currentPano, mapInfo])

  // console.log({ ...mapInfo, currentPano })
  return (
    <Paper
      elevation={3}
      aria-label="Virtual Tour Map"
      sx={{ position: 'absolute', bottom: 16, left: 16, padding: 2, maxWidth: 300, maxHeight: 200 }}
    >
      {mapInfo &&
        <React.Fragment>
          <Box
            component="img"
            sx={{ maxWidth: '100%' }}
            alt="Blueprint image of the current floor of the building"
            src={`media/${mapInfo.floor}.png`}
          />
          <MiniMapArrow {...mapInfo} angle={currentCameraYaw} />
          {allPins}
        </React.Fragment>}
    </Paper>
  )
}
