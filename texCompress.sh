#!/bin/bash

# Folder locations
srcFolder="/Volumes/BerrierMac/HeatingPlantRawData/2022_10_15_Berrier"
destFolder="./media/panoImgKtx2"

while IFS="" read -r p || [ -n "$p" ]; do
  # Parse fullpath and filename
  filename=${p##*/}
  basename=${p%.*}

  # Convert the file
  printf 'Converting "%s" to "%s"\n' "${p}" "${basename}.ktx2"
  toktx --target_type RGB --encode etc1s -- "${destFolder}/${basename}.ktx2" "${srcFolder}/${p}"
done < textureList.txt
