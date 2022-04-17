const PATH = 'media/panoImg'

export default {
  indexMin: 2,
  indexMax: 38,

  // Water room
  image19: {
    filename: `${PATH}/IMG_20220401_094225_00_merged.jpg`,
    xRotate: 0.2,
    zRotate: -3.9,
    yRotate: -41.4,
    exits: [
      { direction: -90, name: 'image18' },
      { direction: 0, name: 'image20' } // Out to main floor
    ]
  },
  image18: {
    filename: `${PATH}/IMG_20220401_094153_00_merged.jpg`,
    xRotate: 0.0,
    zRotate: -3.54,
    yRotate: 47,
    exits: [
      { direction: 90, name: 'image19' }
    ]
  },

  // Main Floor
  image20: {
    filename: `${PATH}/IMG_20220401_094254_00_merged.jpg`,
    xRotate: -0.4,
    zRotate: -2.6,
    yRotate: 139,
    exits: [
      { direction: -135, name: 'image33' }, // In to water room
      { direction: 180, name: 'image19' }, // Up to catwalk
      { direction: -90, name: 'image21' }
    ]
  },
  image21: {
    filename: `${PATH}/IMG_20220401_094324_00_merged.jpg`,
    xRotate: 0.1,
    zRotate: -3.9,
    yRotate: 116.7,
    exits: [
      { direction: 110, name: 'image22' }, // Down to basement
      { direction: 70, name: 'image20' },
      { direction: 0, name: 'image30' }
    ]
  },
  image30: {
    filename: `${PATH}/IMG_20220401_095047_00_merged.jpg`,
    xRotate: 0.0,
    zRotate: -3.5,
    yRotate: -159.8,
    exits: [
      { direction: 0, name: 'image31' },
      { direction: 180, name: 'image21' }
    ]
  },
  image31: {
    filename: `${PATH}/IMG_20220401_095124_00_merged.jpg`,
    xRotate: -0.4,
    zRotate: -3.2,
    yRotate: 82.6,
    exits: [
      { direction: -90, name: 'image32' },
      { direction: 180, name: 'image30' }
    ]
  },
  image32: {
    filename: `${PATH}/IMG_20220401_095156_00_merged.jpg`,
    xRotate: 0.1,
    zRotate: -3.0,
    yRotate: 111.8,
    exits: [
      { direction: -90, name: 'image02' },
      { direction: 90, name: 'image31' }
    ]
  },
  image02: {
    filename: `${PATH}/IMG_20220401_091619_00_merged.jpg`,
    xRotate: -0.1,
    yRotate: 15.5,
    zRotate: -3.9,
    exits: [
      { direction: -90, name: 'image04' },
      { direction: 90, name: 'image32' }
    ]
  },
  image03: {
    filename: `${PATH}/IMG_20220401_091928_00_merged.jpg`,
    xRotate: 0.0,
    yRotate: 160,
    zRotate: -3.6,
    exits: [
      { direction: -90, name: 'image04' },
      { direction: 90, name: 'image02' }
    ]
  },
  image04: {
    filename: `${PATH}/IMG_20220401_092009_00_merged.jpg`,
    xRotate: 0.0,
    zRotate: -3.5,
    yRotate: 12.6,
    exits: [
      { direction: -90, name: 'image03' },
      { direction: 180, name: 'image05' },
      { direction: 90, name: 'image02' }
    ]
  },
  image05: {
    filename: `${PATH}/IMG_20220401_092051_00_merged.jpg`,
    xRotate: 0.0,
    zRotate: -4,
    yRotate: 259.9,
    exits: [
      { direction: 180, name: 'image06' },
      { direction: 0, name: 'image04' }
    ]
  },
  image06: {
    filename: `${PATH}/IMG_20220401_092237_00_merged.jpg`,
    xRotate: 0.2,
    zRotate: -3.5,
    yRotate: 1.1,
    exits: [
      { direction: -90, name: 'image07' },
      { direction: 0, name: 'image05' }
    ]
  },
  image07: {
    filename: `${PATH}/IMG_20220401_092310_00_merged.jpg`,
    xRotate: -0.2,
    zRotate: -3.5,
    yRotate: 245.1,
    exits: [
      { direction: 0, name: 'image08' }, // Up to catwalk
      { direction: 90, name: 'image06' }
    ]
  },

  // Catwalk
  image08: {
    filename: `${PATH}/IMG_20220401_092354_00_merged.jpg`,
    xRotate: 0.1,
    zRotate: -3.5,
    yRotate: 17.9,
    exits: [
      { direction: 0, name: 'image09' },
      { direction: 180, name: 'image07' }
    ]
  },
  image09: {
    filename: `${PATH}/IMG_20220401_092452_00_merged.jpg`,
    xRotate: -0.3,
    zRotate: -3.5,
    yRotate: 108.9,
    exits: [
      { direction: 90, name: 'image10' },
      { direction: 180, name: 'image08' }
    ]
  },
  image10: {
    filename: `${PATH}/IMG_20220401_092558_00_037.jpg`,
    xRotate: 0.0,
    zRotate: -3.5,
    yRotate: -101.5,
    exits: [
      { direction: 180, name: 'image11' },
      { direction: -90, name: 'image09' }
    ]
  },
  image11: {
    filename: `${PATH}/IMG_20220401_092641_00_merged.jpg`,
    xRotate: 0.6,
    zRotate: -3.2,
    yRotate: -12.5,
    exits: [
      { direction: 90, name: 'image12' },
      { direction: 0, name: 'image10' }
    ]
  },
  image12: {
    filename: `${PATH}/IMG_20220401_092750_00_merged.jpg`,
    xRotate: 0.2,
    zRotate: -3.8,
    yRotate: 23.8,
    exits: [
      { direction: 0, name: 'image13' },
      { direction: -90, name: 'image11' }
    ]
  },
  image13: {
    filename: `${PATH}/IMG_20220401_092831_00_merged.jpg`,
    xRotate: 0.0,
    zRotate: -3.4,
    yRotate: -129.9,
    exits: [
      { direction: 90, name: 'image14' },
      { direction: 180, name: 'image12' }
    ]
  },
  image14: {
    filename: `${PATH}/IMG_20220401_092916_00_merged.jpg`,
    xRotate: -0.5,
    zRotate: -3.5,
    yRotate: -162.2,
    exits: [
      { direction: 90, name: 'image15' },
      { direction: 170, name: 'image37' },
      { direction: -90, name: 'image13' }
    ]
  },

  image37: {
    filename: `${PATH}/IMG_20220401_095618_00_merged.jpg`,
    xRotate: -0.1,
    zRotate: -3.5,
    yRotate: 168.8,
    exits: [
      { direction: 180, name: 'image38' },
      { direction: -10, name: 'image14' }
    ]
  },
  image38: {
    filename: `${PATH}/IMG_20220401_095653_00_merged.jpg`,
    xRotate: 0.4,
    zRotate: -3.6,
    yRotate: 163.5,
    exits: [
      { direction: 0, name: 'image37' }
    ]
  },

  image15: {
    filename: `${PATH}/IMG_20220401_093008_00_merged.jpg`,
    xRotate: 0.0,
    zRotate: -3.7,
    yRotate: -161.2,
    exits: [
      { direction: 90, name: 'image16' },
      { direction: -90, name: 'image14' }
    ]
  },
  image16: {
    filename: `${PATH}/IMG_20220401_093326_00_merged.jpg`,
    xRotate: 0.0,
    zRotate: -4.0,
    yRotate: -161.8,
    exits: [
      { direction: 180, name: 'image17' },
      { direction: -90, name: 'image15' }
    ]
  },
  image17: {
    filename: `${PATH}/IMG_20220401_093420_00_merged.jpg`,
    xRotate: 0.3,
    zRotate: -3.4,
    yRotate: -4.1,
    exits: [
      { direction: 180, name: 'image36' },
      { direction: 0, name: 'image16' }
    ]
  },

  image36: {
    filename: `${PATH}/IMG_20220401_095501_00_merged.jpg`,
    xRotate: 0.3,
    zRotate: -3.5,
    yRotate: -99.4,
    exits: [
      { direction: -90, name: 'image35' },
      { direction: 0, name: 'image17' }
    ]
  },
  image35: {
    filename: `${PATH}/IMG_20220401_095421_00_merged.jpg`,
    xRotate: 0.3,
    zRotate: -3.3,
    yRotate: -69.3,
    exits: [
      { direction: -70, name: 'image34' },
      { direction: 0, name: 'image36' }
    ]
  },
  image34: {
    filename: `${PATH}/IMG_20220401_095337_00_merged.jpg`,
    xRotate: -0.4,
    zRotate: -3.5,
    yRotate: 168.4,
    exits: [
      { direction: 70, name: 'image35' },
      { direction: 110, name: 'image33' }
    ]
  },
  image33: {
    filename: `${PATH}/IMG_20220401_095258_00_merged.jpg`,
    xRotate: -0.2,
    zRotate: -3.4,
    yRotate: 111.4,
    exits: [
      { direction: 90, name: 'image20' },
      { direction: -90, name: 'image34' }
    ]
  },

  // Basement
  image22: {
    filename: `${PATH}/IMG_20220401_094406_00_merged.jpg`,
    xRotate: -0.3,
    zRotate: -3.5,
    yRotate: 46.9,
    exits: [
      { direction: 90, name: 'image23' },
      { direction: -90, name: 'image21' } // Up to main floor
    ]
  },
  image23: {
    filename: `${PATH}/IMG_20220401_094535_00_merged.jpg`,
    xRotate: -0.5,
    zRotate: -3.5,
    yRotate: 143.3,
    exits: [
      { direction: -90, name: 'image22' },
      { direction: -55, name: 'image24' },
      { direction: 8, name: 'image29' }
    ]
  },
  image24: {
    filename: `${PATH}/IMG_20220401_094621_00_merged.jpg`,
    xRotate: 0.0,
    zRotate: -3.8,
    yRotate: 91.1,
    exits: [
      { direction: -90, name: 'image25' },
      { direction: -45, name: 'image26' },
      { direction: 90, name: 'image23' }
    ]
  },
  image25: {
    filename: `${PATH}/IMG_20220401_094656_00_merged.jpg`,
    xRotate: 0.5,
    zRotate: -3.5,
    yRotate: 107.8,
    exits: [
      { direction: 35, name: 'image26' },
      { direction: 90, name: 'image24' }
    ]
  },
  image26: {
    filename: `${PATH}/IMG_20220401_094746_00_merged.jpg`,
    xRotate: 0.0,
    zRotate: -3.8,
    yRotate: 173.0,
    exits: [
      { direction: 0, name: 'image27' },
      { direction: -160, name: 'image25' },
      { direction: 135, name: 'image24' }
    ]
  },
  image27: {
    filename: `${PATH}/IMG_20220401_094821_00_merged.jpg`,
    xRotate: -0.5,
    zRotate: -4.1,
    yRotate: -84.3,
    exits: [
      { direction: 90, name: 'image28' },
      { direction: 170, name: 'image26' }
    ]
  },
  image28: {
    filename: `${PATH}/IMG_20220401_094903_00_merged.jpg`,
    xRotate: 0.4,
    zRotate: -3.4,
    yRotate: -9.7,
    exits: [
      { direction: 170, name: 'image29' },
      { direction: -90, name: 'image27' }
    ]
  },
  image29: {
    filename: `${PATH}/IMG_20220401_094951_00_merged.jpg`,
    xRotate: 0.0,
    zRotate: -3.5,
    yRotate: 12.5,
    exits: [
      { direction: -172, name: 'image23' },
      { direction: -20, name: 'image28' }
    ]
  }
}
