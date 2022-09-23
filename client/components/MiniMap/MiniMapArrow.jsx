import React from 'react'
import PropTypes from 'prop-types'

import { Navigation as ArrowIcon } from '@mui/icons-material'

export default function MiniMapArrow (props) {
  const { x, y, angle, offset } = props

  return (
    <ArrowIcon
      sx={{
        height: 15,
        width: 15,
        color: '#CC0000',
        position: 'absolute',
        left: x + (offset?.x || 0),
        top: y + (offset?.y || 0),
        transform: `translate(-50%, -50%) rotate(${angle - Math.PI / 2}rad)`
      }}
    />
  )
}

MiniMapArrow.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  angle: PropTypes.number,
  offset: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number })
}

MiniMapArrow.defaultProps = {
  angle: 0,
  offset: { x: 0, y: 0 }
}
