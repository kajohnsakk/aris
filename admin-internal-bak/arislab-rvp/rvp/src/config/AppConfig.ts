// For production
// export const WEB_URL:string = 'https://dev.arislab.ai/';
// export const API_URL:string = 'https://dev.arislab.ai/api/';

// For dev
// export const WEB_URL:string = 'https://arislab.convolab.ai:1843/';
// export const API_URL:string = 'http://localhost:1780/api/';

const IS_PRODUCTION: boolean = true;
let web_url: string;
let api_url: string;
let api_host: string;
let api_port: number;
let homepage_host: string;
let homepage_port: number;
let securesite_host: string;
let securesite_port: number;
let media_host: string;
let media_port: number;
let media_web_host: string;
let media_web_port: number;
let rvp_port: number;
let rvp_port_tls: number;

if (IS_PRODUCTION) {
    web_url = 'https://dev.arislab.ai/';
    api_url = 'https://dev.arislab.ai/api/';
    api_host = 'localhost';
    api_port = 1780;
    homepage_host = 'localhost';
    homepage_port = 3000;
    securesite_host = 'localhost';
    securesite_port = 1380;
    media_host = 'localhost';
    media_port = 8000;
    media_web_host = 'localhost';
    media_web_port = 4080;
    rvp_port = 80;
    rvp_port_tls = 1843;
} else {
    // web_url = 'https://arislab.convolab.ai:1843/';
    web_url = 'https://localhost.arislab.ai:1843/';
    api_url = 'http://localhost:1780/api/';
    api_host = 'localhost';
    api_port = 1780;
    homepage_host = 'localhost';
    homepage_port = 3000;
    securesite_host = 'localhost';
    securesite_port = 1380;
    media_host = 'localhost';
    media_port = 8000;
    media_web_host = 'localhost';
    media_web_port = 4080;
    rvp_port = 1880;
    rvp_port_tls = 1843;
}

export const WEB_URL: string = web_url;
export const API_URL: string = api_url;
export const API_HOST: string = api_host;
export const API_PORT: number = api_port;
export const HOMEPAGE_HOST: string = homepage_host;
export const HOMEPAGE_PORT: number = homepage_port;
export const SECURESITE_HOST: string = securesite_host;
export const SECURESITE_POST: number = securesite_port;
export const MEDIA_HOST: string = media_host;
export const MEDIA_PORT: number = media_port;
export const MEDIA_WEB_HOST: string = media_web_host;
export const MEDIA_WEB_PORT: number = media_web_port;
export const RVP_PORT: number = rvp_port;
export const RVP_PORT_TLS: number = rvp_port_tls;

