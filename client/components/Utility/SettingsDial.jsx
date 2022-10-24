import React from 'react'
import PropTypes from 'prop-types'

import { enableMotionControlsState, invertOrbitControlsState } from '../../state/globalState.js'
import { useRecoilState } from 'recoil'

import { SpeedDial, SpeedDialIcon, SpeedDialAction, Icon } from '@mui/material'

export default function SettingsDial (props) {
  const { allowMotion } = props

  const [enableMotionControls, setEnableMotionControls] = useRecoilState(enableMotionControlsState)
  const [invertOrbitControls, setInvertOrbitControls] = useRecoilState(invertOrbitControlsState)

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
        onClick={() => setInvertOrbitControls(!invertOrbitControls)}
      />
      {allowMotion &&
        <SpeedDialAction
          tooltipOpen
          icon={<Icon>explore</Icon>}
          tooltipTitle={'Gyro'}
          onClick={() => setEnableMotionControls(!enableMotionControls)}
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
