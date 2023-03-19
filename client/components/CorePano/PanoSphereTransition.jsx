import React from 'react'

import { nextPanoDataState, panoImagePath } from '../../state/fullTourState.js'
import { transitionCompleteState, startTransitionState, exitDirectionState } from '../../state/transitionState.js'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { Euler, MathUtils, BackSide } from 'three'

import { config, useSpring, animated } from '@react-spring/three'
import { useKTX2WithOnLoad, onKTX2Load } from '../Utility/useKTX2WithOnLoad.js'

export default function PanoSphereTransition (props) {
  // Subscribe to global state
  const nextPanoData = useRecoilValue(nextPanoDataState)
  const setTransitionComplete = useSetRecoilState(transitionCompleteState)
  const startTransition = useSetRecoilState(startTransitionState)
  const exitDirection = useRecoilValue(exitDirectionState)

  const direction = [
    Math.sin(MathUtils.degToRad(exitDirection)),
    Math.cos(MathUtils.degToRad(exitDirection))
  ]

  // Retrieve the texture file reference (should already be cached and configured)
  const nextTexture = panoImagePath(nextPanoData?.key)
  const texture = useKTX2WithOnLoad(nextTexture, onKTX2Load)

  const [firstRender, setFirstRender] = React.useState(true)
  React.useEffect(() => { setFirstRender(false) }, [])

  // Setup animation springs
  const springs = useSpring({
    opacity: firstRender ? 0.0 : 1.0,
    offset: firstRender
      ? [300.0 * direction[0], 0.0, 300.0 * direction[1]]
      : [0.0, 0.0, 0.0],
    onStart: () => startTransition(),
    onRest: () => setTransitionComplete(true),
    config: config.default
  })

  return (
    <React.Fragment>
      {/* The main pano image sphere geometry and shader */}
      <animated.mesh
        scale={[-1, 1, 1]} // Deliberately turning this inside-out
        rotation={new Euler(
          MathUtils.degToRad(nextPanoData?.alignment[0] ?? 0),
          MathUtils.degToRad(nextPanoData?.alignment[1] ?? 0),
          MathUtils.degToRad(nextPanoData?.alignment[2] ?? 0)
        )}
        position={springs.offset}
        {...props}
      >
        {/* Spherical geometry for the pano */}
        <icosahedronGeometry args={[500, 50]} />

        {/* Basic solid material with wireframe */}
        <animated.meshBasicMaterial
          color="#FFFFFF"
          map={texture}
          side={BackSide}
          polygonOffset
          polygonOffsetFactor={2}
          polygonOffsetUnits={5}
          opacity={springs.opacity}
          transparent
        />

      </animated.mesh>
    </React.Fragment>
  )
}
