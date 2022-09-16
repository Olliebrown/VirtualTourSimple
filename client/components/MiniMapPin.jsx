import React from 'react'
import PropTypes from 'prop-types'

import { Box } from '@mui/material'

export default function MiniMapPin (props) {
  const { x, y, active } = props

  return (
    <Box
      component="div"
      sx={{
        height: 15,
        width: 15,
        backgroundColor: active ? '#CC0000' : '#00CCCC',
        borderRadius: '50%',
        position: 'relative',
        left: x,
        bottom: y
      }}
    />
  )
}

MiniMapPin.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  active: PropTypes.bool
}

MiniMapPin.defaultProps = {
  active: false
}
