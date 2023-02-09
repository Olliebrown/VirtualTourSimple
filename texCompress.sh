#!/bin/bash

# Folder locations
srcFolder="./public/oldMedia/panoImg/LibraryCondenser"
destFolder="./media"

while IFS="" read -r p || [ -n "$p" ]; do
  # Parse fullpath and filename
  filename=${p##*/}
  basename=${p%.*}

  # Convert the file
  printf 'Converting "%s" to "%s"\n' "${p}" "${basename}.ktx2"
  toktx --target_type RGB --bcmp -- "${destFolder}/${basename}.ktx2" "${srcFolder}/${p}"
done < images.txt
