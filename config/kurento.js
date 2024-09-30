const kurento = require('kurento-client');

let kurentoClient = null;

module.exports = function getKurentoClient(callback) {
  if (kurentoClient) {
    return callback(null, kurentoClient);
  }

  kurento('ws://localhost:8888/kurento', (error, client) => {
    if (error) {
      return callback('Could not find media server at address ws://localhost:8888/kurento');
    }

    kurentoClient = client;
    callback(null, kurentoClient);
  });
};
