const IMG_PATH = 'media/panoImg'
const VID_PATH = 'media/panoVid'

export default {
  indexMin: 2,
  indexMax: 46,

  // Water room
  image19: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_094225_00_merged.jpg`,
    label: 'Water Treatment Room Door',
    floor: 'Main',
    xRotate: 0.2,
    zRotate: -3.9,
    yRotate: -41.4,
    hotSpots: [],
    exits: [
      { direction: -90, name: 'image18' },
      { direction: 0, name: 'image20' } // Out to main floor
    ]
  },
  image18: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_094153_00_merged.jpg`,
    label: 'Water Treatment Room Tanks',
    floor: 'Main',
    xRotate: 0.0,
    zRotate: -3.54,
    yRotate: 47,
    hotSpots: [],
    exits: [
      { direction: 90, name: 'image19' }
    ]
  },

  // Main Floor
  image20: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_094254_00_merged.jpg`,
    label: 'Boiler 1, North End',
    floor: 'Main',
    xRotate: -0.4,
    zRotate: -2.6,
    yRotate: 139,
    hotSpots: [],
    exits: [
      { direction: -135, name: 'image33' }, // In to water room
      { direction: 180, name: 'image19' }, // Up to catwalk
      { direction: -90, name: 'image21' },
      { direction: 0, name: 'image31' }, // South End of Boiler 1
      { direction: 20, name: 'image50' } // Control Room
    ]
  },
  image21: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_094324_00_merged.jpg`,
    label: 'Boiler 2, North End',
    floor: 'Main',
    xRotate: 0.1,
    zRotate: -3.9,
    yRotate: 116.7,
    hotSpots: [],
    exits: [
      { direction: 110, name: 'image22' }, // Down to basement
      { direction: 70, name: 'image20' },
      { direction: 0, name: 'image30' }
    ]
  },
  image30: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_095047_00_merged.jpg`,
    label: 'Between Boiler 1 & 2',
    floor: 'Main',
    xRotate: 0.0,
    zRotate: -3.5,
    yRotate: -159.8,
    hotSpots: [],
    exits: [
      { direction: 0, name: 'image31' },
      { direction: 180, name: 'image21' }
    ]
  },
  image31: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_095124_00_merged.jpg`,
    label: 'Boiler 1 & 2, South End',
    floor: 'Main',
    xRotate: -0.4,
    zRotate: -3.2,
    yRotate: 82.6,
    hotSpots: [],
    exits: [
      { direction: -90, name: 'image32' },
      { direction: 180, name: 'image30' },
      { direction: 120, name: 'image20' },
      { direction: 95, name: 'image50' }
    ]
  },
  image32: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_095156_00_merged.jpg`,
    label: 'Boiler 2 & 3, South End',
    floor: 'Main',
    xRotate: 0.1,
    zRotate: -3.0,
    yRotate: 111.8,
    hotSpots: [
      { longitude: 0, latitude: 0, radius: 6, name: 'Google', href: '/test1.html' },
      { longitude: 90, latitude: 45, radius: 10, name: 'UWStout', href: '/test2.html' },
      { longitude: 180, latitude: -45, radius: 15, name: 'Facebook', href: '/test3.html' },
      { longitude: -90, latitude: -90, name: 'Twitter', href: '/test4.html' }
    ],
    exits: [
      { direction: -90, name: 'image02' },
      { direction: 90, name: 'image31' },
      { direction: 45, name: 'image52' }
      // { direction: 180, name: 'image27' } // DEBUG SHORTCUT
    ]
  },
  image02: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_091619_00_merged.jpg`,
    video: { href: `${VID_PATH}/HeatingPlant/VID_20220401_091446_00_009-cropped.mp4`, loop: false },
    videoCrop: {
      x: 0.236632, y: 0.283681, width: 0.419965, height: 0.650694
    },
    label: 'Boiler 3, South End',
    floor: 'Main',
    xRotate: -0.1,
    yRotate: 15.5,
    zRotate: -3.9,
    hotSpots: [
      { longitude: -90, latitude: 0, name: 'Play Video', playButton: true }
    ],
    exits: [
      { direction: -90, name: 'image04' },
      { direction: 90, name: 'image32' }
    ]
  },
  image03: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_091928_00_merged.jpg`,
    label: 'Boiler 1 & 2, South End',
    floor: 'Main',
    xRotate: 0.0,
    yRotate: 160,
    zRotate: -3.6,
    hotSpots: [],
    exits: [
      { direction: 90, name: 'image04' }
    ]
  },
  image04: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_092009_00_merged.jpg`,
    label: 'Boiler 1, South End',
    floor: 'Main',
    xRotate: 0.0,
    zRotate: -3.5,
    yRotate: 12.6,
    hotSpots: [],
    exits: [
      { direction: -90, name: 'image03' },
      { direction: -75, name: 'image40' },
      { direction: 180, name: 'image05' },
      { direction: 90, name: 'image02' }
    ]
  },
  image05: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_092051_00_merged.jpg`,
    label: 'Between Boiler 1 & 2',
    floor: 'Main',
    xRotate: 0.0,
    zRotate: -4,
    yRotate: 259.9,
    hotSpots: [],
    exits: [
      { direction: 180, name: 'image06' },
      { direction: 0, name: 'image04' }
    ]
  },
  image06: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_092237_00_merged.jpg`,
    label: 'Boiler 1',
    floor: 'Main',
    xRotate: 0.2,
    zRotate: -3.5,
    yRotate: 1.1,
    hotSpots: [],
    exits: [
      { direction: -90, name: 'image07' },
      { direction: 0, name: 'image05' }
    ]
  },
  image07: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_092310_00_merged.jpg`,
    xRotate: -0.2,
    zRotate: -3.5,
    yRotate: 245.1,
    hotSpots: [],
    exits: [
      { direction: 0, name: 'image08' }, // Up to catwalk
      { direction: 90, name: 'image06' }
    ]
  },

  // Catwalk
  image08: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_092354_00_merged.jpg`,
    xRotate: 0.1,
    zRotate: -3.5,
    yRotate: 17.9,
    hotSpots: [],
    exits: [
      { direction: 0, name: 'image09' },
      { direction: 180, name: 'image07' }
    ]
  },
  image09: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_092452_00_merged.jpg`,
    xRotate: -0.3,
    zRotate: -3.5,
    yRotate: 108.9,
    hotSpots: [],
    exits: [
      { direction: 90, name: 'image10' },
      { direction: 180, name: 'image08' },
      { direction: 0, name: 'image41' }
    ]
  },
  image10: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_092558_00_037.jpg`,
    xRotate: 0.0,
    zRotate: -3.5,
    yRotate: -101.5,
    hotSpots: [],
    exits: [
      { direction: 180, name: 'image11' },
      { direction: -90, name: 'image09' }
    ]
  },
  image11: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_092641_00_merged.jpg`,
    xRotate: 0.6,
    zRotate: -3.2,
    yRotate: -12.5,
    hotSpots: [],
    exits: [
      { direction: 90, name: 'image12' },
      { direction: 0, name: 'image10' }
    ]
  },
  image12: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_092750_00_merged.jpg`,
    xRotate: 0.2,
    zRotate: -3.8,
    yRotate: 23.8,
    hotSpots: [],
    exits: [
      { direction: 130, name: 'image45' },
      { direction: 0, name: 'image13' },
      { direction: -90, name: 'image11' }
    ]
  },
  image13: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_092831_00_merged.jpg`,
    xRotate: 0.0,
    zRotate: -3.4,
    yRotate: -129.9,
    hotSpots: [],
    exits: [
      { direction: 90, name: 'image14' },
      { direction: 180, name: 'image12' }
    ]
  },
  image14: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_092916_00_merged.jpg`,
    xRotate: -0.5,
    zRotate: -3.5,
    yRotate: -162.2,
    hotSpots: [],
    exits: [
      { direction: 90, name: 'image15' },
      { direction: 170, name: 'image37' },
      { direction: -90, name: 'image13' }
    ]
  },

  image37: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_095618_00_merged.jpg`,
    xRotate: -0.1,
    zRotate: -3.5,
    yRotate: 168.8,
    hotSpots: [],
    exits: [
      { direction: 180, name: 'image38' },
      { direction: -10, name: 'image14' }
    ]
  },
  image38: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_095653_00_merged.jpg`,
    xRotate: 0.4,
    zRotate: -3.6,
    yRotate: 163.5,
    hotSpots: [],
    exits: [
      { direction: 0, name: 'image37' }
    ]
  },

  image15: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_093008_00_merged.jpg`,
    xRotate: 0.0,
    zRotate: -3.7,
    yRotate: -161.2,
    hotSpots: [],
    exits: [
      { direction: 90, name: 'image16' },
      { direction: -90, name: 'image14' }
    ]
  },
  image16: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_093326_00_merged.jpg`,
    xRotate: 0.0,
    zRotate: -4.0,
    yRotate: -161.8,
    hotSpots: [],
    exits: [
      { direction: 180, name: 'image17' },
      { direction: -90, name: 'image15' }
    ]
  },
  image17: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_093420_00_merged.jpg`,
    xRotate: 0.3,
    zRotate: -3.4,
    yRotate: -4.1,
    hotSpots: [],
    exits: [
      { direction: 180, name: 'image36' },
      { direction: 0, name: 'image16' }
    ]
  },

  image36: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_095501_00_merged.jpg`,
    xRotate: 0.3,
    zRotate: -3.5,
    yRotate: -99.4,
    hotSpots: [],
    exits: [
      { direction: -90, name: 'image35' },
      { direction: 0, name: 'image17' }
    ]
  },
  image35: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_095421_00_merged.jpg`,
    xRotate: 0.3,
    zRotate: -3.3,
    yRotate: -69.3,
    hotSpots: [],
    exits: [
      { direction: -70, name: 'image34' },
      { direction: 0, name: 'image36' }
    ]
  },
  image34: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_095337_00_merged.jpg`,
    xRotate: -0.4,
    zRotate: -3.5,
    yRotate: 168.4,
    hotSpots: [],
    exits: [
      { direction: 70, name: 'image35' },
      { direction: 110, name: 'image33' }
    ]
  },
  image33: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_095258_00_merged.jpg`,
    xRotate: -0.2,
    zRotate: -3.4,
    yRotate: 111.4,
    hotSpots: [],
    exits: [
      { direction: 90, name: 'image20' },
      { direction: -90, name: 'image34' }
    ]
  },

  // Basement
  image22: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_094406_00_merged.jpg`,
    xRotate: -0.3,
    zRotate: -3.5,
    yRotate: 46.9,
    hotSpots: [],
    exits: [
      { direction: 90, name: 'image23' },
      { direction: -90, name: 'image21' } // Up to main floor
    ]
  },
  image23: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_094535_00_merged.jpg`,
    xRotate: -0.5,
    zRotate: -3.5,
    yRotate: 143.3,
    hotSpots: [],
    exits: [
      { direction: -90, name: 'image22' },
      { direction: -55, name: 'image24' },
      { direction: 8, name: 'image29' }
    ]
  },
  image24: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_094621_00_merged.jpg`,
    xRotate: 0.0,
    zRotate: -3.8,
    yRotate: 91.1,
    hotSpots: [],
    exits: [
      { direction: -90, name: 'image25' },
      { direction: -45, name: 'image26' },
      { direction: 90, name: 'image23' }
    ]
  },
  image25: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_094656_00_merged.jpg`,
    xRotate: 0.5,
    zRotate: -3.5,
    yRotate: 107.8,
    hotSpots: [],
    exits: [
      { direction: 35, name: 'image26' },
      { direction: 90, name: 'image24' }
    ]
  },
  image26: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_094746_00_merged.jpg`,
    xRotate: 0.0,
    zRotate: -3.8,
    yRotate: 173.0,
    hotSpots: [],
    exits: [
      { direction: 0, name: 'image27' },
      { direction: -160, name: 'image25' },
      { direction: 135, name: 'image24' }
    ]
  },
  image27: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_094821_00_merged.jpg`,
    xRotate: -0.5,
    zRotate: -4.1,
    yRotate: -84.3,
    hotSpots: [],
    exits: [
      { direction: -90, name: 'image47' },
      { direction: 90, name: 'image28' },
      { direction: 170, name: 'image26' }
    ]
  },
  image28: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_094903_00_merged.jpg`,
    xRotate: 0.4,
    zRotate: -3.4,
    yRotate: -9.7,
    hotSpots: [],
    exits: [
      { direction: 170, name: 'image29' },
      { direction: -90, name: 'image27' }
    ]
  },
  image29: {
    filename: `${IMG_PATH}/HeatingPlant/IMG_20220401_094951_00_merged.jpg`,
    xRotate: 0.0,
    zRotate: -3.5,
    yRotate: 12.5,
    hotSpots: [],
    exits: [
      { direction: -172, name: 'image23' },
      { direction: -20, name: 'image28' }
    ]
  },

  // Extra Rooms
  // Basement West Side
  image47: {
    filename: `${IMG_PATH}/HeatingPlant/LS04_ExitToChillerPumpingArea.jpg`,
    xRotate: 0.0,
    zRotate: -0.1,
    yRotate: 62.2,
    hotSpots: [],
    exits: [
      { direction: -90, name: 'image43' },
      { direction: -135, name: 'image48' },
      { direction: 90, name: 'image27' }
    ]
  },
  image48: {
    filename: `${IMG_PATH}/ChillerPlant/LN04_StorageArea.jpg`,
    xRotate: 0.0,
    zRotate: -0.1,
    yRotate: -25.0,
    hotSpots: [],
    exits: [
      { direction: -30, name: 'image43' },
      { direction: 45, name: 'image47' }
    ]
  },

  image49: {
    filename: `${IMG_PATH}/HeatingPlant/1N04_Boiler3SouthEnd.jpg`,
    xRotate: 0.0,
    zRotate: -0.1,
    yRotate: 62.2,
    hotSpots: [],
    exits: [
      { direction: -90, name: 'image43' },
      { direction: -135, name: 'image48' },
      { direction: 90, name: 'image27' }
    ]
  },
  image50: {
    filename: `${IMG_PATH}/HeatingPlant/1S01_ControlRoom.jpg`,
    xRotate: 0.0,
    zRotate: -0.6,
    yRotate: 32.7,
    hotSpots: [],
    exits: [
      { direction: 180, name: 'image20' },
      { direction: -120, name: 'image31' }
    ]
  },

  image51: {
    filename: `${IMG_PATH}/LibraryCondenser/LIB_NW-Intake.jpg`,
    xRotate: 0.0,
    zRotate: -0.1,
    yRotate: 239.7,
    hotSpots: [],
    exits: [
      { direction: 65, name: 'image52' }
    ]
  },
  image52: {
    filename: `${IMG_PATH}/LibraryCondenser/LIB_NE-Distribution.jpg`,
    xRotate: 0.0,
    zRotate: -0.6,
    yRotate: -121.5,
    hotSpots: [],
    exits: [
      { direction: 75, name: 'image32' },
      { direction: -125, name: 'image51' },
      { direction: -15, name: 'image53' },
      { direction: 15, name: 'image54' }
    ]
  },

  image53: {
    filename: `${IMG_PATH}/LibraryCondenser/LIB_SE.jpg`,
    xRotate: 0.0,
    zRotate: -0.1,
    yRotate: -1.8,
    hotSpots: [],
    exits: [
      { direction: 160, name: 'image52' },
      { direction: 80, name: 'image54' }
    ]
  },
  image54: {
    filename: `${IMG_PATH}/LibraryCondenser/LIB_SW.jpg`,
    xRotate: 0.0,
    zRotate: -1.1,
    yRotate: 108.7,
    hotSpots: [],
    exits: [
      { direction: 200, name: 'image52' },
      { direction: -105, name: 'image53' }
    ]
  },

  // Chiller Rooms, First Floor
  image39: {
    filename: `${IMG_PATH}/ChillerPlant/1S05_ChillerAndEvaporator_C_Left.jpg`,
    xRotate: 0.0,
    zRotate: 0.0,
    yRotate: 166.9,
    hotSpots: [],
    exits: [
      { direction: 0, name: 'image40' }
    ]
  },
  image40: {
    filename: `${IMG_PATH}/ChillerPlant/1S05_Evaporator_A_Left.jpg`,
    xRotate: 0.0,
    zRotate: 0.5,
    yRotate: 174.4,
    hotSpots: [],
    exits: [
      { direction: 90, name: 'image04' },
      { direction: -75, name: 'image44' },
      { direction: 180, name: 'image39' }
    ]
  },

  // Chiller Rooms, Second Floor
  image41: {
    filename: `${IMG_PATH}/ChillerPlant/2S05_ChemicalTreatment_A_Left.jpg`,
    xRotate: 0.0,
    zRotate: 1.0,
    yRotate: -107.0,
    hotSpots: [],
    exits: [
      { direction: 45, name: 'image09' },
      { direction: 180, name: 'image42' }
    ]
  },
  image42: {
    filename: `${IMG_PATH}/ChillerPlant/2N05_BromineAndCutoffs_C_Left.jpg`,
    xRotate: 0.0,
    zRotate: 1.2,
    yRotate: 75.0,
    hotSpots: [],
    exits: [
      { direction: 0, name: 'image41' }
    ]
  },

  // Chiller Rooms, Basement
  image43: {
    filename: `${IMG_PATH}/ChillerPlant/LS05_DistributionHeader_A_Left.jpg`,
    xRotate: 0.0,
    zRotate: 0.1,
    yRotate: 127.0,
    hotSpots: [],
    exits: [
      { direction: -90, name: 'image44' },
      { direction: 155, name: 'image48' },
      { direction: 90, name: 'image47' }
    ]
  },
  image44: {
    filename: `${IMG_PATH}/ChillerPlant/LN05_DistributionPumps_A_Left.jpg`,
    xRotate: 0.0,
    zRotate: -0.3,
    yRotate: -140.5,
    hotSpots: [],
    exits: [
      { direction: 90, name: 'image43' },
      { direction: -75, name: 'image40' }
    ]
  },

  // Chiller Rooms, Roof
  image45: {
    filename: `${IMG_PATH}/ChillerPlant/RS05_CoolingTowerExterior_A_Left.jpg`,
    xRotate: 0.0,
    zRotate: -3.8,
    yRotate: 81.0,
    hotSpots: [],
    exits: [
      { direction: -90, name: 'image46' },
      { direction: 90, name: 'image12' }
    ]
  },
  image46: {
    filename: `${IMG_PATH}/ChillerPlant/RS05_CoolingTowerInterior_A_Left.jpg`,
    xRotate: 0.0,
    zRotate: -0.5,
    yRotate: 170.52,
    hotSpots: [],
    exits: [
      { direction: 180, name: 'image45' }
    ]
  }
}
