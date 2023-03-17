# Trim each video down to 5 seconds

for file in *.mp4
do
  backup_filename="$file.backup.mp4"
  mv $file $backup_filename
  ffmpeg -ss 0 -i $backup_filename -c copy -t 5 $file
  printf "\rConverted $file"
done

printf "\nDone\n"
rm *.backup.mp4