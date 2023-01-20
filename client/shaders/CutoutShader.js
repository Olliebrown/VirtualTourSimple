import { extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'

const CutoutShaderInfo = {
  uniforms: {
    panoImage: undefined,
    panoVideo: undefined,
    enableVideo: false,
    playbackTime: 0.0,
    playbackDuration: 0.0,
    fadeTime: 0.5,
    chromaKeyColor: [0.157, 0.576, 0.129],
    chromaKeyWeights: [4.0, 1.0, 2.0],
    vidGamma: 1.0,
    imgGamma: 1.8,
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

    uniform float vidGamma;
    uniform float imgGamma;

    uniform vec4 cropBox;
    uniform sampler2D panoImage;
    uniform sampler2D panoVideo;
    uniform bool enableVideo;

    uniform vec3 chromaKeyColor;
    uniform vec3 chromaKeyWeights;

    uniform float playbackTime;
    uniform float playbackDuration;
    uniform float fadeTime;

    // Convert between color spaces
    vec3 rgb2hsv(vec3 rgb)
    {
      // Find max and min color channels and their difference
      float Cmax = max(rgb.r, max(rgb.g, rgb.b));
      float Cmin = min(rgb.r, min(rgb.g, rgb.b));
      float delta = Cmax - Cmin;

      // Value -> max
      vec3 hsv = vec3(0.0, 0.0, Cmax);

      // Is this a neutral color? (saturation = 0)
      if (Cmax > Cmin) {
        // Saturation is difference over max
        hsv.y = delta / Cmax;

        // Hue depends on color wheel position (r -> g -> b)
        if (rgb.r == Cmax) {
          hsv.x = (rgb.g - rgb.b) / delta;
        } else {
          if (rgb.g == Cmax) {
            hsv.x = 2.0 + (rgb.b - rgb.r) / delta;
          } else {
            hsv.x = 4.0 + (rgb.r - rgb.g) / delta;
          }
        }

        // Scale hue
        hsv.x = fract(hsv.x / 6.0);
      }
      return hsv;
    }

    // Detect and remove the chroma-key color
    float chromaKey(vec3 color)
    {
      vec3 hsv = rgb2hsv(color);
      vec3 target = rgb2hsv(chromaKeyColor);
      float dist = length(chromaKeyWeights * (target - hsv));
      return 1.0 - clamp(3.0 * dist - 1.5, 0.0, 1.0);
    }

    // Test if a point is within the given bounding box
    // p: The point to test
    // BBox: the bounding box as [xMin, yMin, xMax, yMax]
    bool pointInBBox (vec2 p, vec4 BBox) {
      return (p.x >= BBox.x && p.x <= BBox.z && p.y >= BBox.y && p.y <= BBox.w);
    }

    void main() {
      // Initial values to use if no video is present (or outside the video crop box)
      float blendAlpha = 1.0;
      float fadeValue = 1.0;
      vec3 vidColor = vec3(0.0);

      // Lookup pano image color
      vec3 texColor = texture2D(panoImage, vec2(1.0 - vUv.x, vUv.y)).rgb;

      // Possibly lookup video color (when defined and inside the crop box)
      if (enableVideo && playbackTime > 0.1 && pointInBBox(vec2(vUv.x, 1.0 - vUv.y), cropBox)) {
        vec2 vidUV = vec2(
          1.0 - (vUv.x - cropBox.x) / (cropBox.z - cropBox.x),
          ((1.0 - vUv.y) - cropBox.y) / (cropBox.w - cropBox.y)
        );

        // Check for chroma-key color to blend
        vidColor = texture2D(panoVideo, vidUV).rgb;
        blendAlpha = chromaKey(vidColor);

        // Fade video in or out
        fadeValue = 1.0 - min(
          clamp(playbackTime / fadeTime, 0.0, 1.0), // Fade in
          clamp((playbackDuration - playbackTime) / fadeTime, 0.0, 1.0) // Fade out
        );
      }

      // Mix between pano and video based on chroma key and fadeValue
      vec3 finalColor = mix(
        pow(vidColor, vec3(1.0/vidGamma)),
        pow(texColor, vec3(1.0/imgGamma)),
        max(blendAlpha, fadeValue)
      );

      gl_FragColor = vec4(finalColor, 1.0);

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
