import React, { useState, useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import { MathUtils, DoubleSide } from 'three'

import HEATING_PLANT_IMAGE_LIST from './heatingPlantImages.js'

export default function PanoImage (props) {
  // Various mouse interaction values
  const [interact, setInteract] = useState({
    isUserInteracting: false,
    onPointerDownMouseX: 0,
    onPointerDownMouseY: 0,
    onPointerDownLon: 0,
    onPointerDownLat: 0
  })

  // Current viewing direction
  const [viewing, setViewing] = useState({ lon: 0, lat: 0, fov: 75 })

  // Mouse interaction callbacks
  const onPointerDown = (event) => {
    if (event.isPrimary === false) return

    setInteract({
      ...interact,
      isUserInteracting: true,
      onPointerDownMouseX: event.clientX,
      onPointerDownMouseY: event.clientY,
      onPointerDownLon: viewing.lon,
      onPointerDownLat: viewing.lat
    })
  }

  const onPointerMove = (event) => {
    if (event.isPrimary === false) return

    setViewing({
      ...viewing,
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

  const onMouseWheel = (event) => {
    if (event.isPrimary === false) return

    const fov = viewing.fov + event.deltaY * 0.05
    setViewing({
      ...viewing,
      fov: MathUtils.clamp(fov, 10, 90)
    })
  }

  // Update camera using proper state
  const getThree = useThree((state) => (state.get))
  useEffect(() => {
    // Pre-compute some math values
    const clampedLat = Math.max(-85, Math.min(85, viewing.lat))
    const phi = MathUtils.degToRad(90 - clampedLat)
    const theta = MathUtils.degToRad(viewing.lon)

    // Determine look-at coordinates
    const x = 500 * Math.sin(phi) * Math.cos(theta)
    const y = 500 * Math.cos(phi)
    const z = 500 * Math.sin(phi) * Math.sin(theta)

    // Get camera
    const camera = getThree().camera

    // Update camera view
    camera.lookAt(x, y, z)

    // Update camera fov
    camera.fov = viewing.fov
    camera.updateProjectionMatrix()
  }, [getThree, viewing.lon, viewing.lat, viewing.fov])

  // Load the pano image
  const panoImageTextures = useTexture(HEATING_PLANT_IMAGE_LIST)

  return (
    <mesh
      {...props}
      scale={[-1, 1, 1]}
      onPointerMove={interact.isUserInteracting ? onPointerMove : null}
      onPointerDown={onPointerDown}
      onPointerUp={interact.isUserInteracting ? onPointerUp : null}
      onWheel={onMouseWheel}
    >
      <sphereGeometry args={[500, 60, 40]} />
      <meshBasicMaterial color={0xffffff} map={panoImageTextures.image01} side={DoubleSide} />
    </mesh>
  )
}
