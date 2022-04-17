import React from 'react'
import { BackSide } from 'three'

import StyledText from './StyledText.jsx'

export default function PanoGrid (props) {
  return (
    <>
      {/* Cube with 10deg grid lines */}
      <mesh {...props} scale={[-1, 1, 1]}>
        <boxGeometry args={[400, 400, 400, 9, 9, 9]} />
        <meshBasicMaterial color={0x000000} side={BackSide} wireframe />
      </mesh>

      {/* Compass direction letters */}
      <StyledText position={[0, 0, -100]} characters="NSEW">{'N'}</StyledText>
      <StyledText position={[0, 0, 100]} rotation-y={180} characters="NSEW">{'S'}</StyledText>
      <StyledText position={[100, 0, 0]} rotation-y={-90} characters="NSEW">{'E'}</StyledText>
      <StyledText position={[-100, 0, 0]} rotation-y={90} characters="NSEW">{'W'}</StyledText>
    </>
  )
}
