import React from 'react'
import PropTypes from 'prop-types'

import CONFIG from '../../config.js'

import { loadingCurtainState, panoMediaPlayingState } from '../../state/globalState.js'
import { currentPanoKeyState, currentPanoDataState } from '../../state/fullTourState.js'
import { setTextureLoadingState } from '../../state/textureLoadingState.js'
import { useRecoilValue, useSetRecoilState } from 'recoil'

import { useFrame, useThree } from '@react-three/fiber'
import { useKTX2 } from '@react-three/drei'
import { Euler, MathUtils, BackSide } from 'three'

import { NO_CROP, useVideoSource } from '../../state/videoHelper.js'

import CutoutMaterial, { CutoutShaderInfo } from '../../shaders/CutoutShader.js'

export default function PanoImage (props) {
  const { xRotate, yRotate, zRotate, exits, onVideoUpdate } = props

  // Subscribe to pano DB changes
  const currentPanoKey = useRecoilValue(currentPanoKeyState)
  const currentPanoData = useRecoilValue(currentPanoDataState)
  const panoMediaPlaying = useRecoilValue(panoMediaPlayingState)

  // Loading curtain state
  const setLoadingCurtain = useSetRecoilState(loadingCurtainState)

  // Load the base image texture
  const setTextureLoading = useSetRecoilState(setTextureLoadingState)

  // Create array of texture filenames
  const textureFiles = React.useMemo(() => ([
    `${CONFIG().PANO_IMAGE_PATH}/${currentPanoKey}_Left.ktx2`,
    // `${CONFIG().PANO_IMAGE_PATH}/${currentPanoKey}_Right.ktx2`,
    ...(exits.map(exit => `${CONFIG().PANO_IMAGE_PATH}/${exit.key}_Left.ktx2`))
    // ...(exits.map(exit => `${CONFIG().PANO_IMAGE_PATH}/${exit.key}_Right.ktx2`))
  ]), [exits, currentPanoKey])

  React.useEffect(() => {
    setTextureLoading(textureFiles)
  }, [setTextureLoading, textureFiles])
  const panoImages = useKTX2(textureFiles)

  React.useEffect(() => {
    setLoadingCurtain({ text: '', open: true })
  }, [setLoadingCurtain, panoImages])

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
      <mesh
        ref={panoMesh}
        scale={[-1, 1, 1]} // Deliberately turning this inside-out
        rotation={new Euler(
          MathUtils.degToRad(xRotate),
          MathUtils.degToRad(yRotate),
          MathUtils.degToRad(zRotate)
        )}
        {...props}
      >
        {/* Spherical geometry for the pano */}
        <icosahedronGeometry args={[500, 50]} />

        {/* Custom shader with pano texture and optional pinned video */}
        <cutoutMaterial
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
        >
          {showVideo && <videoTexture attach="panoVideo" args={[panoVideo]}/>}
          <primitive attach="panoImage" object={panoImages[0] || null}/>
        </cutoutMaterial>
      </mesh>
    </React.Fragment>
  )
}

PanoImage.propTypes = {
  xRotate: PropTypes.number,
  yRotate: PropTypes.number,
  zRotate: PropTypes.number,
  exits: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired
  })),
  onVideoUpdate: PropTypes.func
}

PanoImage.defaultProps = {
  xRotate: 0,
  yRotate: 0,
  zRotate: 0,
  exits: [],
  onVideoUpdate: null
}
