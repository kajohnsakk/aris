import * as AppConfig from '../../main/config/AppConfig';

export const AUTH_CONFIG = {
    domain: process.env.REACT_APP_AUTH0_DOMAIN || "arislab.auth0.com",
    clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || "6XmLzLa5uAUb44VQeALbBcOyFlHZf3CN",
    callbackUrl: AppConfig.WEB_URL + "login/assert"
};
