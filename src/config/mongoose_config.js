/**
 * @copyright 2024 anuragmishra
 */

'use strict';



/**
 * Module ****
 */

const mongoose = require('mongoose');


/**
 * Client options object containing server API configuration.
*   @type{ClientOptions} 
*/

const clientOptions = {
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true
    }
}


/***
 * connect mongoDB database using provided connection string.
 *  @param {string} connectionURI - the mongoDB connection string.
 * 
 */

const connectDB = async (connectionURI) => {
    try {
        await mongoose.connect(connectionURI, clientOptions);
        console.log('Connected to database');
    }catch(error){
        console.error('Error connecting to monodb', error.message);
        throw error;
    }
}


/**
 * Disconnects from the mongoDB database using MOngoose
 * @async 
 * @function disconnectDB
 * @throws {Error} if an error occurs during disconnection.
 * @returns {Promise<void>} A promise that resolve once disconnection is complete.
 * 
 */

const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('Disconnected');
    }catch (error){
        console.error('Error in disconnecting from mongodb ', error.message);
        throw error;
    
    }
}


module.exports = {
    connectDB,
    disconnectDB
}