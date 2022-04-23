import { Texture } from 'three'
import { extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'

import { frag, vert } from './glslLiterals.js'

const CutoutShaderInfo = {
  vertexShader: vert`
    varying vec2 vUv;

    void main() {
      vUv = uv;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: frag`
    varying vec2 vUv;

    uniform vec4 vCropBox;
    uniform sampler2D tPanoVideo;
    uniform sampler2D tPanoImage;

    void main() {
      vec2 uv = vUv;
      gl_FragColor = vec4(uv.xy, 0.0, 1.0);
      // if (uv.x < vCropBox.x || uv.y < vCropBox.y || uv.x > vCropBox.z || uv.y > vCropBox.w) {
      //   gl_FragColor = texture2D(tPanoImage, uv);;
      // } else {
      //   gl_FragColor = texture2D(tPanoVideo, uv);;
      // }
    }
  `,

  uniforms: {
    tPanoImage: { value: new Texture() },
    tPanoVideo: { value: new Texture() },
    vCropBox: { value: [0.0, 0.0, 1.0, 1.0] }
  }
}

const CutoutMaterial = shaderMaterial(
  CutoutShaderInfo.uniforms,
  CutoutShaderInfo.vertexShader,
  CutoutShaderInfo.fragmentShader
)

extend({ CutoutMaterial })

export { CutoutMaterial }
