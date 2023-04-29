import CONFIG from '../../config'

import React from 'react'
import PropTypes from 'prop-types'

import ReactPlayerRaw from 'react-player'
import { Box, Stack, Typography } from '@mui/material'

// Peel off the default export from the react-player module (an esbuild quirk)
const ReactPlayer = ReactPlayerRaw.default

export default function ZoomHotspotContent (props) {
  const { caption, hotspotImage } = props

  const media = (hotspotImage?.isVideo
    ? <ReactPlayer url={`${CONFIG().ZOOM_IMAGE_PATH}/${hotspotImage.src}`} controls volume={0.5} width='100%' height='' />
    : <Box
        component='img'
        sx={{
          position: 'relative',
          objectFit: 'contain',
          maxHeight: 'calc(100vh - 500px)'
        }}
        src={`${CONFIG().ZOOM_IMAGE_PATH}/${hotspotImage.src}`}
        alt={hotspotImage.alt}
      />)

  return (
    <Box sx={{ p: 2, height: 'calc(100vh - 400px)' }}>
      <Stack spacing={2} justifyContent='center' alignItems='center'>
        {media}
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
    isVideo: PropTypes.bool,
    alt: PropTypes.string
  })
}

ZoomHotspotContent.defaultProps = {
  caption: '',
  hotspotImage: { src: '', isVideo: false, alt: 'unknownImage' }
}
