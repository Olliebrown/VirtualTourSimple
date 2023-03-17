import { suspend } from 'suspend-react'
import { is } from './is.js'

// This is a copy of the useLoader function from @react-three/fiber with the addition of calling dispose on the loader
function loadingFunction (extensions, onProgress) {
  return function (ProtoLoader, ...input) {
    // Construct new loader and run extensions
    const loader = new ProtoLoader()
    if (extensions) extensions(loader)

    // Go through the urls and load them
    const promiseGroup = Promise.all(
      input.map(
        (input) => (
          new Promise((resolve, reject) =>
            loader.load(
              input,
              (data) => resolve(data),
              onProgress,
              (error) => reject(new Error(`Could not load ${input}: ${error.message})`))
            )
          )
        )
      )
    )

    // Dispose of the loader when the promise is done
    promiseGroup.finally(() => loader.dispose())
    return promiseGroup
  }
}

/**
 * Synchronously loads and caches assets with a three loader.
 *
 * Note: this hook's caller must be wrapped with `React.Suspense`
 * @see https://docs.pmnd.rs/react-three-fiber/api/hooks#useloader
 */
export function useLoaderWithDispose (ProtoLoader, input, extensions, onProgress) {
  // Use suspense to load async assets
  const keys = (Array.isArray(input) ? input : [input])
  const results = suspend(loadingFunction(extensions, onProgress), [ProtoLoader, ...keys], { equal: is.equ })

  // Return the object/s
  return (Array.isArray(input) ? results : results[0])
}
