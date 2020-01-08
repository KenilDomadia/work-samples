import dotenv from 'dotenv';
import http from 'http';
import mongoose from 'mongoose';

dotenv.load();

require('babel-polyfill');
const app = require('./server/server');

const port = process.env.PORT || 4444;
app.set('port', port);

const server = http.createServer(app);

mongoose.connection.on('connected', () => {
  console.log('Mongoose default connection open now on', MONGODB_URI);
  server.listen(port);
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});


/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  console.log('Listening on ' + bind);
  console.log('GraphQL @http://localhost:' + addr.port + '/graphql');
}

server.on('error', onError);
server.on('listening', onListening);
