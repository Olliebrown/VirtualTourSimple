import React from 'react'
import PropTypes from 'prop-types'

import localDB, { INVERT_CONTROLS_DEFAULT, MOTION_CONTROLS_DEFAULT, updateSetting } from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { SpeedDial, SpeedDialIcon, SpeedDialAction, Tooltip } from '@mui/material'
import { Cameraswitch as InvertIcon, Explore as GyroIcon } from '@mui/icons-material'

export default function SettingsDial (props) {
  const { allowMotion } = props

  // Subscribe to changes in global state
  const enableMotionControls = useLiveQuery(() => localDB.settings.get('enableMotionControls'))?.value ?? MOTION_CONTROLS_DEFAULT
  const invertOrbitControls = useLiveQuery(() => localDB.settings.get('invertOrbitControls'))?.value ?? INVERT_CONTROLS_DEFAULT

  return (
    <Tooltip title="Controls Settings" enterDelay={0} placement='left-end'>
      <SpeedDial
        ariaLabel="Controls Settings"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          tooltipOpen
          icon={<InvertIcon />}
          tooltipTitle={'Invert'}
          onClick={() => updateSetting('invertOrbitControls', !invertOrbitControls)}
        />
        {allowMotion &&
          <SpeedDialAction
            tooltipOpen
            icon={<GyroIcon />}
            tooltipTitle={'Motion'}
            onClick={() => updateSetting('enableMotionControls', !enableMotionControls)}
            />}
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
