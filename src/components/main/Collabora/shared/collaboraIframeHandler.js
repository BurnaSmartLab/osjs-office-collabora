const onReadyCBs = [];
const onMessageCbs = [];

const collaboraIframeHandler = {
  isReady: false,
  initialize(iframe) {
    window.addEventListener('message', (event)=>{
      try {
        const msg = JSON.parse(event.data);

        if (!msg) {
          return;
        }

        if (msg.MessageId === 'App_LoadingStatus' && msg.Values?.Status === 'Document_Loaded') {
          this.postMessage(iframe, {'MessageId': 'Host_PostmessageReady'});

          this.isReady = true;
          onReadyCBs.forEach(cb => cb());
          return;
        }

        onMessageCbs.forEach(cb => cb(msg));
      } catch (e) {
        // Not a Collabora message
        console.error(e.message);
      }
    }, false);
  },
  onReady(cb) {
    if(!this.isReady) {
      onReadyCBs.push(cb);
      return;
    }

    cb();
  },
  onMessage(cb) {
    onMessageCbs.push(cb);
  },
  postMessage(iframe, data) {
    if(!iframe) {
      return;
    }
    console.log(data);
    iframe.contentWindow.postMessage(JSON.stringify(data), '*');
  }
};

export default collaboraIframeHandler;
