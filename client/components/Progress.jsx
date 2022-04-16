import React from 'react'
import { Text, useProgress } from '@react-three/drei'

export default function Progress () {
  const { progress, loaded, total } = useProgress()
  return (
    <Text
      color={'#000000'}
      fontSize={12}
      maxWidth={200}
      lineHeight={1}
      letterSpacing={0.02}
      textAlign={'center'}
      anchorX="center"
      anchorY="middle"
      outlineWidth={1}
      outlineColor="#ffffff"
      position={[0, 0, -100]}
      characters=" loaded()/.0123456789%"
    >
      {`${progress.toFixed(0)}% Loaded (${loaded}/${total})`}
    </Text>
  )
}
