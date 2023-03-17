import React from 'react'

import { KTX2Loader } from 'three-stdlib'
import { useThree } from '@react-three/fiber'
import { RepeatWrapping } from 'three'

import { useLoaderWithDispose } from './useLoaderWithDispose.js'

// This is a combination of the useTexture hook and the useKTX2 hook from @react-three/drei
// If the texture ends with .ktx2, it will use the ktx2 loader, otherwise is uses the texture loader.
// It also provides an onLoad callback for ALL types (normally missing from useKTX2).
const IsObject = (url) => (
  url === Object(url) && !Array.isArray(url) && typeof url !== 'function'
)

// CDN for loading the basis transcoder when path is not specified
const cdn = 'https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@master'

export function useKTX2WithOnLoad (input, onLoad, basisPath) {
  basisPath = basisPath || `${cdn}/basis/`

  // Use a loader (should persist between renders)
  // NOTE: It is especially important that it not unmount when using the KTX2 loader
  const gl = useThree((state) => state.gl)
  const textures = useLoaderWithDispose(
    KTX2Loader,
    IsObject(input) ? Object.values(input) : (input),
    (loader) => {
      loader.detectSupport(gl)
      loader.setTranscoderPath(basisPath)
    }
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useLayoutEffect(() => { onLoad?.(textures) }, [onLoad])

  // https://github.com/mrdoob/three.js/issues/22696
  // Upload the texture to the GPU immediately instead of waiting for the first render
  React.useEffect(() => {
    const array = Array.isArray(textures) ? textures : [textures]
    array.forEach(gl.initTexture)
  }, [gl, textures])

  // Support both arrays and 'keyed' objects
  if (IsObject(input)) {
    const keys = Object.keys(input)
    const keyed = {}
    keys.forEach((key) => Object.assign(keyed, { [key]: textures[keys.indexOf(key)] }))
    return keyed
  } else {
    return textures
  }
}

useKTX2WithOnLoad.preload = (input, basisPath) => {
  basisPath = basisPath || `${cdn}/basis/`
  useLoaderWithDispose.preload(KTX2Loader, input, loader => {
    loader.setTranscoderPath(basisPath)
  })
}

useKTX2WithOnLoad.clear = (input) => {
  useLoaderWithDispose.clear(KTX2Loader, input)
}

export function onKTX2Load (textures) {
  textures.forEach(texture => {
    texture.wrapS = texture.wrapT = RepeatWrapping
    texture.repeat.set(-1, 1)
  })
}
