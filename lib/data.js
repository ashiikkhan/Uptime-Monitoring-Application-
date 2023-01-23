const fs = require('fs');
const path = require('path');

const lib = {};

// base directory of the data folder
lib.basedir = path.join(__dirname, '/../.data/');
// console.log(this.basedir);
// write data to file
// write data to file
lib.create = (dir, file, data, callback) => {
    // open file for writing
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert data to stirng
            const stringData = JSON.stringify(data);

            // write data to file and then close it
            fs.writeFile(fileDescriptor, stringData, (err2) => {
                if (!err2) {
                    fs.close(fileDescriptor, (err3) => {
                        if (!err3) {
                            callback(false);
                        } else {
                            callback('Error closing the new file!');
                        }
                    });
                } else {
                    callback('Error writing to new file!');
                }
            });
        } else {
            callback('There was an error, file may already exists!');
        }
    });
};
// read data from file
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (error, data) => {
        callback(error, data);
    });
};

// update existing file
lib.update = (dir, file, data, callback) => {
    // file open for writing
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert the data to string
            const stringData = JSON.stringify(data);
            // truncate the file
            fs.ftruncate(fileDescriptor, (err2) => {
                if (!err2) {
                    // write to the file and then close it
                    fs.writeFile(fileDescriptor, stringData, (err3) => {
                        if (!err3) {
                            fs.close(fileDescriptor, (err4) => {
                                if (!err4) {
                                    callback(false);
                                } else {
                                    callback('error closing file.');
                                }
                            });
                        } else {
                            callback('error writng to file');
                        }
                    });
                } else {
                    callback('error truncating filee');
                }
            });
        } else {
            callback('err! updating file may not exists.');
        }
    });
};

// delete file
lib.delete = (dir, file, callback) => {
    // unlink file
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (error) => {
        if (!error) {
            callback(false);
        } else {
            callback('error deleting file');
        }
    });
};
module.exports = lib;
