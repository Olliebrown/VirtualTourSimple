import CONFIG from '../../config'

import React from 'react'
import PropTypes from 'prop-types'

import { Box, Stack, Typography } from '@mui/material'

export default function ZoomHotspotContent (props) {
  const { caption, hotspotImage } = props

  return (
    <Box sx={{ p: 2, height: 'calc(100vh - 400px)' }}>
      <Stack spacing={2} justifyContent='center'>
        <Box
          component='img'
          sx={{
            position: 'relative',
            objectFit: 'contain',
            maxHeight: 'calc(100vh - 500px)'
          }}
          src={`${CONFIG().INFO_IMAGE_PATH}/${hotspotImage.src}`}
          alt={hotspotImage.alt}
        />
        {caption &&
          <Typography variant="h5" component="div">
            {caption}
          </Typography>}
      </Stack>
    </Box>
  )
}

ZoomHotspotContent.propTypes = {
  caption: PropTypes.string,
  hotspotImage: PropTypes.shape({
    src: PropTypes.string.isRequired,
    alt: PropTypes.string
  })
}

ZoomHotspotContent.defaultProps = {
  caption: '',
  hotspotImage: { src: '', alt: 'unknownImage' }
}
