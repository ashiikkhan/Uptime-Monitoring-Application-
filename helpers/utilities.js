/*
 * Title: utilities
 * Description: important utilities
 *
 */

// dependencies
const crypto = require('crypto');
const environments = require('./environments');
// module scaffolding
const utilities = {};

// parse json string to object:
utilities.parseJSON = (jsonString) => {
    let output;
    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }
    return output;
};
// hash string
utilities.hash = (str) => {
    if (typeof str === 'string' && str.length > 0) {
        console.log(environments, process.env.NODE_ENV);
        const hash = crypto.createHmac('sha256', environments.secretKey).update(str).digest('hex');
        return hash;
    }
    return false;
};
// export module
module.exports = utilities;
