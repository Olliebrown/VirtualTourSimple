// Static global app configuration
import CONFIG, { updatePrefix } from './config.js'

// React.js v18 basic includes
import React from 'react'
import { createRoot } from 'react-dom/client'

// MUI Emotion styles custom cache
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'

// MUI custom theme management
import { ThemeProvider } from '@mui/system'
import { createTheme } from '@mui/material/styles'

// Installation of recoil state
import { RecoilRoot } from 'recoil'

// Main react elements
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from './components/Utility/ErrorFallback.jsx'
import VirtualTour from './VirtualTour.jsx'
import Curtain from './components/Utility/Curtain.jsx'

// Helper scripts for detecting motion control capabilities
import { installMotionHandler } from './motionControlsPermission.js'

// Some element ids for later lookup
export const EMOTION_ROOT_ID = 'virtualTourEmotionRoot'
export const SHADOW_ROOT_ID = 'virtualTourShadowDomReactRoot'

// Main entry point for attaching the permission events and rendering the tour
export function attachVirtualTour (permissionElement, rootRenderElement, {
  startingRoom, enableClose, disablePriority, enabledRooms, enabledHotSpots, textColor, backgroundColor, initialYaw, urlPrefix, autoStart, ...rest
}) {
  // Sanitize the HTML elements
  permissionElement = permissionElement ?? document.getElementById('virtualTourPermission')
  rootRenderElement = rootRenderElement ?? document.getElementById('virtualTourRoot')

  // Sanitize the options
  startingRoom = startingRoom || CONFIG().START_KEY
  enableClose = enableClose ?? false
  disablePriority = disablePriority ?? false
  enabledRooms = enabledRooms ?? []
  enabledHotSpots = enabledHotSpots ?? []
  textColor = textColor ?? 'black'
  backgroundColor = backgroundColor ?? 'lightgrey'
  initialYaw = initialYaw ?? 0
  urlPrefix = urlPrefix ?? ''

  // Log any unexpected options
  for (const param in rest) {
    console.warning(`Unknown virtual tour option: ${param}`)
  }

  // Update path prefix if needed
  updatePrefix(urlPrefix)

  // Initiate the React rendering
  const doRender = (allowMotion) => {
    if (_DEV_) console.log('Rendering the root react element ...')

    // Clean up some CSS in case this is an embedded tour
    rootRenderElement.scrollIntoView(true)
    document.body.style.overflow = 'hidden'

    // Attach using a shadow-dom to avoid style collisions
    let shadowContainer = rootRenderElement.shadowRoot
    if (!shadowContainer) {
      shadowContainer = rootRenderElement.attachShadow({ mode: 'open' })
    }

    // Build up the basic shadow DOM tree
    const emotionRoot = document.createElement('style')
    emotionRoot.id = EMOTION_ROOT_ID

    const shadowRootElement = document.createElement('div')
    shadowRootElement.id = SHADOW_ROOT_ID

    shadowContainer.appendChild(emotionRoot)
    shadowContainer.appendChild(shadowRootElement)

    // Make theme with proper portal root
    const shadowDOMTheme = createTheme({
      components: {
        MuiPopover: {
          defaultProps: {
            container: shadowRootElement
          }
        },
        MuiPopper: {
          defaultProps: {
            container: shadowRootElement
          }
        },
        MuiModal: {
          defaultProps: {
            container: shadowRootElement
          }
        }
      }
    })

    // Make fullscreen
    rootRenderElement.style.width = '100%'
    rootRenderElement.style.height = '100%'
    shadowRootElement.style.width = '100%'
    shadowRootElement.style.height = '100%'

    // Setup an emotion style cache
    const cache = createCache.default({ key: 'css', prepend: true, container: emotionRoot })

    // Render the root
    const reactRoot = createRoot(shadowRootElement)
    reactRoot.render(
      <CacheProvider value={cache}>
        <ThemeProvider theme={shadowDOMTheme}>
          <RecoilRoot>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <VirtualTour
                isMobile={false} // TODO: Is this a bug?  Should it be something different?
                allowMotion={allowMotion}
                initialYaw={initialYaw}
                startingRoom={startingRoom}
                enableClose={enableClose}
                disablePriority={disablePriority}
                enabledRooms={enabledRooms}
                enabledHotSpots={enabledHotSpots}
                rootElement={rootRenderElement}
                reactRoot={reactRoot}
                urlPrefix={urlPrefix}
              />
              <Curtain color={textColor} background={backgroundColor} />
            </ErrorBoundary>
          </RecoilRoot>
        </ThemeProvider>
      </CacheProvider>
    )
  }

  // Setup the permission listener
  if (autoStart) {
    installMotionHandler(doRender)
  } else {
    permissionElement.addEventListener('click', event => {
      installMotionHandler(doRender, event)
    })
  }
}

// Export to main context for calling from HTML scripts
window.attachVirtualTour = attachVirtualTour
