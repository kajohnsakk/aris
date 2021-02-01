
#!/bin/sh

echo 'Running kill all screen...';

serviceList=( Api Media Securesite Platform Rvp Queueservice )
for i in "${serviceList[@]}"
do
    echo "✂️ Killing screen of service ${i}"
    screen -X -S ${i} quit
done