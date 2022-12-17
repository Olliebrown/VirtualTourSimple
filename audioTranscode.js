import path from 'path'
import fs from 'fs'

import childProcess from 'child_process'

// Helper function to spawn a process
function spawn (name, opt) {
  opts.logger.debug('Spawn', { cmd: [name].concat(opt).join(' ') })
  return childProcess.spawn(name, opt)
}

// Run ffmpeg for transcoding
function exportFile (src, dest, ext, opt, cb) {
  const outfile = dest + '.' + ext

  const allOptions = ['-y', '-i', src, '-ar', opts.samplerate, '-ac', opts.channels]
    .concat(opt).concat(outfile)
  // opts.logger.info('ffmpeg', allOptions.join(' '))

  spawn('ffmpeg', allOptions)
    .on('exit', function (code, signal) {
      if (code) {
        return cb(new Error('Error exporting file'), {
          command: `ffmpeg ${allOptions.filter(opt => opt.toString().includes(' ') ? `"${opt}"` : opt).join(' ')}`,
          format: ext,
          retcode: code,
          signal
        })
      }

      opts.logger.info('Exported ' + ext + ' OK', { file: outfile })
      cb()
    })
}

// Basic options
const opts = {
  output: 'output',
  path: '',
  export: 'webm,m4a,mp3,ac3',
  loop: [],
  bitrate: 128,
  vbr: -1,
  'vbr:vorbis': -1,
  samplerate: 44100,
  channels: 2,
  rawparts: '',
  ignorerounding: 0,
  logger: {
    debug: () => {},
    info: console.info,
    log: console.log
  }
}

// FFMpeg cli options for various formats
const formats = {
  ac3: ['-acodec', 'ac3', '-ab', opts.bitrate + 'k'],
  mp3: ['-ar', opts.samplerate, '-f', 'mp3'],
  m4a: ['-ab', opts.bitrate + 'k', '-strict', '-2'],
  webm: ['-acodec', 'libvorbis', '-f', 'webm', '-dash', '1']
}

// Adjust some options
if (opts.vbr >= 0 && opts.vbr <= 9) {
  formats.mp3 = formats.mp3.concat(['-aq', opts.vbr])
} else {
  formats.mp3 = formats.mp3.concat(['-ab', opts.bitrate + 'k'])
}

// change quality of webm output - https://trac.ffmpeg.org/wiki/TheoraVorbisEncodingGuide
if (opts['vbr:vorbis'] >= 0 && opts['vbr:vorbis'] <= 10) {
  formats.webm = formats.webm.concat(['-qscale:a', opts['vbr:vorbis']])
} else {
  formats.webm = formats.webm.concat(['-ab', opts.bitrate + 'k'])
}

if (!process.argv[2] || !fs.existsSync(process.argv[2])) {
  console.error('Input missing.')
  process.exit(1)
}

function encodeFile (inputFile, destinationDir) {
  const destination = path.join(
    destinationDir,
    path.basename(inputFile, path.extname(inputFile))
  )

  // Process all requested formats
  Object.keys(formats).forEach((ext) => {
    opts.logger.debug('Start export', { format: ext })
    exportFile(inputFile, destination, ext, formats[ext], (err, info) => {
      if (err) {
        console.error('Command:', info?.command)
        console.error(err, `Format: ${info?.format}, Return: ${info?.retcode}, signal: ${info?.signal}`)
        console.error(`Settings: ${inputFile} -> ${destination} - ${ext}`)
      }
    })
  })
}

// Build destination path w/ filename (without extension)
if (fs.lstatSync(process.argv[2]).isDirectory()) {
  // Build destination directory
  const destDir = path.join(process.argv[2], 'transcode')
  if (!fs.existsSync(destDir)) { fs.mkdirSync(destDir) }

  const inputDir = process.argv[2];

  // Loop over all files in inputDir
  (async () => {
    try {
      const files = await fs.promises.readdir(inputDir)
      for (const possibleWavFile of files) {
        if (path.extname(possibleWavFile).toLocaleLowerCase() === '.wav') {
          encodeFile(path.join(inputDir, possibleWavFile), destDir)
        }
      }
    } catch (e) {
      console.error('Encoding failed', e)
    }
  })()
} else {
  // Build destination directory
  const destDir = path.join(path.dirname(process.argv[2]), 'transcode')
  if (!fs.existsSync(destDir)) { fs.mkdirSync(destDir) }
  encodeFile(process.argv[2], destDir)
}
