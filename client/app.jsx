import React from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'

import ErrorFallback from './components/ErrorFallback.jsx'
// import ThreeFiberExample from './ThreeFiberExample.jsx'
import VirtualTour from './VirtualTour.jsx'

createRoot(document.getElementById('root')).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <VirtualTour />
  </ErrorBoundary>
)
