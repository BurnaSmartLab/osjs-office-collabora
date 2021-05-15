//wopi host (osjs) recieves messages from collabora
function handlePostMessage(event, iframeRef){
    const msg = JSON.parse(event.data);
    
    if(msg.MessageId === 'UI_SaveAs'){
        let values = {
            "Filename": 'name.txt',
            "Notify":true
        }
        WOPIPostMessage (iframeRef.current, 'UI_SaveAs' , values )
    }
}

// wopi host (osjs) sends messages to collabora
function WOPIPostMessage (iframe, msgId, values) {
    console.log('wopi post message is called')
    if (iframe) {
        let msg = {
            'MessageId': msgId,
            'SendTime': Date.now(),
            'Values': values
        };
        iframe.contentWindow.postMessage(JSON.stringify(msg), '*');
    }
}

export{handlePostMessage, WOPIPostMessage}