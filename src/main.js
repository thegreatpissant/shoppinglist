const {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
} = require("electron");
const path = require("path");
const fs = require("fs");

const { dialog } = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

async function createWindow() {

  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: path.join(__dirname, "preload.js") // use a preload script
    }
  });

  // Load app
  win.loadFile(path.join(__dirname, "index.html"));

  // rest of code..

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);

}

app.on("ready", createWindow);

ipcMain.on("toMain", (event, args) => {
	console.log("I got an event");
//  fs.readFile("path/to/file", (error, data) => {
    // Do something with file contents

    // Send result back to renderer process
 //   win.webContents.send("fromMain", responseObj);
 // });
	win.webContents.send("You got my message");
});

const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open',
        click() {
          const openFile = dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] });
          console.log(openFile);
        },
        accelerator: process.platform === 'darwin'? 'Command+O':'Ctrl+O'
      },
      {
        label: 'Developer Tools',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
        accelerator: process.platform === 'darwin'? 'Command+I':'Ctrl+I'
      }
    ]
  }
];