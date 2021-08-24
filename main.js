const {app, BrowserWindow, Menu} = require('electron');

let mainWindow;

// Listen for the app to be ready
app.on('ready', function() {
  // Create a new window
  mainWindow = new BrowserWindow({});
  // Load html into window
  mainWindow.loadURL(`file://${__dirname}/mainWindow.html`);

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);
});

// Create menu template
const mainMenuTemplate = [{
  label: 'File',
  submenu: [
    {
      label: 'Quit',
      click() {
        app.quit();
      }
    }
  ]

}]