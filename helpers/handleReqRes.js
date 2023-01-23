const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler');
const { parseJSON } = require('./utilities');

const handleReqRes = {};

handleReqRes.handleReqRes = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const headersObject = req.headers;

    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headersObject,
    };

    const decoder = new StringDecoder('utf-8');
    let realData = '';
    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;

    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    });
    req.on('end', () => {
        realData += decoder.end();

        requestProperties.body = parseJSON(realData);

        chosenHandler(requestProperties, (statCode, paylod) => {
            const statusCode = typeof statCode === 'number' ? statCode : 500;
            const payload = typeof paylod === 'object' ? paylod : {};

            const payloadString = JSON.stringify(payload);

            res.setHeader('content-type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        });
    });
};

module.exports = handleReqRes;
