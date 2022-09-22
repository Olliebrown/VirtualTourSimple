import React from 'react'
import PropTypes from 'prop-types'

import { Box } from '@mui/material'

export default function HotSpotContent (props) {
  const { hotSpotImages } = props

  return (
    <Box sx={{ p: 2 }}>
      {Array.isArray(hotSpotImages) &&
        <React.Fragment>
          {hotSpotImages.map((imageInfo, i) => (
            <Box component='img' key={i} {...imageInfo} width="100%" />
          ))}
        </React.Fragment>
      }
    </Box>
  )
}

HotSpotContent.propTypes = {
  hotSpotImages: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired
    })
  )
}

HotSpotContent.defaultProps = {
  hotSpotImages: []
}
