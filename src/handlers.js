'use strict';

const fs = require('fs');
const tf = require('@tensorflow/tfjs-node');
const { v4: uuidv4 } = require('uuid');
const { predictImage } = require('./utils');

const predict = async (request, h) => {
    const { payload } = request;
    const image = payload.image;

    if (image.hapi.headers['content-length'] > 1000000) {
        return h.response({
            status: 'fail',
            message: 'Payload content length greater than maximum allowed: 1000000'
        }).code(413);
    }

    const filename = uuidv4() + '.' + image.hapi.filename.split('.').pop();
    const filepath = `./uploads/${filename}`;

    const file = fs.createWriteStream(filepath);

    await new Promise((resolve, reject) => {
        image.pipe(file);
        image.on('end', resolve);
        image.on('error', reject);
    });

    try {
        const result = await predictImage(filepath);
        const response = {
            status: 'success',
            message: 'Model is predicted successfully',
            data: {
                id: uuidv4(),
                result: result.label,
                suggestion: 'Segera periksa ke dokter!',
                createdAt: new Date().toISOString()
            }
        };
        return h.response(response).code(200);
    } catch (error) {
        console.error(error);
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan dalam melakukan prediksi'
        }).code(400);
    }
};

module.exports = {
    predict
};
