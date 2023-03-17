for audio in *.wav; do
  ffmpeg -framerate 1 -i dummy.png -i "${audio}" -c:v libx264 -r 30 "${audio}.mp4"
done
