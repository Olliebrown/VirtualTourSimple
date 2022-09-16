import React from 'react'
// import PropTypes from 'prop-types'

import useStore from '../state/useStore.js'
import { Box, Paper } from '@mui/material'

import HEATING_PLANT_IMAGE_LIST from './heatingPlantImages.js'
import MiniMapPin from './MiniMapPin.jsx'

export default function MiniMap (props) {
  // Get the global state of the pano image
  const currentPano = useStore(state => state.currentPano)

  // Mini map local state
  const [mapInfo, setMapInfo] = React.useState(null)

  React.useEffect(() => {
    const currentPanoData = HEATING_PLANT_IMAGE_LIST[currentPano]
    if (currentPanoData.mapInfo) {
      setMapInfo(currentPanoData.mapInfo)
    } else {
      setMapInfo(null)
    }
  }, [currentPano])

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
          <MiniMapPin active {...mapInfo} />
        </React.Fragment>}
    </Paper>
  )
}
