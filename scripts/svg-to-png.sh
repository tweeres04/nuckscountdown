# I used this to convert all the svg logos to png

for file in *.svg
do
  png_filename="${file%.svg}.png"
  rsvg-convert -w 512 --keep-aspect-ratio --background-color=none "$file" >> "$png_filename"
  # Square the image while preserving aspect ratio. From https://stackoverflow.com/a/34992414/279719
  convert -background none -gravity center "$png_filename" -resize 512x512 -extent 512x512 "$png_filename"
  printf "\rConverted $png_filename"
done

printf "\nDone\n"
rm *.svg