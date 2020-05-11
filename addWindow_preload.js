const {
    contextBridge,
    ipcRenderer
} = require('electron');

//  Expose protected methods that allow the renderer process to use
//  ipcRenderer without exposing the entire object
//  Think of this as Client side "send"
contextBridge.exposeInMainWorld(
    //  Setup the shoppingList object used in addWindow.html
    "shoppingList", {
        //  shoppingList.send from addWindow.html
        send: (channel, data) => {
            //  define a set of valid channels
            let validChannels = ['addListItem'];
            //  test the channel is in the valid channel list
            if (validChannels.includes(channel)) {
                //  send the main.js IPC listening on the 'addWindow' channel, this channel designation and event data
                ipcRenderer.send('addWindow', channel, data);
            }
        }
    }
)