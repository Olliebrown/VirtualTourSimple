import React from 'react'

import { useRecoilValue } from 'recoil'
import { currentPanoKeyState } from '../../state/globalState.js'

import { Paper, Button, Typography, IconButton, Slide, Fade } from '@mui/material'
import { Close as CloseIcon, ExpandLess as ExpandIcon } from '@mui/icons-material'

import TourInfoForm from './TourInfoForm.jsx'

export default function TourInfoEditor (props) {
  const currentPanoKey = useRecoilValue(currentPanoKeyState)

  // Controlling visibility of the Editor Panel
  const [showEditor, setShowEditor] = React.useState(false)

  return (
    <React.Fragment>
      <Fade in={!showEditor}>
        <Button
          variant="contained"
          endIcon={<ExpandIcon />}
          sx={{ position: 'absolute', top: 100, right: -85, minWidth: 200, transform: 'rotate(-90deg)' }}
          onClick={() => setShowEditor(true)}
        >
          {'Edit Pano Data'}
        </Button>
      </Fade>

      <Slide direction="left" in={showEditor} mountOnEnter unmountOnExit>
        <Paper sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          width: '400px',
          maxHeight: '88vh',
          p: 2,
          pt: 1
        }}
        >
          <Typography variant="h5" component="div" gutterBottom>{currentPanoKey}</Typography>
          <IconButton
            aria-label="close editor"
            onClick={() => setShowEditor(false)}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
          <TourInfoForm />
        </Paper>
      </Slide>
    </React.Fragment>
  )
}
