'use strict'

require('dotenv').config();

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


/**
 * upload base64 image to cloudinary
 * */

const uploadToCloudinary = async (image, public_id) => {
    try {
        const response = await cloudinary.uploader.upload(image, {
            resource_type: 'auto',
            public_id
        });
        return response.secure_url;
    } catch (error) {
        console.error('Error uploading image to Cloudinary: ', error.message);
        throw error; // Rethrow the error
    }
}

module.exports = uploadToCloudinary;