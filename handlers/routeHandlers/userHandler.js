/*
 * Title: User Handler
 * Description: Handler to handle user related routes
 *
 */
// dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');

// module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._users[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }
};

handler._users = {};

handler._users.post = (requestProperties, callback) => {
    const user = requestProperties.body;
    const strLen = (str) => str.trim().length;

    const firstName =
        typeof user.firstName === 'string' && strLen(user.firstName) > 0 ? user.firstName : false;
    const lastName =        typeof user.lastName === 'string' && strLen(user.lastName) > 0 ? user.lastName : false;

    const phone = typeof user.phone === 'string' && strLen(user.phone) === 11 ? user.phone : false;

    const password =        typeof user.password === 'string' && strLen(user.password) > 0 ? user.password : false;

    const tosAgreement = typeof user.tosAgreement === 'boolean' ? user.tosAgreement : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // make sure that the user doesn't already exists
        data.read('users', phone, (err1) => {
            if (err1) {
                const userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };
                // store the user to db
                data.create('users', phone, userObject, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: 'User was created successfully!',
                        });
                    } else {
                        callback(500, { error: 'Could not create user!' });
                    }
                });
            } else {
                callback(500, {
                    error: 'There was a problem in server side!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
};

// @TODO: Authentication
handler._users.get = (requestProperties, callback) => {
    // check the phone number is valid:
    const query = requestProperties.queryStringObject;
    const phone =
        typeof query.phone === 'string' && query.phone.trim().length === 11 ? query.phone : false;
    if (phone) {
        // look up the user
        data.read('users', phone, (error, usr) => {
            const user = { ...parseJSON(usr) };
            if (!error && user) {
                delete user.password;
                callback(200, user);
            } else {
                callback(404, {
                    error: 'requested user was not found.',
                });
            }
        });
    } else {
        callback(404, {
            error: 'requested user was not found.',
        });
    }
};

// @TODO: Authentication
handler._users.put = (requestProperties, callback) => {
    // check validity
    const user = requestProperties.body;
    const strLen = (str) => str.trim().length;

    const firstName =
        typeof user.firstName === 'string' && strLen(user.firstName) > 0 ? user.firstName : false;
    const lastName =        typeof user.lastName === 'string' && strLen(user.lastName) > 0 ? user.lastName : false;

    const phone = typeof user.phone === 'string' && strLen(user.phone) === 11 ? user.phone : false;

    const password =        typeof user.password === 'string' && strLen(user.password) > 0 ? user.password : false;

    if (phone) {
        if (firstName || lastName || password) {
            // look up the user
            data.read('users', phone, (err1, usrData) => {
                const userData = { ...parseJSON(usrData) };
                if (!err1 && userData) {
                    if (firstName) {
                        userData.firstName = firstName;
                    }
                    if (lastName) {
                        userData.lastName = lastName;
                    }
                    if (firstName) {
                        userData.password = hash(password);
                    }
                    // update to database
                    data.update('users', phone, userData, (err2) => {
                        if (!err2) {
                            callback(200, {
                                message: 'user was updated succesffully',
                            });
                        } else {
                            callback(500, {
                                error: 'there was a problem in the server side.',
                            });
                        }
                    });
                } else {
                    callback(400, {
                        error: 'you have a problem in your request.',
                    });
                }
            });
        } else {
            callback(400, {
                error: 'you have a problem in your request.',
            });
        }
    } else {
        callback(400, {
            error: 'Invalid phone number pleas try again.',
        });
    }
};

// @TODO: Authentication
handler._users.delete = (requestProperties, callback) => {
    // check the phone number is valid:
    const query = requestProperties.queryStringObject;
    const phone =
        typeof query.phone === 'string' && query.phone.trim().length === 11 ? query.phone : false;

    if (phone) {
        //
        data.read('users', phone, (err1, userData) => {
            if (!err1 && userData) {
                data.delete('users', phone, (err2) => {
                    if (!err2) {
                        callback(200, { message: 'user succesfully delted' });
                    } else {
                        callback(500, { error: 'there was a servier side error' });
                    }
                });
            } else {
                callback(500, { error: 'there was a servier side error' });
            }
        });
    } else {
        callback(400, { error: 'there was a problem in your request' });
    }
};

module.exports = handler;
