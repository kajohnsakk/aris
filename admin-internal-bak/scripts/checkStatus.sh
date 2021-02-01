
#!/bin/sh

checkServiceStatus() {
    servicePort=$1
    serviceName=$2

    curlCommand=$(curl -o /dev/null -s -w "%{http_code}\n" "http://localhost:$servicePort")

    statusCode=$curlCommand

    printf '{"serviceName": "%s","port":"%s", "statusCode": "%s"}\n' "$serviceName" "$servicePort" "$statusCode"
}

apiStatus=`checkServiceStatus 1780 api`
platformStatus=`checkServiceStatus 3000 platform`
securesiteStatus=`checkServiceStatus 1380 securesite`
mediaStatus=`checkServiceStatus 8000 media`
mediaWebStatus=`checkServiceStatus 4080 mediaWeb`
rvpStatus=`checkServiceStatus 80 rvp`
rvpTLSStatus=`checkServiceStatus 1843 rvpTLS`
webPortStatus=`checkServiceStatus 4080 webPort`
webhookStatus=`checkServiceStatus 3111 webhook`

printf '[';
printf '%s,' "$apiStatus"
printf '%s,' "$platformStatus"
printf '%s,' "$securesiteStatus"
printf '%s,' "$mediaStatus"
printf '%s,' "$mediaWebStatus"
printf '%s,' "$rvpStatus"
printf '%s,' "$rvpTLSStatus"
printf '%s,' "$webPortStatus"
printf '%s' "$webhookStatus"
printf ']';