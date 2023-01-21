/**
 * Title: Uptime Monitoring Application.
 * Description: A RESTFul Api to monitor up or down time of user defined links.
 */

// dependencies
const http = require('http');

const { handleReqRes } = require('./helpers/handleReqRes');

// app object - module scafolding
const app = {};

// configeration
app.config = {
    port: 3000,
};

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`listening to port: ${app.config.port}`);
    });
};

// handle request response
app.handleReqRes = handleReqRes;

// start the server
app.createServer();
