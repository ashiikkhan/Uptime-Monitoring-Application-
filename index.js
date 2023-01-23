const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const environmentToExport = require('./helpers/environments');
const data = require('./lib/data');

const app = {};

// teseting file system
// @TODO - will remove data after
data.delete('test', 'newfile', (error) => {
    // console.log(error);
});

app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environmentToExport.port, () => {
        console.log(`listening to port ${environmentToExport.port}`);
    });
};
app.handleReqRes = handleReqRes;

app.createServer();
