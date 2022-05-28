import { extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'

const CutoutShaderInfo = {
  uniforms: {
    panoImage: undefined,
    panoVideo: undefined,
    cropBox: [0.0, 0.0, 1.0, 1.0]
  },

  vertexShader: /* glsl */`
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: /* glsl */`
    varying vec2 vUv;

    uniform vec4 cropBox;
    uniform sampler2D panoImage;
    uniform sampler2D panoVideo;

    // Test if a point is within the given bounding box
    // p: The point to test
    // BBox: the bounding box as [xMin, yMin, xMax, yMax]
    bool pointInBBox (vec2 p, vec4 BBox) {
      return (p.x >= BBox.x && p.x <= BBox.z && p.y >= BBox.y && p.y <= BBox.w);
    }

    void main() {
      if (pointInBBox(vec2(vUv.x, 1.0 - vUv.y), cropBox)) {
        // Show video inside the box
        vec2 vidUV = vec2(
          (vUv.x - cropBox.x) / (cropBox.z - cropBox.x),
          1.0 - ((1.0 - vUv.y) - cropBox.y) / (cropBox.w - cropBox.y)
        );
        gl_FragColor = vec4(texture2D(panoVideo, vidUV).rgb, 1.0);
        // gl_FragColor = vec4(vidUV, 0.0, 1.0);
      } else {
        // Show image outside the box
        gl_FragColor = vec4(texture2D(panoImage, vUv).rgb, 1.0);
      }
      #include <tonemapping_fragment>
      #include <encodings_fragment>
    }
  `
}

const CutoutMaterial = shaderMaterial(
  CutoutShaderInfo.uniforms,
  CutoutShaderInfo.vertexShader,
  CutoutShaderInfo.fragmentShader
)

extend({ CutoutMaterial })
export default CutoutMaterial
