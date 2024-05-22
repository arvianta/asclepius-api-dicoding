'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const handlers = require('./handlers');

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    await server.register(Inert);

    server.route({
        method: 'POST',
        path: '/predict',
        handler: handlers.predict,
        options: {
            payload: {
                maxBytes: 1000000, // 1MB
                output: 'stream',
                parse: true,
                allow: 'multipart/form-data'
            }
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
