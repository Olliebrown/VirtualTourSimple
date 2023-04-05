import React from 'react'
import PropTypes from 'prop-types'

import localDB, { INVERT_CONTROLS_DEFAULT, MOTION_CONTROLS_DEFAULT, ENABLE_PLACARD_HS_DEFAULT, ENABLE_ZOOM_HS_DEFAULT, updateSetting } from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { SpeedDial, SpeedDialIcon, SpeedDialAction, Tooltip } from '@mui/material'
import {
  Cameraswitch as InvertIcon,
  Explore as GyroIcon,
  Search as ZoomIcon,
  HelpOutline as PlacardIcon,
  Settings as SettingsIcon
} from '@mui/icons-material'

export default function SettingsDial (props) {
  const { allowMotion } = props

  // Subscribe to changes in global state
  const enableMotionControls = useLiveQuery(() => localDB.settings.get('enableMotionControls'))?.value ?? MOTION_CONTROLS_DEFAULT
  const invertOrbitControls = useLiveQuery(() => localDB.settings.get('invertOrbitControls'))?.value ?? INVERT_CONTROLS_DEFAULT
  const enablePlacardHotspots = useLiveQuery(() => localDB.settings.get('enablePlacardHotspots'))?.value ?? ENABLE_PLACARD_HS_DEFAULT
  const enableZoomHotspots = useLiveQuery(() => localDB.settings.get('enableZoomHotspots'))?.value ?? ENABLE_ZOOM_HS_DEFAULT

  // Ref for custom tooltip placement
  const dialRef = React.useRef(null)

  // Virtual element for custom tooltip placement
  const anchorEl = {
    getBoundingClientRect: () => {
      const rect = dialRef.current?.getBoundingClientRect()
      if (rect) { rect.x += -16 }
      return rect
    }
  }

  return (
    <Tooltip
      title="Settings"
      enterDelay={0}
      placement='left-end'
      PopperProps={{ anchorEl }}
    >
      <SpeedDial
        ariaLabel="Controls Settings"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon ref={dialRef} icon={<SettingsIcon />} />}
      >
        <SpeedDialAction
          icon={<InvertIcon />}
          tooltipTitle={'Invert'}
          onClick={() => updateSetting('invertOrbitControls', !invertOrbitControls)}
        />
        {allowMotion &&
          <SpeedDialAction
            icon={<GyroIcon />}
            tooltipTitle={'Motion'}
            onClick={() => updateSetting('enableMotionControls', !enableMotionControls)}
            />}
        <SpeedDialAction
          icon={<ZoomIcon />}
          tooltipTitle={'Toggle Zoom Hotspots'}
          onClick={() => updateSetting('enableZoomHotspots', !enableZoomHotspots)}
        />
        <SpeedDialAction
          icon={<PlacardIcon />}
          tooltipTitle={'Toggle Placard Hotspots'}
          onClick={() => updateSetting('enablePlacardHotspots', !enablePlacardHotspots)}
        />
      </SpeedDial>
    </Tooltip>
  )
}

SettingsDial.propTypes = {
  allowMotion: PropTypes.bool
}

SettingsDial.defaultProps = {
  allowMotion: false
}
