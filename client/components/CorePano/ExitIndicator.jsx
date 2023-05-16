import React from 'react'
import PropTypes from 'prop-types'

import CONFIG from '../../config.js'

import { nextPanoKeyState } from '../../state/fullTourState.js'
import { exitDirectionState, transitionStartedState } from '../../state/transitionState.js'
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil'

import { useLoader, useGraph } from '@react-three/fiber'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

import { useSpring, animated } from '@react-spring/three'
import { Edges, Text } from '@react-three/drei'

import Transform, { TransformData } from '../Utility/Transform.jsx'

// Different object parameters
const OBJ_DATA = () => ({
  arrow: {
    filename: `${CONFIG().GEOMETRY_FILE_PATH}/arrow.obj`,
    rotation: [Math.PI / 2.0, 0, Math.PI]
  },
  teleport: {
    filename: `${CONFIG().GEOMETRY_FILE_PATH}/teleportNoArrow.obj`,
    rotation: [0, 0, 0]
  },
  door: {
    filename: `${CONFIG().GEOMETRY_FILE_PATH}/door.obj`,
    rotation: [0, 0, 0]
  },
  stairsUp: {
    filename: `${CONFIG().GEOMETRY_FILE_PATH}/stairsUp.obj`,
    rotation: [0, 0, 0]
  },
  stairsDown: {
    filename: `${CONFIG().GEOMETRY_FILE_PATH}/stairsDown.obj`,
    rotation: [0, 0, 0]
  }
})

// Various colors for the texture loading state
// const LOADING_COLOR = 0x777777 (not currently in use)
const LOADED_COLOR = 0x156289
const HIGHLIGHT_COLOR = 0x23A0FF
// const FAILED_COLOR = 0x883333 (not currently in use)
// 21 98 137
// 35 160 255

export default function ExitIndicator (props) {
  // Destructure props
  const { type, caption, shift, elevation, distance, direction, alignment, destination, ...rest } = props

  // Setup to update global state
  const setExitDirection = useSetRecoilState(exitDirectionState)
  const [nextPanoKey, setNextPanoKey] = useRecoilState(nextPanoKeyState)
  const transitionStarted = useRecoilValue(transitionStartedState)

  // Track first render
  const [firstRender, setFirstRender] = React.useState(true)
  React.useEffect(() => { setFirstRender(false) }, [])

  // Track hovering and enabled state
  const [hovering, setHovering] = React.useState(false)
  const [enabled, setEnabled] = React.useState(!transitionStarted)

  // Show pointer cursor when hovered and enabled
  React.useEffect(() => {
    if (enabled) {
      document.body.style.cursor = hovering ? 'pointer' : 'auto'
    }
    return () => { document.body.style.cursor = 'auto' }
  }, [hovering, enabled])

  // Animated values
  const hoverSpring = useSpring({
    scale: hovering ? 1 : 0.75,
    opacity: hovering && enabled ? 1 : 0.0
  })

  const fadeSpring = useSpring({
    opacity: firstRender || nextPanoKey !== '' ? 0 : 1.0,
    onStart: () => { setEnabled(false) },
    onRest: () => { setEnabled(!transitionStarted) }
  })

  // Click callback function
  const onClick = React.useCallback(() => {
    if (enabled) {
      setExitDirection(direction)
      setNextPanoKey(destination)
      setEnabled(false)
    }
  }, [destination, direction, enabled, setExitDirection, setNextPanoKey])

  // Pick the geometry and build the transform object
  const objInfo = OBJ_DATA()[type]
  const transformData = new TransformData({ shift, elevation, distance, direction, alignment, rotation: objInfo.rotation })

  // Load the geometry and clone our own instance
  const loadedObj = useLoader(OBJLoader, objInfo.filename)
  const { nodes } = useGraph(loadedObj.clone())

  // Build unique sub-meshes for all the loaded objects
  const meshes = Object.keys(nodes).map((meshName) => (
    <animated.mesh scale={hoverSpring.scale} key={`${meshName}-mesh`} geometry={nodes[meshName].geometry}>
      <animated.meshPhongMaterial color={LOADED_COLOR} opacity={fadeSpring.opacity} transparent />
      <Edges threshold={15}>
        <animated.lineBasicMaterial
          color={HIGHLIGHT_COLOR}
          opacity={fadeSpring.opacity}
          polygonOffset
          polygonOffsetFactor={1}
          transparent
        />
      </Edges>
    </animated.mesh>
  ))

  // Pack in groups to position in the scene
  return (
    <Transform
      transform={transformData}
      onClick={onClick}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      {...rest}
    >
      {meshes}
      {caption !== '' &&
        <Text
          position={[0, -1.5, 0]}
          scale={[0.033, 0.033, 0.033]}
          rotation-y={Math.PI / 2.0}
          color={'#000000'}
          fontSize={12}
          lineHeight={1}
          letterSpacing={0.02}
          textAlign={'center'}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.5}
          outlineColor="#ffffff"
          {...rest}
        >
          <animated.meshBasicMaterial
            attach="material"
            opacity={hoverSpring.opacity}
            transparent
          />
          {caption}
        </Text>}
    </Transform>
  )
}

ExitIndicator.propTypes = {
  type: PropTypes.oneOf(['arrow', 'teleport', 'door', 'stairsUp', 'stairsDown']),
  caption: PropTypes.string,
  shift: PropTypes.number,
  elevation: PropTypes.number,
  distance: PropTypes.number,
  direction: PropTypes.number,
  alignment: PropTypes.arrayOf(PropTypes.number),
  destination: PropTypes.string
}

ExitIndicator.defaultProps = {
  type: 'arrow',
  caption: '',
  shift: 0,
  elevation: -2.5,
  distance: 5,
  direction: 0,
  alignment: [0, 0, 0],
  destination: ''
}
