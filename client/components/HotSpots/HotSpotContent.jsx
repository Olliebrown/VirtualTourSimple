import CONFIG from '../../config'

import React from 'react'
import PropTypes from 'prop-types'

import MyCarousel from 'react-material-ui-carousel'
import { Box, Stack, Typography } from '@mui/material'

// Must peal off 'default' as it is a CJS module
const Carousel = MyCarousel.default

export default function HotspotContent (props) {
  const { hotspotImages, defaultHeight, slideIndex } = props

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

  // Make image overlay if there is a build with an image
  const curImageInfo = hotspotImages?.[slideIndex[0]]
  let imageBuilds = null
  let baseImageFilename = curImageInfo.src
  if (curImageInfo?.builds?.[slideIndex[1]]) {
    // Prepare filenames
    const extIndex = curImageInfo.src.lastIndexOf('.')
    const baseName = curImageInfo.src.substring(0, extIndex)
    const extension = curImageInfo.src.substring(extIndex + 1)
    const buildName = curImageInfo.builds[slideIndex[1]].src
    baseImageFilename = `${baseName}-build.${extension}`

    // Add the image
    if (buildName !== '') {
      imageBuilds = (
        <Box
          component='img'
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            objectFit: 'contain',
            maxHeight: 'calc(100vh - 500px)',
            height: imageLoadList.length < hotspotImages.length ? defaultHeight + 50 : undefined,
            width: '100%',
            marginTop: '0px !important'
          }}
          src={`${CONFIG.INFO_IMAGE_PATH}/${baseName}-build-${buildName}.${extension}`}
        />
      )
    }
  }

  return (
    <Box sx={{ p: 2, height: 'calc(100vh - 400px)' }}>
      {Array.isArray(hotspotImages) &&
        <Carousel autoPlay={false} index={slideIndex[0]}>
          {hotspotImages.map((imageInfo, i) => (
            <Stack key={i} spacing={2} justifyContent='center'>
              <Box
                component='img'
                sx={{
                  position: 'relative',
                  objectFit: 'contain',
                  maxHeight: 'calc(100vh - 500px)',
                  height: imageLoadList.length < hotspotImages.length ? defaultHeight + 50 : undefined
                }}
                src={`${CONFIG.INFO_IMAGE_PATH}/${i === slideIndex[0] ? baseImageFilename : imageInfo.src}`}
                alt={imageInfo.alt}
                onLoad={() => imageDone(i)}
                onError={(err) => imageDone(i, err)}
              />
              {i === slideIndex[0] ? imageBuilds : null}
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
      builds: PropTypes.arrayOf(
        PropTypes.shape({
          src: PropTypes.string.isRequired,
          x: PropTypes.number,
          y: PropTypes.number
        })
      )
    })
  ),
  defaultHeight: PropTypes.number,
  slideIndex: PropTypes.arrayOf(PropTypes.number)
}

HotspotContent.defaultProps = {
  hotspotImages: [],
  defaultHeight: 200,
  slideIndex: [0, 0]
}
