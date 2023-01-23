const handler = {};
handler.sampleHandler = (reqProps, callback) => {
    // console.log(reqProps);
    callback(200, {
        message: 'this is a sample url',
    });
};
module.exports = handler;
