import React from 'react'

import CONFIG from '../../config.js'

import { currentPanoKeyState, preloadPanoKeyState, preloadPanoDataState } from '../../state/fullTourState.js'
import { setTextureLoadingState } from '../../state/textureLoadingState.js'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { useKTX2 } from '@react-three/drei'

export default function PanoTextureLoader (props) {
  // Subscribe to pano DB changes
  const setCurrentPanoKey = useSetRecoilState(currentPanoKeyState)
  const preloadPanoKey = useRecoilValue(preloadPanoKeyState)
  const preloadPanoData = useRecoilValue(preloadPanoDataState)

  // Load the base image texture
  const setTextureLoading = useSetRecoilState(setTextureLoadingState)

  // Create array of texture filenames
  const textureFiles = React.useMemo(() => ([
    `${CONFIG.PANO_IMAGE_PATH}/${preloadPanoKey}_Left.ktx2`,
    `${CONFIG.PANO_IMAGE_PATH}/${preloadPanoKey}_Right.ktx2`,
    ...(preloadPanoData?.exits ? preloadPanoData.exits.map(exit => `${CONFIG.PANO_IMAGE_PATH}/${exit.key}_Left.ktx2`) : []),
    ...(preloadPanoData?.exits ? preloadPanoData.exits.map(exit => `${CONFIG.PANO_IMAGE_PATH}/${exit.key}_Right.ktx2`) : [])
  ]), [preloadPanoData?.exits, preloadPanoKey])

  // Mark them as currently loading
  React.useEffect(() => {
    setTextureLoading(textureFiles)
  }, [setTextureLoading, textureFiles])

  // Start the loading (causes this render to suspend)
  const [loadedTextures, setLoadedTextures] = React.useState([])
  const textureRefs = useKTX2(textureFiles)

  // Synchronize texture loading state
  React.useEffect(() => {
    setLoadedTextures(textureRefs)
  }, [textureRefs])

  // Update current pano key when textures are loaded
  React.useEffect(() => {
    if (Array.isArray(loadedTextures) && loadedTextures.length > 0) {
      setCurrentPanoKey(preloadPanoKey)
    }
  }, [loadedTextures, preloadPanoKey, setCurrentPanoKey])

  // This is a hidden element
  return (null)
}
