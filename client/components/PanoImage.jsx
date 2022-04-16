import React, { useState } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader, MathUtils } from 'three'

export default function PanoImage (props) {
  // Local rendering state
  const [interact, setInteract] = useState({
    isUserInteracting: false,
    onPointerDownMouseX: 0,
    onPointerDownMouseY: 0,
    onPointerDownLon: 0,
    onPointerDownLat: 0,
    lon: 0,
    lat: 0
  })

  // Mouse interaction
  const onPointerDown = (event) => {
    if (event.isPrimary === false) return

    setInteract({
      ...interact,
      isUserInteracting: true,
      onPointerDownMouseX: event.clientX,
      onPointerDownMouseY: event.clientY,
      onPointerDownLon: interact.lon,
      onPointerDownLat: interact.lat
    })
  }

  const onPointerMove = (event) => {
    if (event.isPrimary === false) return

    setInteract({
      ...interact,
      lon: (interact.onPointerDownMouseX - event.clientX) * 0.1 + interact.onPointerDownLon,
      lat: (event.clientY - interact.onPointerDownMouseY) * 0.1 + interact.onPointerDownLat
    })
  }

  const onPointerUp = (event) => {
    if (event.isPrimary === false) return

    setInteract({
      ...interact,
      isUserInteracting: false
    })
  }

  // const onDocumentMouseWheel = (event) => {
  //   setInteract({
  //     ...interact,
  //     wheelDelta: event.deltaY
  //   })
  // }

  // Load the pano image
  const panoImageTexture = useLoader(TextureLoader, 'media/panoImg/IMG_20220401_091556_00_merged.jpg')

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    // Pre-compute some math values
    const clampedLat = Math.max(-85, Math.min(85, interact.lat))
    const phi = MathUtils.degToRad(90 - clampedLat)
    const theta = MathUtils.degToRad(interact.lon)

    // Determine look-at coordinates
    const x = 500 * Math.sin(phi) * Math.cos(theta)
    const y = 500 * Math.cos(phi)
    const z = 500 * Math.sin(phi) * Math.sin(theta)

    // Update camera view
    state.camera.lookAt(x, y, z)

    // Change FOV?
    // if (interact.deltaY !== 0) {
    //   const fov = state.camera.fov + interact.deltaY * 0.05
    //   state.camera.fov = MathUtils.clamp(fov, 10, 75)
    //   state.camera.updateProjectionMatrix()
    // }
  })

  return (
    <mesh
      {...props}
      scale={[-1, 1, 1]}
      onPointerMove={interact.isUserInteracting ? onPointerMove : null}
      onPointerDown={onPointerDown}
      onPointerUp={interact.isUserInteracting ? onPointerUp : null}
    >
      <sphereGeometry args={[500, 60, 40]} />
      <meshStandardMaterial map={panoImageTexture} />
    </mesh>
  )
}
