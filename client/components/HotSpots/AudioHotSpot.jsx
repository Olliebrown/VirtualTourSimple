import React from 'react'
import PropTypes from 'prop-types'

import localDB, { updateSetting } from '../../state/localDB.js'
import { useLiveQuery } from 'dexie-react-hooks'

// Graphics
import { MathUtils } from 'three'
import { useSpring, animated } from '@react-spring/three'
import { useTexture } from '@react-three/drei'

// Audio
import { Howl } from 'howler'

// URL for the audio hot spot icon
const ICON_URL = 'icons/volumeUpIcon.png'

export default function AudioHotSpot (props) {
  // Destructure props
  const { label, href, lon, lat, ...rest } = props

  // Subscribe to pieces of global state
  const mediaPlaying = useLiveQuery(() => localDB.settings.get('mediaPlaying'))?.value || false

  // Track state
  const [hovering, setHovering] = React.useState(false)
  const [audioObj, setAudioObj] = React.useState(null)

  // Click callback function
  const onClick = () => {
    console.log(`Audio Hot-Spot "${label}" Clicked`)
    if (!mediaPlaying) {
      console.log('Playing')
      updateSetting('mediaPlaying', true)
      audioObj?.play()
    } else {
      audioObj?.pause()
      updateSetting('mediaPlaying', false)
    }
  }

  // Load the icon texture
  const audioIconTexture = useTexture(ICON_URL)

  // Animated values
  const springs = useSpring({ scale: hovering ? 1 : 0.5 })

  // Possibly load a video
  React.useEffect(() => {
    if (href) {
      if (audioObj === null) {
        // Create audio sound using howler
        console.log(`Loading audio "${href}"`)
        const newSound = new Howl({
          html5: true,
          src: [`${href}.webm`, `${href}.mp3`, `${href}.ac3`, `${href}.m4a`, `${href}.wav`],
          onend: () => updateSetting('mediaPlaying', false)
        })
        setAudioObj(newSound)
      }

      // Clean up when the user leaves this pano
      return () => {
        // Stop streaming media and remove tag
        if (audioObj !== null) {
          audioObj.stop()
        }

        // Reset video state
        updateSetting('mediaPlaying', false)
      }
    } else {
      updateSetting('mediaPlaying', false)
    }
  }, [audioObj, href])

  // Pack in groups to position in the scene
  return (
    <group
      rotation-y={MathUtils.degToRad(lon)}
      {...rest}
      onClick={onClick}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
    >
      <group rotation-x={MathUtils.degToRad(lat)}>
        <animated.mesh scale={springs.scale} position={[0, 0, -5]}>
          <planeBufferGeometry />
          <meshPhongMaterial color={0xFFFFFF} map={audioIconTexture} flatShading transparent />
        </animated.mesh>
      </group>
    </group>
  )
}

AudioHotSpot.propTypes = {
  label: PropTypes.string,
  href: PropTypes.string,
  lon: PropTypes.number,
  lat: PropTypes.number
}

AudioHotSpot.defaultProps = {
  label: 'N/A',
  href: '',
  lon: 0,
  lat: 0
}
