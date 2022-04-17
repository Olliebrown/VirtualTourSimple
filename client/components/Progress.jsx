import React from 'react'
import { useProgress } from '@react-three/drei'

import StyledText from './StyledText.jsx'

export default function Progress () {
  const { progress, loaded, total } = useProgress()
  return (
    <StyledText position={[0, 0, -100]} characters=" loaded()/.0123456789%">
      {`${progress.toFixed(0)}% Loaded (${loaded}/${total})`}
    </StyledText>
  )
}
