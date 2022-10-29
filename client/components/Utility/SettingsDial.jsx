import React from 'react'
import PropTypes from 'prop-types'

import localDB, { updateSetting } from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

import { SpeedDial, SpeedDialIcon, SpeedDialAction, Icon } from '@mui/material'

export default function SettingsDial (props) {
  const { allowMotion } = props

  // Subscribe to changes in global state
  const enableMotionControls = useLiveQuery(() => localDB.settings.get('enableMotionControls'))?.value || false
  const invertOrbitControls = useLiveQuery(() => localDB.settings.get('invertOrbitControls'))?.value || false

  return (
    <SpeedDial
      ariaLabel="Virtual Tour Settings"
      sx={{ position: 'absolute', bottom: 16, right: 16 }}
      icon={<SpeedDialIcon />}
    >
      <SpeedDialAction
        tooltipOpen
        icon={<Icon>camera_flip</Icon>}
        tooltipTitle={'Invert'}
        onClick={() => updateSetting('invertOrbitControls', !invertOrbitControls)}
      />
      {allowMotion &&
        <SpeedDialAction
          tooltipOpen
          icon={<Icon>explore</Icon>}
          tooltipTitle={'Gyro'}
          onClick={() => updateSetting('enableMotionControls', !enableMotionControls)}
          />}
    </SpeedDial>
  )
}

SettingsDial.propTypes = {
  allowMotion: PropTypes.bool
}

SettingsDial.defaultProps = {
  allowMotion: false
}
