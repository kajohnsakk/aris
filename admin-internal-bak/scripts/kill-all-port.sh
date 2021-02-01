
#!/bin/sh

echo 'Running kill all port...';

portList=( 1780 3000 1380 8000 4080 80 1843 4080 3111 1415 )
for i in "${portList[@]}"
do
    echo "✂️ Killing port ${i}"
    kill -9 $(lsof -t -i:${i})
done