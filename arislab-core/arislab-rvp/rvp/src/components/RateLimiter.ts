const RateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');

export class RateLimiter {
    static getLimiter(){
        const windowSec = 60; //record keeping time (60 sec)

        const ratePerMin = process.env.API_RATE_PER_MINUTE ? Number(process.env.API_RATE_PER_MINUTE): 300;

        const connectionString = process.env.redis;

        if(connectionString){
            const connectionStringUrl =
                connectionString.substring((connectionString.indexOf('@') + 1), connectionString.lastIndexOf(':'));
            const redisClient = require('redis').createClient(connectionString, {
                    tls: {servername: connectionStringUrl}
                }
            );

            const limiterStore = new RedisStore({
                client: redisClient, expiry: windowSec
            });

            return RateLimit({ // if redis is configured
                store: limiterStore,
                windowMs: windowSec * 1000, // keep records for 1 minute
                max: ratePerMin, // limit each IP/token to 'ratePerMin' requests per windowMs (1 minute)
                delayAfter: 0, // delay when there are more than a hit per window
                delayMs: 0,
                keyGenerator: (req: any) => {
                    if (!!req.cookies && !!req.cookies.token) {
                        return req.cookies.token;
                    } else {
                        return req.ip;
                    }
                }
            });
        }else{
            return RateLimit({ // if no redis
                windowMs: windowSec * 1000, // keep records for 1 minute
                max: ratePerMin, // limit each IP/token to 'ratePerMin' requests per windowMs (1 minute)
                delayAfter: 0, // delay when there are more than a hit per window
                delayMs: 0,
                keyGenerator: (req: any) => {
                    if (!!req.cookies && !!req.cookies.token) {
                        return req.cookies.token;
                    } else {
                        return req.ip;
                    }
                }
            });
        }
    }
}
