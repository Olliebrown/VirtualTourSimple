import React from 'react'
import PropTypes from 'prop-types'

import { Box } from '@mui/material'

export default function MiniMapPin (props) {
  const { x, y, active, adjacent, offset } = props

  return (
    <Box
      component="div"
      sx={{
        height: 8,
        width: 8,
        backgroundColor: active ? '#CC0000' : adjacent ? '#00CCCC' : '#777777',
        borderRadius: '50%',
        position: 'absolute',
        left: x + (offset?.x || 0),
        top: y + (offset?.y || 0),
        transform: 'translate(-50%, -50%)'
      }}
    />
  )
}

MiniMapPin.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  active: PropTypes.bool,
  adjacent: PropTypes.bool,
  offset: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number })
}

MiniMapPin.defaultProps = {
  active: false,
  adjacent: false,
  offset: { x: 0, y: 0 }
}
