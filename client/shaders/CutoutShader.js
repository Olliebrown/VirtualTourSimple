import { extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'

export const CutoutShaderInfo = {
  // Enumerations for video modes
  VIDEO_DISABLED: 0,
  VIDEO_SIDE_BY_SIDE: 1,
  VIDEO_HOLOGRAM: 2,

  uniforms: {
    resolution: [1, 1, 1],
    vidGamma: 0.45454545,
    imgGamma: 1.0,
    opacity: 1.0,

    cropBox: [0.0, 0.0, 1.0, 1.0],
    panoImage: undefined,
    panoVideo: undefined,
    videoMode: 0,

    chromaKeyColor: [13, 164, 37], // [40, 147, 48],
    playbackTime: 0.0,
    playbackDuration: 0.0,
    fadeTime: 0.5,

    time: 0.0
  },

  vertexShader: /* glsl */`
    varying vec2 vUv;

    void main() {
      // Copy UV coordinates and do standard projection of position
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: /* glsl */`
    // Define the different video modes
    #define DISABLED 0
    #define SIDE_BY_SIDE 1
    #define HOLOGRAM 2

    // Screen texture coordinates
    varying vec2 vUv;

    // Resolution of viewport + gamma correction and opacity values
    uniform vec3 resolution;
    uniform float vidGamma;
    uniform float imgGamma;
    uniform float opacity;

    // Crop box, textures, and video toggle
    uniform vec4 cropBox;
    uniform sampler2D panoImage;
    uniform sampler2D panoVideo;
    uniform int videoMode;

    // Green screen color plus time and fade values
    uniform vec3 chromaKeyColor;
    uniform float playbackTime;
    uniform float playbackDuration;
    uniform float fadeTime;

    // Elapsed time since shader was created
    uniform float time;

    // "Random function" Outputs 0.0 - 1.0
    float Ran (float t) {
      float p = fract(t * .1031);
      p *= p + 33.33;
      p *= p + p;
      return fract(p);
    }

    // "Random function" Outputs 0.0 or 1.0
    float RanStep (float t, float d, float a) {
      // use d as "delay" to hold the same value for d number of seconds
      float v = floor(t / d);
      float p = fract(v * .1031);
      p *= p + 33.33;
      p *= p + p;
      p = fract(p);
      return step(a,p);
    }

    // Creates horizontal and vertical stripes in the hologram
    float Hologram (vec2 uv) {
      // Small vertical lines (value 0.5 - 1.0)
      float verticalStripe = sin(uv.x * 600.0) * 0.25 + 0.75;

      // Wide horizontal lines (value 0.5 - 1.0), "randomly" enabled
      float horizontal = RanStep(time, 5.0, 0.4) * sin(6.0 * uv.y + time) * sin(uv.y * 20.0 + time * 5.0) * 0.25 + 0.75;

      // Show only the top part (above 0.95) with step function (output value 0.5 or 1.0)
      horizontal = smoothstep(0.94, 0.96, horizontal) * 0.5 + 0.5;

      // Multiply together vertical and horizontal values
      return verticalStripe * horizontal;
    }

    // Creates a bright border around the figure
    vec3 Glow (vec2 uv, vec3 GREEN) {
      // Delta should correspond to a number of "pixels"
      vec2 delta = 3.0 / resolution.xy;

      // Get positions in four directions
      vec2 upPos = vec2(uv.x, uv.y + delta.y);
      vec2 rightPos = vec2(uv.x + delta.x, uv.y);
      vec2 downPos = vec2(uv.x, uv.y - delta.y);
      vec2 leftPos = vec2(uv.x - delta.x, uv.y);

      // Read out color from points in all four directions
      // Calculate the difference against the green color (then sum all the differences)
      vec3 texCol = texture(panoVideo, upPos).rgb;
      float diff = length(texCol - GREEN);

      texCol = texture(panoVideo, rightPos).rgb;
      diff += length(texCol - GREEN);

      texCol = texture(panoVideo, downPos).rgb;
      diff += length(texCol - GREEN);

      texCol = texture(panoVideo, leftPos).rgb;
      diff += length(texCol - GREEN);

      // diff is almost 0 when it's all green,
      // between 0 and 2 in the edge,
      // and more than 2 right in the center of the figure

      // Pluck away the "center" part of the image
      // (ie where all four directions contain a color other than green)
      diff *= smoothstep(1.8, 1.3, diff);

      return vec3(diff);
    }

    // Creates horizontal disturbances
    vec2 Scramble(vec2 uv) {
      vec2 xy = vec2(uv.x + Ran(100.0 * uv.y) * 0.07 - 0.035, uv.y);
      return xy;
    }

    vec3 MaskGreen(vec2 st, vec2 backST) {
      // Avoid the last few columns of pixels
      st.x = clamp(st.x, 0.0, 0.95);

      // Activate disturbances on short sporadic occasions
      float tSc = RanStep(time, 0.3, 0.04);
      vec2 uv = tSc * st + (1.0 - tSc) * Scramble(st);

      // Read the rgb value of the texture at uv coordinate
      vec3 texCol = texture(panoVideo, uv).rgb;

      // A variant that becomes negative when green dominates
      float greenDiff = texCol.r + texCol.b - texCol.g;

      // Another variant that measures the "color-distance" to the green color
      float greenDiff2 = length(texCol - (chromaKeyColor / 255.0));

      // Create a smooth mask that is 0 for green and 1 for other colors
      float BORDER = 0.62; // Sort of the alpha value of the video??
      float greenMask = smoothstep(0.0, BORDER, greenDiff2);

      // Apply mask to the movie
      vec3 col = texCol * greenMask;
      // col = texCol * greenDiff2; // Alternative: mask variant (see above)
      // vec3 col = texCol * greenMask + texCol * greenDiff2; // Alternative: sum of both?

      // Use only the blue component for the shape
      col = col.rgb * vec3(0.95, 1.1, 1.3) * 2.5;

      // Add the Hologram effect
      col *= Hologram(uv);

      // Gamma correct video (or un-gamma correct)
      col = pow(col, vec3(1.0/vidGamma));

      // Read the background
      vec3 backCol = texture(panoImage, backST).rgb;
      // Alternative: Noisy moving background ??
      // vec2 st = uv*vec2(sin(uv.x + time),cos(uv.y + time));
      // vec3 backCol = texture(panoImage, st).rgb;

      // Create an inverted mask for the background
      backCol *= smoothstep(BORDER, 0.0, greenDiff2);

      // Add movie and background together
      col += pow(backCol, vec3(1.0/imgGamma));

      // Alternative approach ??
      // col = vec3(texCol.r, texCol.g*0.2, texCol.b);
      // col = vec3(1.0, 0.1, 1.0)*texCol;

      // Add a light, blurred border
      col += BORDER * Glow(uv, chromaKeyColor / 255.5);
      return col;
    }

    // Test if a point is within the given bounding box
    // p: The point to test
    // BBox: the bounding box as [xMin, yMin, xMax, yMax]
    bool pointInBBox (vec2 p, vec4 BBox) {
      return (p.x >= BBox.x && p.x <= BBox.z && p.y >= BBox.y && p.y <= BBox.w);
    }

    // Check UV coordinates against the bounding box, and wrap them if necessary
    // Returns an adjusted bounding box that may or may not contain the original coordinates
    vec4 wrapCoordinatesInX (vec2 UV, vec4 box) {
      vec4 wrappedBox = box;
      if (!pointInBBox(vec2(UV.x, 1.0 - UV.y), wrappedBox)) {
        wrappedBox = box - vec4(1.0, 0.0, 1.0, 0.0);
        if (!pointInBBox(vec2(UV.x, 1.0 - UV.y), wrappedBox)) {
          wrappedBox = box + vec4(1.0, 0.0, 1.0, 0.0);
        }
      }

      return wrappedBox;
    }

    // Rescale and invert the UV coordinates to match the pinned video
    vec2 adjustUVCoords (vec2 coords, vec4 box) {
      return vec2(
        1.0 - (coords.x - box.x) / (box.z - box.x),
        ((1.0 - coords.y) - box.y) / (box.w - box.y)
      );
    }

    // Use UV coordinates for a video where the color and alpha mask are side-by-side.
    // Returns the color and alpha recombined into a single vec4.
    vec4 videoSideBySide (vec2 UV) {
      // Cut the x-value in half, then compute the alpha coordinates
      UV.x *= 0.5;
      vec2 alphaUV = UV + vec2(0.5, 0.0);

      // Grab the base color and alpha values
      return vec4(
        texture2D(panoVideo, UV).rgb,
        1.0 - texture2D(panoVideo, alphaUV).g
      );
    }

    // Compute a fade value based on the current playback time
    float fadeInOrOut () {
      // Fade video in or out
      return 1.0 - min(
        clamp(playbackTime / fadeTime, 0.0, 1.0), // Fade in
        clamp((playbackDuration - playbackTime) / fadeTime, 0.0, 1.0) // Fade out
      );
    }

    void main() {
      // Initial values to use if no video is present (or outside the video crop box)
      float blendAlpha = 1.0;
      float fadeValue = 0.0;
      vec3 vidColor = vec3(0.0);

      // Possibly lookup video color (when defined and inside the crop box)
      if (videoMode > 0 && playbackTime > 0.1) {
        // Check crop box wrapping in x dimension
        vec4 wrappedBox = wrapCoordinatesInX(vUv, cropBox);

        // Did we find a valid crop box?
        if (pointInBBox(vec2(vUv.x, 1.0 - vUv.y), wrappedBox)) {
          // Fade video in or out
          fadeValue = fadeInOrOut();

          // Calculate the proper UV video texture coords
          vec2 vidUV = adjustUVCoords(vUv, wrappedBox);

          if (videoMode == HOLOGRAM) {
            vidColor = MaskGreen(vidUV, vec2(1.0 - vUv.x, vUv.y));
            blendAlpha = 0.0;
          } else {
            // Grab the video color and alpha for a side-by-side video
            vec4 colorWithAlpha = videoSideBySide(vidUV);
            vidColor = colorWithAlpha.rgb;
            blendAlpha = colorWithAlpha.a;
          }
        }
      }

      // Lookup pano image color
      vec3 texColor = texture2D(panoImage, vec2(1.0 - vUv.x, vUv.y)).rgb;

      // Mix between pano and video based on chroma key and fadeValue
      vec3 finalColor = mix(
        vidColor,
        pow(texColor, vec3(1.0/imgGamma)),
        max(blendAlpha, fadeValue)
      );

      gl_FragColor = vec4(finalColor, opacity);

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
