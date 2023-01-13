import CONFIG from '../../config'

import React from 'react'
import PropTypes from 'prop-types'

import MyCarousel from 'react-material-ui-carousel'
import { Box, Stack, Typography } from '@mui/material'

// Must peal off 'default' as it is a CJS module
const Carousel = MyCarousel.default

export default function HotspotContent (props) {
  const { hotspotImages, defaultHeight } = props

  const [imageLoadList, setImageLoadList] = React.useState([])
  const imageDone = (index, error) => {
    if (error) {
      console.error('Error loading image', index)
      console.error(error)
    }

    const newLoadList = [...imageLoadList]
    newLoadList[index] = true
    setImageLoadList(newLoadList)
  }

  React.useEffect(() => {
    setImageLoadList(hotspotImages.map(item => false))
  }, [hotspotImages])

  return (
    <Box sx={{ p: 2, height: 'calc(100vh - 400px)' }}>
      {Array.isArray(hotspotImages) &&
        <Carousel autoPlay={false}>
          {hotspotImages.map((imageInfo, i) => (
            <Stack key={i} spacing={2} justifyContent='center'>
              <Box
                component='img'
                sx={{
                  objectFit: 'contain',
                  maxHeight: 'calc(100vh - 500px)',
                  height: imageLoadList.length < hotspotImages.length ? defaultHeight + 50 : undefined
                }}
                src={`${CONFIG.INFO_IMAGE_PATH}/${imageInfo.src}`}
                alt={imageInfo.alt}
                onLoad={() => imageDone(i)}
                onError={(err) => imageDone(i, err)}
              />
              {imageInfo.caption &&
                <Typography variant="h5" component="div">
                  {imageInfo.caption}
                </Typography>}
            </Stack>
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
  ),
  defaultHeight: PropTypes.number
}

HotspotContent.defaultProps = {
  hotspotImages: [],
  defaultHeight: 200
}
