// --------------------------------------------------
// server.js - entry point
// This is the main file of the Skeddler server.
// Created by FSSG, 2022
// --------------------------------------------------

// Node modules
const process = require('process');
const EventEmitter = require('node:events');
// const child_process = require('child_process');
// const cluster = require('cluster');
const http = require('http');
const https = require('https');
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

// External dependencies
const mongodb = require('mongodb');

// Local modules (some are submodules)
const cleaner = require('./uncleaner.js');
const cfg = require('./cfg.json');

// Program constants
const key = process.env.KEY || fs.readFileSync(path.join(__dirname, cfg.keyPath)) || undefined;
const cert = process.env.CERT || fs.readFileSync(path.join(__dirname, cfg.certPath)) || undefined;
const useHttps = !!key && !!cert;
const port = process.env.PORT || cfg.port || (useHttps ? 443 : 80);
const host = process.env.HOST || cfg.host || 'localhost';
const mongoUri = process.env.MONGODB_URI || cfg.mongodb.uri;
const mongoClient = new mongodb.MongoClient(mongoUri, { retryWrites: true, serverSelectionTimeoutMS: 1000 });

/** @type {Promise<mongodb.Db>} */
var database = new Promise(async (resolve, reject) => {
    mongoClient.connect().then(async () => {
        console.log(`\x1b[32mMongoDB connection to \x1b[1m${mongoUri}\x1b[22m established succesfully\x1b[0m`);
        let db = mongoClient.db('scheduler');
        // double check that the database is ready (with a collection)
        if ((await (db.collections())).length <= 0) {
            db.createCollection('users');
        }
        resolve(db);
    }, err => {
        reject(err);
    });
});

/**
 * Attempts to open a collection in the database.
 * That's it. If the collection doesn't exist, it will be created.
 */
async function testDatabase() {
    await database;
    try {
        (await database).collection('users');
        return '\x1b[32mDatabase connection test passed\x1b[0m';
    } catch (err) {
        return err;
    }
}

/**
 * Attempts to open a collection in the database.
 * That's it. If the collection doesn't exist, it will be created.
 */
async function getUserDetails(query) {
    await database;
    return new Promise(async (resolve, reject) => {
        (await database).collection('users').findOne(query).then(res => {
            if (res) {
                resolve(res);
                return;
            } else {
                reject(new Error('User not found'));
            }
        }, err => {
            reject(err);
        })
    });
}

(async () => {
    await database;
    const server = (useHttps ? https : http).createServer({ key, cert });

    server.listen(port, host, () => {
        console.log(`\x1b[32mServer open at \x1b[1m${useHttps ?
            'https' :
            'http'
            }://${host}${(useHttps && port == 443) || (!useHttps && port == 80) ?
                '' :
                `:${port}`
            }\x1b[0m`
        );
    });
})();

server.on('request', (req, res) => {
    
});

// if (process.isPrimary && !useHttps) {
//     (spawn HTTP redirector)
//     child_process.fork()
// }