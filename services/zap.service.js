const ZapClient = require('zaproxy');
 
const zapOptions = {
  apiKey: process.env.ZAP_API_KEY,
  proxy: process.env.ZAP_PROXY,
};
 
export const zaproxy = new ZapClient(zapOptions);