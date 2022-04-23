import { Vector4, Texture } from 'three'
import { frag, vert } from '../glslLiterals.js'

const CutoutShader = {
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

      if (uv.x < vCropBox.x || uv.y < vCropBox.y || uv.x > vCropBox.z || uv.y > vCropBox.w) {
        gl_FragColor = texture2D(tPanoImage, uv);;
      } else {
        gl_FragColor = texture2D(tPanoVideo, uv);;
      }
    }
  `,

  uniforms: {
    tPanoImage: { value: new Texture() },
    tPanoVideo: { value: new Texture() },
    vCropBox: { value: new Vector4(0.0, 0.0, 1.0, 1.0) }
  }
}

export { CutoutShader }
