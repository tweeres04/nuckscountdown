printf "Formatting $1..."
old_filename="$1.old"
mv $1 $old_filename
# from https://stackoverflow.com/a/14283648/279719
(ffmpeg -i $old_filename -vf "scale=326:-2" -crf 24 $1 && rm $old_filename && printf "\rDone\n") || mv $old_filename $1