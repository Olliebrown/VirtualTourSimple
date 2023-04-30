import React from 'react'
import PropTypes from 'prop-types'

import { TransformWrapper, TransformComponent } from '../../lib/custom-zoom-pan-pinch/index.esm'

import { Button, Stack, Typography } from '@mui/material'
import { ZoomIn as ZoomInIcon, ZoomOut as ZoomOutIcon } from '@mui/icons-material'

const Controls = ({ zoomIn, zoomOut, resetTransform, centerView }) => (
  <Stack
    direction='row'
    spacing={1}
    justifyContent='left'
    sx={{ position: 'absolute', zIndex: 2, top: 10, left: 10 }}
  >
    <Button variant='contained' onClick={() => zoomIn()}><ZoomInIcon /></Button>
    <Button variant='contained' onClick={() => zoomOut()}><ZoomOutIcon /></Button>
    <Button variant='contained' onClick={() => resetTransform()}>{'Reset'}</Button>
    <Button variant='contained' onClick={() => centerView()}>{'Center'}</Button>
  </Stack>
)

Controls.propTypes = {
  zoomIn: PropTypes.func.isRequired,
  zoomOut: PropTypes.func.isRequired,
  resetTransform: PropTypes.func.isRequired,
  centerView: PropTypes.func.isRequired
}

export default function ZoomableImage (props) {
  const { caption, src, alt } = props

  return (
    <TransformWrapper initialScale={1}>
      {(utils) => (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Controls {...utils} />
          <TransformComponent wrapperClass='zoomable-wrapper' contentClass='zoomable-content'>
            <img src={src} alt={alt} />
            <Typography variant="h5" component="div" sx={{ p: 1, width: '100%' }}>{caption}</Typography>
          </TransformComponent>
        </div>
      )}
    </TransformWrapper>
  )
}

ZoomableImage.propTypes = {
  caption: PropTypes.string,
  src: PropTypes.string.isRequired,
  alt: PropTypes.string
}

ZoomableImage.defaultProps = {
  caption: '',
  alt: 'unknown image'
}
