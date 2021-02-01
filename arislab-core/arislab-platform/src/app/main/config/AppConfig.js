// For production
// export const WEB_URL = 'https://dev.arislab.ai/';
// export const API_URL = 'https://dev.arislab.ai/api/';

// For dev
// export const WEB_URL = 'https://arislab.convolab.ai:1843/';
// export const API_URL = 'http://localhost:1780/api/';

// const IS_PRODUCTION = true;
let web_url;
let api_url;
let media_url;
let securesite_url;

// if( IS_PRODUCTION ) {
//     web_url = 'https://dev.arislab.ai/';
//     api_url = 'https://dev.arislab.ai/api/';
//     //media_url = 'http://3.1.237.31:4080/';
//     media_url = 'https://dev.arislab.ai/';
// } else {
//     web_url = 'https://localhost.arislab.ai:1843/';
//     api_url = 'http://localhost:1780/api/';
//     media_url = 'http://localhost:4080/';
// }

web_url = process.env.REACT_APP_WEB_URL || 'https://localhost.arislab.ai:1843/';
api_url = process.env.REACT_APP_API_URL || 'http://localhost:1780/api/';
media_url = process.env.REACT_APP_MEDIA_URL || 'http://localhost:4080/';
securesite_url = process.env.REACT_APP_SECURESITE_URL || 'http://localhost.arislab.ai:1380/site/'
// console.log('Loading app config with env ', process.env);

export const WEB_URL = web_url;
export const API_URL = api_url;
export const MEDIA_URL = media_url;
export const SECURESITE_URL = securesite_url;

export * from './data/ProductCategoryList';
export * from './data/ColorList';
export * from './data/CleaningMethodList';
export * from './data/Product_ShirtAttributeList';
export * from './data/Product_PantsAttributeList';
export * from './data/SizeList';
