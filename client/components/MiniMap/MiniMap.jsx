import React from 'react'
import PropTypes from 'prop-types'

import CONFIG from '../../config.js'

import { fullTourDataState, currentPanoKeyState, currentPanoDataState, enabledPanoRoomsState } from '../../state/fullTourState.js'
import { currentCameraYawState } from '../../state/globalState.js'
import { useRecoilState, useRecoilValue } from 'recoil'

import { getFullTourDataFromServer } from '../../state/asyncDataHelper.js'

import { useHotkeys } from 'react-hotkeys-hook'

import { Box, Card, CardHeader, CardContent, Button, IconButton, Slide, Fade } from '@mui/material'
import { Close as CloseIcon, Map as MapIcon, ExpandLess as ExpandIcon } from '@mui/icons-material'

import MiniMapPin from './MiniMapPin.jsx'
import MiniMapArrow from './MiniMapArrow.jsx'

// Header offsets the point by 90 (without padding which adds 16px)
const ARROW_PIN_X_OFFSET = 42
const ARROW_PIN_Y_OFFSET = 205
const ARROW_PIN_SCALE_X = 0.45
const ARROW_PIN_SCALE_Y = 0.45

export default function MiniMap (props) {
  const { startVisible } = props

  // Subscribe to changes in global state
  const currentCameraYaw = useRecoilValue(currentCameraYawState)

  // Subscribe to pano DB changes
  const currentPanoKey = useRecoilValue(currentPanoKeyState)
  const [currentPanoData, setCurrentPanoData] = useRecoilState(currentPanoDataState)
  const enabledPanoRooms = useRecoilValue(enabledPanoRoomsState)

  // Get latest map info data
  const [fullTourData, setFullTourData] = useRecoilState(fullTourDataState)
  React.useEffect(() => {
    // Possibly retrieve the full tour data from the server
    const retrieveData = async () => {
      const newData = await getFullTourDataFromServer()
      setFullTourData(newData)
    }

    // Only need to use this if data editing is enabled
    if (CONFIG().ENABLE_DATA_EDITING) {
      retrieveData()
    }
  }, [setFullTourData])

  // Controlling visibility of the minimap
  const [showMap, setShowMap] = React.useState(startVisible)

  // Mini map local state
  const [mapInfo, setMapInfo] = React.useState(null)
  const updateMapInfo = (newMapInfo) => {
    if (CONFIG().ENABLE_DATA_EDITING) {
      setCurrentPanoData({
        mapInfo: { ...mapInfo, ...newMapInfo }
      })
      setMapInfo(newMapInfo)
    }
  }

  /* eslint-disable react-hooks/rules-of-hooks */
  if (CONFIG().ENABLE_MINIMAP_HOTKEYS) {
    useHotkeys('shift+left', () => { updateMapInfo({ x: mapInfo.x - 1 }) }, {}, [mapInfo])
    useHotkeys('shift+right', () => { updateMapInfo({ x: mapInfo.x + 1 }) }, {}, [mapInfo])
    useHotkeys('shift+up', () => { updateMapInfo({ y: mapInfo.y - 1 }) }, {}, [mapInfo])
    useHotkeys('shift+down', () => { updateMapInfo({ y: mapInfo.y + 1 }) }, {}, [mapInfo])
  }
  /* eslint-enable react-hooks/rules-of-hooks */

  React.useEffect(() => {
    if (currentPanoData?.mapInfo) {
      setMapInfo(currentPanoData?.mapInfo)
    } else {
      setMapInfo(null)
    }
  }, [currentPanoData?.mapInfo])

  // Compute all pins
  const allPins = React.useMemo(() => {
    if (mapInfo) {
      const pins = Object.keys(fullTourData)
        .filter(key => key !== currentPanoKey && (enabledPanoRooms.length < 1 || enabledPanoRooms.includes(key)))
        .map(key => ({ ...fullTourData[key].mapInfo, key }))
        .filter(curInfo => curInfo && curInfo.floor === mapInfo.floor && (curInfo.x !== 0 || curInfo.y !== 0))
        .map(curInfo => (
          <MiniMapPin
            key={curInfo.key}
            {...curInfo}
            adjacent={!!currentPanoData?.exits?.some(exit => curInfo.key === exit.key)}
            offset={{ x: ARROW_PIN_X_OFFSET, y: ARROW_PIN_Y_OFFSET }}
            scale={{ x: ARROW_PIN_SCALE_X, y: ARROW_PIN_SCALE_Y }}
          />
        ))
      return pins
    } else {
      return []
    }
  }, [currentPanoData?.exits, currentPanoKey, fullTourData, mapInfo, enabledPanoRooms])

  return (
    <React.Fragment>
      <Fade in={!showMap}>
        <Button
          variant="contained"
          endIcon={<ExpandIcon />}
          sx={{ position: 'absolute', bottom: -5, left: 16, minWidth: 300 }}
          onClick={() => setShowMap(true)}
        >
          {'Show Map '}
          <MapIcon />
        </Button>
      </Fade>

      <Slide direction="up" in={showMap} mountOnEnter unmountOnExit>
        <Card sx={{ position: 'absolute', bottom: 16, left: 16, maxWidth: 300, maxHeight: 290 }}>
          {mapInfo &&
            <React.Fragment>
              <CardHeader
                action={
                  <IconButton aria-label="close minimap" onClick={() => setShowMap(false)}>
                    <CloseIcon />
                  </IconButton>
                }
                title={mapInfo.building}
                subheader={mapInfo.floor}
                sx={{ borderBottom: '1px solid grey', p: 1 }}
              />

              <CardContent aria-label="Virtual Tour Map">
                {mapInfo &&
                  <React.Fragment>
                    <Box
                      component="img"
                      sx={{ maxWidth: '100%', marginTop: 'auto' }}
                      alt="Blueprint image of the current floor of the building"
                      src={`${CONFIG().MAP_IMAGE_PATH}/${mapInfo.image}`}
                    />
                    <MiniMapArrow
                      {...mapInfo}
                      angle={currentCameraYaw}
                      offset={{ x: ARROW_PIN_X_OFFSET, y: ARROW_PIN_Y_OFFSET }}
                      scale={{ x: ARROW_PIN_SCALE_X, y: ARROW_PIN_SCALE_Y }}
                      />
                    {allPins}
                  </React.Fragment>}
              </CardContent>
            </React.Fragment>}
        </Card>
      </Slide>
    </React.Fragment>
  )
}

MiniMap.propTypes = {
  startVisible: PropTypes.bool
}

MiniMap.defaultProps = {
  startVisible: false
}
