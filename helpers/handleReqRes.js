/**
 * title : handle request and response
 */

// dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler');

// handler object - module scaffolding
const handler = {};
handler.handleReqRes = (req, res) => {
    // request handle
    // get the url and parse it
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const headersObject = req.headers;

    const requestProperties = {
        path,
        parsedUrl,
        trimmedPath,
        method,
        queryStringObject,
        headersObject,
    };
    const decoder = new StringDecoder('utf-8');
    let realData = '';

    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;
    chosenHandler(requestProperties, (statCode, payld) => {
        const statusCode = typeof statCode === 'number' ? statCode : 500;
        const payload = typeof payld === 'object' ? payld : {};

        const paloadString = JSON.stringify(payload);

        // return the final res
        res.writeHead(statusCode);
        res.end(paloadString);
    });
    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });
    req.on('end', () => {
        realData += decoder.end();
        console.log(realData);
        res.end('Hello Programmers!');
    });
};
module.exports = handler;