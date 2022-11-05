import React from 'react'
import PropTypes from 'prop-types'

import { Box } from '@mui/material'

export default function HotspotContent (props) {
  const { hotspotImages } = props

  return (
    <Box sx={{ p: 2 }}>
      {Array.isArray(hotspotImages) &&
        <React.Fragment>
          {hotspotImages.map((imageInfo, i) => (
            <Box component='img' key={i} {...imageInfo} width="100%" />
          ))}
        </React.Fragment>
      }
    </Box>
  )
}

HotspotContent.propTypes = {
  hotspotImages: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired
    })
  )
}

HotspotContent.defaultProps = {
  hotspotImages: []
}
