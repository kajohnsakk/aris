#!/bin/sh

createService() {
    serviceName=$1
    startScript=$2
    echo 🏗  Creating service $serviceName
    CMD_LIST="echo Creating screen & starting $serviceName service; 
    sleep 5;
    echo Starting $serviceName service...
    npm run-script $startScript;
    exec bash;"
    screen -dmS $serviceName bash -c "$CMD_LIST"
}

killService() {
    serviceName=$1
    echo $serviceName service already running, killing service ✂️;
    screen -X -S $serviceName quit
}

echo '🏃‍ Starting all services'

# Create screen for each service

# Securesite
if ! screen -list | grep "Securesite"; then
    # Screen not exists
    createService Securesite start-securesite-prod
else
    # Screen exists?
    # Kill them!
    
    killService Securesite
    createService Securesite start-securesite-prod
fi

# Rvp
if ! screen -list | grep "Rvp"; then
    # Screen not exists
    createService Rvp start-rvp-prod
else
    # Screen exists?
    # Kill them!
    killService Rvp
    createService Rvp start-rvp-prod
fi

# Api
if ! screen -list | grep "Api"; then
    # Screen not exists
    createService Api start-api-prod
else
    # Screen exists?
    # Kill them!
    killService Api
    createService Api start-api-prod
fi
