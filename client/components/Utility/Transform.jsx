import React from 'react'
import PropTypes from 'prop-types'

import { MathUtils } from 'three'

// Object for storing Transformation data for R3F
export class TransformData {
  constructor ({ longitude, latitude, shift, width, height, elevation, distance, radius, scale, rotation, alignment, isHotSpot }) {
    // Location information
    this.longitude = longitude ?? 0
    this.latitude = latitude ?? 0

    this.shift = shift ?? 0
    this.elevation = elevation ?? 0
    this.distance = distance ?? 0

    this.width = width ?? 1
    this.height = height ?? 1

    if (isHotSpot) {
      this.distance = -(radius ?? 5)
    }

    this.scale = scale ?? (isHotSpot ? 0.5 : 1.0)
    this.rotation = rotation ?? [0, 0, 0]
    this.alignment = alignment ?? [0, 0, 0]
  }
}

export default function Transform (props) {
  const { children, transform, ...rest } = props

  return (
    <group
      rotation-y={MathUtils.degToRad(transform.longitude)}
      {...rest}
    >
      <group rotation-x={MathUtils.degToRad(transform.latitude)}>
        <group
          position={[transform.shift, transform.elevation, transform.distance]}
          scale={[transform.width * transform.scale, transform.height * transform.scale, transform.scale]}
          rotation-x={transform.rotation[0] + MathUtils.degToRad(transform.alignment[0])}
          rotation-y={transform.rotation[1] + MathUtils.degToRad(transform.alignment[1])}
          rotation-z={transform.rotation[2] + MathUtils.degToRad(transform.alignment[2])}
        >
          {children}
        </group>
      </group>
    </group>
  )
}

Transform.propTypes = {
  transform: PropTypes.instanceOf(TransformData),
  children: PropTypes.node.isRequired
}

Transform.defaultProps = {
  transform: new TransformData({})
}
