require('babel-polyfill');

const server = require('./server');
server.listen(process.env.PORT || 3000);