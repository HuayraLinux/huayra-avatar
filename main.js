/* jshint node: true */
'use strict';

const electron             = require('electron');
const Menu                 = electron.Menu;
const path                 = require('path');
const {app, BrowserWindow} = electron;
const dirname              = __dirname || path.resolve(path.dirname());
const entrypoint     = `file://${dirname}/dist/index.html`;

let mainWindow = null;

electron.ipcMain.on('showDevTools', function showDevTools() {
  mainWindow.webContents.openDevTools();
});

app.on('window-all-closed', function onWindowAllClosed() {
        app.quit();
});

app.on('ready', function onReady() {
    mainWindow = new BrowserWindow({
        width: 911,
        height: 610,
        minWidth: 911,
        minHeight: 610
    });

    delete mainWindow.module;

    mainWindow.loadURL(entrypoint);

    mainWindow.webContents.on('did-fail-load', () => {
        mainWindow.loadURL(entrypoint);
    });

    mainWindow.webContents.on('crashed', () => {
        console.log('Your app (or other code) in the main window has crashed.');
        console.log('This is a serious issue that needs to be handled and/or debugged.');
    });

    mainWindow.on('unresponsive', () => {
        console.log('Your app (or other code) has made the window unresponsive.');
    });

    mainWindow.on('responsive', () => {
        console.log('The main window has become responsive again.');
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    process.on('uncaughtException', (err) => {
        console.log('An exception in the main thread was not handled.');
        console.log('This is a serious issue that needs to be handled and/or debugged.');
        console.log(`Exception: ${err}`);
    });

});
