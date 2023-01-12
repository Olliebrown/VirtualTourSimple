import CONFIG from '../../config'

import React from 'react'
import PropTypes from 'prop-types'

import MyCarousel from 'react-material-ui-carousel'
import { Box } from '@mui/material'

// Must peal off 'default' as it is a CJS module
const Carousel = MyCarousel.default

export default function HotspotContent (props) {
  const { hotspotImages } = props

  return (
    <Box sx={{ p: 2 }}>
      {Array.isArray(hotspotImages) &&
        <Carousel autoPlay={false} height={800}>
          {hotspotImages.map((imageInfo, i) => (
            <Box key={i} component='img' src={`${CONFIG.INFO_IMAGE_PATH}/${imageInfo.src}`} alt={imageInfo.alt} width="100%" />
          ))}
        </Carousel>
      }
    </Box>
  )
}

HotspotContent.propTypes = {
  hotspotImages: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      alt: PropTypes.string,
      labels: PropTypes.arrayOf(
        PropTypes.shape({
          src: PropTypes.string.isRequired,
          x: PropTypes.number,
          y: PropTypes.number
        })
      )
    })
  )
}

HotspotContent.defaultProps = {
  hotspotImages: []
}
