const app = require('../app');

const debug = require('debug')('task:server');
const http = require('http');

const { log } = require('../helpers/logger');
const initializeService = require('../services/initializeServices');

const startApp = async () => {
  const normalizePort = (val) => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
      return val;
    }

    if (port >= 0) {
      return port;
    }

    return false;
  };

  const port = normalizePort(process.env.PORT || '5001');
  app.set('port', port);

  const server = http.createServer(app);

  const onError = (error) => {
    if (error.syscall !== 'listen') {
      throw new Error(error);
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

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
        throw new Error(error);
    }
  };

  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);

  function onListening() {
    const addr = server.address();
    const bind =
      typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }

  return port;
};

initializeService()
  .then(async () => {
    await startApp().then((port) =>
      log.info(`Server started Successfully on port ${port}, no issues!`),
    );
  })
  .catch((e) => log.error(`Server crashed, found issues ---${e}--`));
