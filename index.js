const WebSocket = require('ws');
const kurento = require('./config/kurento');
const mediaPipelineService = require('./services/mediaPipeline');

const wss = new WebSocket.Server({ port: 8080 });
let webRtcEndpoint = null;

wss.on('connection', (ws) => {

  console.log('New WebSocket connection established');

  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);

    switch (parsedMessage.id) {
      case 'startLivestream':
        mediaPipelineService.createPipeline(parsedMessage.sdpOffer, (error, sdpAnswer, endpoint) => {
          if (error) {
            return ws.send(JSON.stringify({ id: 'error', message: error }));
          }

          webRtcEndpoint = endpoint;
          ws.send(JSON.stringify({ id: 'sdpAnswer', sdpAnswer }));
        });
        break;

      case 'onIceCandidate':
        if (webRtcEndpoint) {
          mediaPipelineService.addIceCandidate(webRtcEndpoint, parsedMessage.candidate);
        }
        break;

      case 'stopLivestream':
        mediaPipelineService.stopPipeline(webRtcEndpoint);
        webRtcEndpoint = null;
        break;

      default:
        console.error('Unrecognized message:', parsedMessage);
    }
  });
});
