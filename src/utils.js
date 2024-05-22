'use strict';

const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

const predictImage = async (imagePath) => {
    const model = await tf.loadLayersModel('file://./models/model.json');

    const imageBuffer = fs.readFileSync(imagePath);
    const imageTensor = tf.node.decodeImage(imageBuffer);
    const resizedImage = tf.image.resizeBilinear(imageTensor, [224, 224]);
    const normalizedImage = resizedImage.div(255.0).expandDims(0);

    const predictions = model.predict(normalizedImage);
    const predictedIndex = predictions.argMax(1).dataSync()[0];

    // Assume we have some logic to map predictedIndex to labels
    const labels = ['Non-cancer', 'Cancer'];
    const label = labels[predictedIndex];

    return { label };
};

module.exports = {
    predictImage
};
