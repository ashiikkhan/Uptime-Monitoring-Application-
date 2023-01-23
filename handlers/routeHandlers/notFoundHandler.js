const handler = {};
handler.notFoundHandler = (reqProps, callback) => {
    // console.log(reqProps);
    callback(404, {
        message: '404  \n url not found',
    });
};
module.exports = handler;
