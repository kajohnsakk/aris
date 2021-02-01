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

# Servicestatus
if ! screen -list | grep "Servicestatus"; then
    # Screen not exists
    createService Servicestatus start-servicestatus-dev
else
    # Screen exists?
    # Kill them!
    killService Servicestatus
    createService Servicestatus start-servicestatus-dev
fi

# Webhook
if ! screen -list | grep "Webhook"; then
    # Screen not exists
    createService Webhook start-webhook-dev
else
    # Screen exists?
    # Kill them!
    killService Webhook
    createService Webhook start-webhook-dev
fi

# Api
if ! screen -list | grep "Api"; then
    # Screen not exists
    createService Api start-api-dev
else
    # Screen exists?
    # Kill them!
    
    killService Api
    createService Api start-api-dev
fi

# Media
if ! screen -list | grep "Media"; then
    # Screen not exists
    createService Media start-media-dev
else
    # Screen exists?
    # Kill them!
    killService Media
    createService Media start-media-dev
fi

# Securesite
if ! screen -list | grep "Securesite"; then
    # Screen not exists
    createService Securesite start-securesite-dev
else
    # Screen exists?
    # Kill them!
    killService Securesite
    createService Securesite start-securesite-dev
fi

# Platform
if ! screen -list | grep "Platform"; then
    # Screen not exists
    createService Platform start-platform-dev
else
    # Screen exists?
    # Kill them!
    killService Platform
    createService Platform start-platform-dev
fi

# Rvp
if ! screen -list | grep "Rvp"; then
    # Screen not exists
    createService Rvp start-rvp-dev
else
    # Screen exists?
    # Kill them!
    killService Rvp
    createService Rvp start-rvp-dev
fi

# Queueservice
if ! screen -list | grep "Queueservice"; then
    # Screen not exists
    createService Queueservice start-queueservices-dev
else
    # Screen exists?
    # Kill them!
    killService Queueservice
    createService Queueservice start-queueservices-dev
fi
