import React from 'react'
import PropTypes from 'prop-types'

import { Navigation as ArrowIcon } from '@mui/icons-material'

export default function MiniMapArrow (props) {
  const { x, y, angle } = props

  return (
    <ArrowIcon
      sx={{
        height: 15,
        width: 15,
        color: '#CC0000',
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${angle})`
      }}
    />
  )
}

MiniMapArrow.propTypes = {
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  angle: PropTypes.number
}

MiniMapArrow.defaultProps = {
  angle: 0
}
