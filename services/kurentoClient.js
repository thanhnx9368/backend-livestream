const kurento = require('../config/kurento');

module.exports = function getKurentoClient(callback) {
  kurento(callback);
};
