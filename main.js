const electron = require('electron');
const url = require('url');
const path = require('path');

//  Set environment
// process.env.NODE_ENV = 'production';
process.env.NODE_ENV = 'development';

const {
	app,
	BrowserWindow,
	ipcMain,
	Menu,
} = electron;

let mainWindow;
let addWindow;

electron.

//  Listen for app to be ready
app.on('ready', function() {
	//  Create new window
	mainWindow = new BrowserWindow({
		webPreferences: {
			nodeIntegration: false,		//  Default
			contextIsolation: true,		//  Protect Against prototype pollution
			enableRemoteModule: false,	//  Turn off remote
			preload: path.join(__dirname, "mainWindow_preload.js")	//  Preload script, IPC setup
		}
	});
	//  Load the html file
	mainWindow.loadURL(url.format({
		//  Generate 'file:///<dirname>/mainWindow.html'
		pathname: path.join(__dirname, 'mainWindow.html'),
		protocol: 'file:',
		slashes: true
	}));
	//  Quit the entire app when closed
	mainWindow.on('closed', function() {
		app.quit();
	});

	//  Build menu from template
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	//  Insert the menu
	Menu.setApplicationMenu(mainMenu);
});

//  Handle create add window event
function createAddWindow() {
	//  Create new window
	addWindow = new BrowserWindow({
		width: 300,
		height: 200,
		title: 'Add Shopping List Item',

		//  Create a secure version of the application.
		//  @@REFERENCE: https://stackoverflow.com/questions/19059580/client-on-node-uncaught-referenceerror-require-is-not-defined
		//  Discussion https://github.com/electron/electron/issues/9920#issuecomment-575839738  bug:
		//  'fn' should be 'func'
		//  Better example https://github.com/electron/electron/issues/21437#issuecomment-573522360
		//  Ensure only specific modules are shared to the client side.
		webPreferences: {
			nodeIntegration: false,		//  Default
			contextIsolation: true,		//  Protect Against prototype pollution
			enableRemoteModule: false,	//  Turn off remote
			preload: path.join(__dirname, "addWindow_preload.js")	//  Preload script, IPC setup
		}
	});


	//  Load the html file
	addWindow.loadURL(url.format({
		//  Generate 'file:///<dirname>/mainWindow.html'
		pathname: path.join(__dirname, 'addWindow.html'),
		protocol: 'file:',
		slashes: true
	}));

	//  Garbage collection
	addWindow.on('close', function() {
		addWindow = null;
	});
}

//  Add list item
//  Listen on the addWindow channel setup in the addWindow_preload.js
ipcMain.on("addWindow",  (event, channel, item) => {
	//  This addWindow channel "addWindow" receives the event from the addWindow_preload.js
	console.log("Sending item to main window addListItem")
	//  Send this information to the mainwindow_preload.js addListItem channel
	mainWindow.webContents.send("addListItem", item);
	console.log("Sending item to main window addListItem = DONE")
});


//  Create a menu template
const mainMenuTemplate = [
	{
		label:'File',
		submenu:[
			{
				label: 'Add Item',
				accelerator: process.platform === 'darwin'? 'Command+A' : "Ctrl+A",
				click() {
					createAddWindow();
				}
			},
			{
				label: 'Clear Items',
				click() {
					mainWindow.webContents.send('item:clear');
				}
			},
			{
				label: 'Quit',
				accelerator: process.platform === 'darwin'? 'Command+Q' : 'Ctrl+Q',
				click() {
					app.quit();
				}
			}
		]
	}
];

//  Add developer tools if not in production
if(process.env.NODE_ENV !== 'production') {
	mainMenuTemplate.push({
		label: 'Developer Tools',
		submenu: [
			{
				label: 'Dev Tools',
				accelerator: process.platform === 'darwin'? 'Command+I' : 'Ctrl+I',
				//  Tell what window to pop on
				click(item, focusedWindow) {
					focusedWindow.toggleDevTools();	
				}
			},
			{
				role: 'reload'
			}
		]
	});
}


//  A Mac requires customizations to the menubar for it to work
if (process.platform === 'darwin') {
	mainMenuTemplate.unshift({ });
}
