import Axios from 'axios'

export async function getFullTourDataFromServer () {
  try {
    const response = await Axios.get('data/')
    return response.data
  } catch (err) {
    console.error('Error retrieving full tour data from server')
    console.error(err)
    return null
  }
}

export async function getMapInfoDataFromServer () {
  try {
    const response = await Axios.get('data/mapInfo')
    return response.data
  } catch (err) {
    console.error('Error retrieving full tour data from server')
    console.error(err)
    return null
  }
}

export async function getPanoDataFromServer (panoKey) {
  try {
    const response = await Axios.get(`data/${panoKey}`)
    return response.data
  } catch (err) {
    console.error('Error retrieving pano data from server')
    console.error(err)
    return null
  }
}

export async function setPanoDataOnServer (panoKey, newData) {
  try {
    await Axios.put(`data/${panoKey}`, newData)
  } catch (err) {
    console.error('Error sending pano data to server')
    console.error(err)
  }
}

export async function getDataSubRoute (type, defaultValue = null) {
  try {
    const response = await Axios.get(`data/${type}`)
    return response.data
  } catch (err) {
    console.error('Error sending pano data to server')
    console.error(err)
    return defaultValue
  }
}
