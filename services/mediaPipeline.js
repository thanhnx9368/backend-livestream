const getKurentoClient = require('./kurentoClient');

function createPipeline(sdpOffer, callback) {
  getKurentoClient((error, client) => {
    if (error) {
      return callback(error);
    }

    client.create('MediaPipeline', (error, pipeline) => {
      if (error) {
        return callback(error);
      }

      pipeline.create('WebRtcEndpoint', (error, endpoint) => {
        if (error) {
          pipeline.release();
          return callback(error);
        }

        endpoint.processOffer(sdpOffer, (error, sdpAnswer) => {
          if (error) {
            pipeline.release();
            return callback(error);
          }

          endpoint.gatherCandidates((error) => {
            if (error) {
              console.error('Error gathering ICE candidates:', error);
            }
          });

          endpoint.on('OnIceCandidate', (event) => {
            const candidate = event.candidate;
            ws.send(JSON.stringify({ id: 'iceCandidate', candidate }));
          });

          callback(null, sdpAnswer, endpoint);
        });
      });
    });
  });
}

function addIceCandidate(endpoint, candidate) {
  if (endpoint) {
    endpoint.addIceCandidate(candidate);
  }
}

function stopPipeline(endpoint) {
  if (endpoint) {
    endpoint.release();
  }
}

module.exports = {
  createPipeline,
  addIceCandidate,
  stopPipeline
};
