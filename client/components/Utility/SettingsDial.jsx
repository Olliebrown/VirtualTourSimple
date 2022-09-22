import React from 'react'
import PropTypes from 'prop-types'

import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import Icon from '@mui/material/Icon'

import useStore from '../../state/useStore.js'

export default function SettingsDial (props) {
  const { allowMotion } = props
  const { toggleMotionControls, toggleInvertOrbitControls } = useStore(state => (state))

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
        onClick={toggleInvertOrbitControls}
      />
      {allowMotion &&
        <SpeedDialAction
          tooltipOpen
          icon={<Icon>explore</Icon>}
          tooltipTitle={'Gyro'}
          onClick={toggleMotionControls}
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
