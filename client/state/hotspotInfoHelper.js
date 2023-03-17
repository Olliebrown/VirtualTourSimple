import CONFIG from '../config.js'

import React from 'react'
import Axios from 'axios'

export function useHotspotContent (jsonFilename, type = 'unknown') {
  const [hotspotContent, setHotspotContent] = React.useState(null)
  React.useEffect(() => {
    // Async process to retrieve the JSON info
    const retrieveInfo = async (fullFilepath) => {
      try {
        const response = await Axios.get(fullFilepath)
        if (response?.data) {
          setHotspotContent(response.data)
        }
      } catch (err) {
        console.error(`Failed to retrieve hotspot content from ${fullFilepath}`)
      }
    }

    // Clear any previous info and start the async process
    if (jsonFilename && jsonFilename !== '.json') {
      retrieveInfo(`${CONFIG().HOTSPOT_INFO_PATH}/${jsonFilename}`)
    }
  }, [jsonFilename, setHotspotContent, type])

  return hotspotContent
}
