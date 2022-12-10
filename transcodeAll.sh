for file in public/panoMedia/audio/processing/rawWav/*.wav; do
    node audioTranscode "$file"
done
