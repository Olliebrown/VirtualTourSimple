import React from 'react'
import PropTypes from 'prop-types'

export default function TabPanel (props) {
  const { children, currentTab, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={currentTab !== index}
      id={`virtual-tour-tabpanel-${index}`}
      aria-labelledby={`virtual-tour-tab-${index}`}
      {...other}
    >
      {currentTab === index && (children)}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node.isRequired,
  currentTab: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
}
