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

  spawn('ffmpeg', ['-y', '-ar', opts.samplerate, '-ac', opts.channels, /* '-f', 's16le', */ '-i', src]
    .concat(opt).concat(outfile))
    .on('exit', function (code, signal) {
      if (code) {
        return cb(new Error('Error exporting file', { format: ext, retcode: code, signal }))
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

// Build destination directory
const destinationDir = path.join(
  path.dirname(process.argv[2]),
  'transcode'
)

if (!fs.existsSync(destinationDir)) {
  fs.mkdirSync(destinationDir)
}

// Build destination path w/ filename (without extension)
const destination = path.join(
  destinationDir,
  path.basename(process.argv[2], path.extname(process.argv[2]))
)

// Process all requested formats
Object.keys(formats).forEach((ext) => {
  opts.logger.debug('Start export', { format: ext })
  exportFile(process.argv[2], destination, ext, formats[ext], (err) => {
    if (err) { console.error(err) }
  })
})
