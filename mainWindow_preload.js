const {
    contextBridge,
    ipcRenderer
} = require('electron');

//  Expose protected methods that allow the renderer process to use
//  ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    //  Setup the shoppingList object used in mainWindow.html.
    //  This is a different shoppingList object then the one used in the addWindow
    "shoppingList", {
        //  Client side action, "client side receive action"
       receive: (channel, func) => {
           //  Define what channels to recognize
            let validChannels = ["addListItem","item:clear"];
            console.log(channel);
            //  Test this channel is in our defined validChannel list.
            if(validChannels.includes(channel)) {
                console.log('recieved request on channel: ' + channel);
                //  send to the registered shopping list channel functions in mainWindow.html
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        }
    }
)