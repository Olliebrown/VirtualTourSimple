import React from 'react'
import PropTypes from 'prop-types'

import { Box } from '@mui/material'

export default function MiniMapPin (props) {
  const { x, y, active, adjacent } = props

  return (
    <Box
      component="div"
      sx={{
        height: 8,
        width: 8,
        backgroundColor: active ? '#CC0000' : adjacent ? '#00CCCC' : '#777777',
        borderRadius: '50%',
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)'
      }}
    />
  )
}

MiniMapPin.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  active: PropTypes.bool,
  adjacent: PropTypes.bool
}

MiniMapPin.defaultProps = {
  active: false,
  adjacent: false
}
