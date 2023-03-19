import React from 'react'
import PropTypes from 'prop-types'

import { currentPanoDataState, currentPanoKeyState, nextPanoKeyState, panoTextureFilesState } from '../../state/fullTourState.js'
import { endTransitionState, transitionStartedState, transitionCompleteState, exitDirectionState } from '../../state/transitionState.js'
import { panoMediaPlayingState, loadingCurtainState } from '../../state/globalState.js'
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil'

import { Euler, MathUtils, BackSide } from 'three'
import { useSpring, animated, config } from '@react-spring/three'
import { useFrame, useThree } from '@react-three/fiber'

import { NO_CROP, useVideoSource } from '../../state/videoHelper.js'
import CutoutMaterial, { CutoutShaderInfo } from '../../shaders/CutoutShader.js'
import { useKTX2WithOnLoad, onKTX2Load } from '../Utility/useKTX2WithOnLoad.js'

const AnimCutoutMaterial = animated(props => <cutoutMaterial {...props} />)

export default function PanoSphere (props) {
  const { onVideoUpdate, ...rest } = props

  // Subscribe to global state
  const panoTextureFiles = useRecoilValue(panoTextureFilesState)
  const currentPanoData = useRecoilValue(currentPanoDataState)
  const setCurrentPanoKey = useSetRecoilState(currentPanoKeyState)
  const [nextPanoKey, setNextPanoKey] = useRecoilState(nextPanoKeyState)
  const panoMediaPlaying = useRecoilValue(panoMediaPlayingState)
  const [loadingCurtain, setLoadingCurtain] = useRecoilState(loadingCurtainState)

  // Subscribe to changes in transition state
  const exitDirection = useRecoilValue(exitDirectionState)
  const endTransition = useSetRecoilState(endTransitionState)
  const transitionStarted = useRecoilValue(transitionStartedState)
  const transitionComplete = useRecoilValue(transitionCompleteState)

  // Compute direction in cartesian coordinates
  const direction = [
    Math.sin(MathUtils.degToRad(exitDirection)),
    Math.cos(MathUtils.degToRad(exitDirection))
  ]

  // Load the KTX2 texture files
  const textureRefs = useKTX2WithOnLoad(panoTextureFiles, onKTX2Load)
  const texture = currentPanoData?.key ? textureRefs[currentPanoData.key] : null

  // Setup animation springs
  const springs = useSpring({
    opacity: transitionStarted ? 0.0 : 1.0,
    offset: transitionStarted
      ? [-300.0 * direction[0], 0.0, -300.0 * direction[1]]
      : [0.0, 0.0, 0.0],
    immediate: nextPanoKey === '',
    config: config.default
  })

  // Swap out spheres once the textures are loaded
  React.useEffect(() => {
    if (transitionStarted && transitionComplete) {
      if (currentPanoData?.key !== nextPanoKey) {
        setCurrentPanoKey(nextPanoKey)
      } else {
        setNextPanoKey('')
        endTransition()
      }
    } // blah

    // Make sure the loading curtain is open
    if (!loadingCurtain.open) {
      setLoadingCurtain({ ...loadingCurtain, open: true })
    }
  }, [currentPanoData?.key, endTransition, loadingCurtain, nextPanoKey, setCurrentPanoKey, setLoadingCurtain, setNextPanoKey, transitionComplete, transitionStarted])

  // Possibly load video and make it part of the Three.js state
  const [panoVideo, videoCrop] = useVideoSource(currentPanoData)
  const [setThree, resolution] = useThree((state) => [state.set, state.size])
  React.useEffect(() => {
    setThree({ videoRef: panoVideo })
  }, [panoVideo, setThree])

  // Pass playback time and current time to the shader
  const panoMesh = React.useRef()
  useFrame(({ videoRef }) => {
    // Sync playback time with video
    panoMesh.current.material.uniforms.playbackTime.value = videoRef?.currentTime || 0.0
    if (onVideoUpdate) {
      onVideoUpdate(videoRef?.currentTime || 0.0)
    }

    // Set time to the number of seconds since the last minute
    panoMesh.current.material.uniforms.time.value = (
      (Date.now() / 1000) - (Math.floor(Date.now() / 60000) * 60)
    )
  })

  // Is there a video to show and is it playing
  const showVideo = !!panoVideo && panoMediaPlaying

  return (
    <React.Fragment>
      {/* The main pano image sphere geometry and shader */}
      <animated.mesh
        ref={panoMesh}
        scale={[-1, 1, 1]} // Deliberately turning this inside-out
        rotation={new Euler(
          MathUtils.degToRad(currentPanoData?.alignment[0] ?? 0),
          MathUtils.degToRad(currentPanoData?.alignment[1] ?? 0),
          MathUtils.degToRad(currentPanoData?.alignment[2] ?? 0)
        )}
        position={springs.offset}
        {...rest}
      >
        {/* Spherical geometry for the pano */}
        <icosahedronGeometry args={[500, 50]} />

        {/* Basic solid material with wireframe */}
        <animated.meshBasicMaterial
          color="#FFFFFF"
          map={texture}
          side={BackSide}
          opacity={springs.opacity}
          transparent
        />

        {/* Custom shader with pano texture and optional pinned video */}
        <AnimCutoutMaterial
          key={CutoutMaterial.key}
          side={BackSide}
          resolution={[resolution.width, resolution.height, 0]}
          cropBox={showVideo ? videoCrop : NO_CROP}
          videoMode={showVideo ? CutoutShaderInfo[currentPanoData?.video?.mode ?? 'VIDEO_DISABLED'] : CutoutShaderInfo.VIDEO_DISABLED}
          playbackDuration={panoVideo?.duration || 0.0}
          chromaKeyColor={
            currentPanoData?.video?.chromaKeyColor || CutoutShaderInfo.uniforms.chromaKeyColor
          }
          chromaKeyWeights={
            currentPanoData?.video?.chromaKeyWeights || CutoutShaderInfo.uniforms.chromaKeyWeights
          }
          fadeTime={currentPanoData?.video?.fadeTime || undefined}
          opacity={springs.opacity}
          transparent
        >
          {showVideo && <videoTexture attach="panoVideo" args={[panoVideo]}/>}
          <primitive attach="panoImage" object={texture || null}/>
        </AnimCutoutMaterial>

      </animated.mesh>
    </React.Fragment>
  )
}

PanoSphere.propTypes = {
  onVideoUpdate: PropTypes.func
}

PanoSphere.defaultProps = {
  onVideoUpdate: null
}
