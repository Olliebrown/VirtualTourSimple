import React from 'react'
import PropTypes from 'prop-types'

import { hotspotModalOpenState, hotspotDataState } from '../../state/globalState.js'
import { useSetRecoilState } from 'recoil'

import HotSpotIndicator from './HotSpotIndicator.jsx'
import HotSpot from '../Utility/HotSpot.js'

export default function InfoHotspot (props) {
  const { id, title, ...rest } = props

  // Subscribe to pieces of global state
  const setHotspotModalOpen = useSetRecoilState(hotspotModalOpenState)
  const setHotspotData = useSetRecoilState(hotspotDataState)
  const hotSpotBase = React.useMemo(
    () => new HotSpot({ id, title, type: 'info', ...rest }),
    [title, id, rest]
  )

  // Click callback function
  const onClick = React.useCallback(() => {
    setHotspotData({
      type: hotSpotBase.type,
      jsonFilename: hotSpotBase.jsonFilename(),
      title: hotSpotBase.title
    })
    setHotspotModalOpen('info')
  }, [hotSpotBase, setHotspotData, setHotspotModalOpen])

  // Render the appropriate indicator
  return (
    <HotSpotIndicator
      hotSpotBase={hotSpotBase}
      onClick={onClick}
    />
  )
}

InfoHotspot.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string
}
