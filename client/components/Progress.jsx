import React from 'react'
import { useProgress } from '@react-three/drei'

import StyledText from './StyledText.jsx'

export default function Progress () {
  useProgress()
  const statusString = 'Loading textures ... '
  const chars = 'Loadingtexures. '
  return (
    <>
      <StyledText position={[0, 0, -100]} characters={chars}>{statusString}</StyledText>
      <StyledText position={[0, 0, 100]} rotation-y={Math.PI} characters={chars}>{statusString}</StyledText>
      <StyledText position={[-100, 0, 0]} rotation-y={Math.PI / 2} characters={chars}>{statusString}</StyledText>
      <StyledText position={[100, 0, 0]} rotation-y={-Math.PI / 2} characters={chars}>{statusString}</StyledText>
    </>
  )
}
