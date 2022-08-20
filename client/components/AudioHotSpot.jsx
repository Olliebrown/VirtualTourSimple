import React from 'react'
import PropTypes from 'prop-types'

// Declarative State
import useStore from '../state/useStore.js'

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
  const { label, href, longitude, latitude, ...rest } = props

  // Track state
  const [hovering, setHovering] = React.useState(false)
  const [audioObj, setAudioObj] = React.useState(null)

  // Subscribe to pieces of global state
  const { setMediaPlaying, mediaPlaying } = useStore(state => ({
    setMediaPlaying: state.setMediaPlaying,
    mediaPlaying: state.mediaPlaying
  }))

  // Click callback function
  const onClick = () => {
    console.log(`Audio Hot-Spot "${label}" Clicked`)
    if (!mediaPlaying) {
      setMediaPlaying(true)
      audioObj.play()
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
        const newSound = new Howl({
          html5: true,
          src: [`${href}.ogg`, `${href}.mp3`, `${href}.wav`],
          onend: () => setMediaPlaying(false)
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
        setMediaPlaying(false)
      }
    } else {
      setMediaPlaying(false)
    }
  }, [audioObj, href, setMediaPlaying])

  // Don't render while the audio is playing
  if (mediaPlaying) { return null }

  // Pack in groups to position in the scene
  return (
    <group
      rotation-y={MathUtils.degToRad(longitude)}
      {...rest}
      onClick={onClick}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
    >
      <group rotation-x={MathUtils.degToRad(latitude)}>
        <animated.sprite scale={springs.scale}>
          <spriteMaterial map={audioIconTexture} />
        </animated.sprite>
      </group>
    </group>
  )
}

AudioHotSpot.propTypes = {
  label: PropTypes.string,
  href: PropTypes.string,
  longitude: PropTypes.number,
  latitude: PropTypes.number
}

AudioHotSpot.defaultProps = {
  label: 'N/A',
  href: '',
  longitude: 0,
  latitude: 0
}
