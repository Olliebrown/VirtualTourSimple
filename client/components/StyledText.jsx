import React from 'react'
import PropTypes from 'prop-types'
import { Text } from '@react-three/drei'

export default function StyledText (props) {
  const { children, ...rest } = props
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
      {...rest}
    >
      {children}
    </Text>
  )
}

StyledText.propTypes = {
  children: PropTypes.node.isRequired
}
