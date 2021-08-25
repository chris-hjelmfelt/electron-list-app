const {app, BrowserWindow, Menu, ipcMain} = require('electron');

//Set ENV
//process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

// Listen for the app to be ready
app.on('ready', function() {
  // Create a new window
  mainWindow = new BrowserWindow({
    webPreferences:{
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  // Load html into window
  mainWindow.loadURL(`file://${__dirname}/mainWindow.html`);

  // Quit app when closed
  mainWindow.on('closed', function() {
    app.quit();
  });

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);
});

// Handle add window
function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add list item',
    webPreferences:{
      nodeIntegration: true,
      contextIsolation: false
    }    
  });
  addWindow.loadURL(`file://${__dirname}/addWindow.html`);
  // Garbage collection handle
  addWindow.on('close', function() {
    addWindow = null;
  });
};

// catch item add
ipcMain.on('item:add', function(e, item) {
  mainWindow.webContents.send('item:add', item);
  addWindow.close();
});

// Create menu template
const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Item',
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
        accelerator: process.platform == 'darwin' ?  'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
];

// If Mac, add an empty object to menu
if (process.platform == 'darwin') {
  mainMenuTemplate.unshift({});
}

// Add developer tools menu if in dev mode
if(process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push({
    label:'Dev Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ?  'Command+I' : 'Ctrl+I',
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