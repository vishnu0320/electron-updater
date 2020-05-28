const { app, BrowserWindow,Menu, ipcMain,dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');


autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

//-------------------

let template = []
if (process.platform === 'darwin') {
  // OS X
  const name = app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() { app.quit(); }
      },
    ]
  })
}
//---------------------------

//let win;


let mainWindow;


  function sendStatusToWindow(text) {
    log.info(text);
    mainWindow.webContents.send('message', text);
  }

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  mainWindow.webContents.openDevTools();
  // mainWindow.loadFile('index.html');
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  mainWindow.loadURL(`file://${__dirname}/version.html#v${app.getVersion()}`);
  return mainWindow;
}


//   //check update after open app
//   mainWindow.once('ready-to-show', () => {
//     autoUpdater.checkForUpdatesAndNotify();
//   });
// }
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
});
app.on('ready', () => {
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('ready', function()  {
  autoUpdater.checkForUpdatesAndNotify();
});

// app.on('activate', function () {
//   if (mainWindow === null) {
//     createWindow();
//   }
// });

// ipcMain.on('app_version', (event) => {
//   event.sender.send('app_version', { version: app.getVersion() });
// });

// ipcMain.on('restart_app', () => {
//   autoUpdater.quitAndInstall();
// });