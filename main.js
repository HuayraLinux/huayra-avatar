/* jshint node: true */
'use strict';

const electron             = require('electron');
const Menu                 = electron.Menu;
const path                 = require('path');
const {app, BrowserWindow} = electron;
const dirname              = __dirname || path.resolve(path.dirname());
const entrypoint     = `file://${dirname}/src/index.html`;

let mainWindow = null;

electron.ipcMain.on('showDevTools', function showDevTools() {
  mainWindow.webContents.openDevTools();
});

// Uncomment the lines below to enable Electron's crash reporter
// For more information, see http://electron.atom.io/docs/api/crash-reporter/

// electron.crashReporter.start({
//     productName: 'YourName',
//     companyName: 'YourCompany',
//     submitURL: 'https://your-domain.com/url-to-submit',
//     autoSubmit: true
// });

app.on('window-all-closed', function onWindowAllClosed() {
        app.quit();
});

app.on('ready', function onReady() {
    mainWindow = new BrowserWindow({
        width: 911,
        height: 610,
        minWidth: 911,
        minHeight: 610,
        webPreferences: {
            nodeIntegration: true
        }
    });

    delete mainWindow.module;

    // If you want to open up dev tools programmatically, call
    // mainWindow.openDevTools();

    // By default, we'll open the app by directly going to the
    // file system.
    mainWindow.loadURL(entrypoint);


    // Create the Application's main menu
    // var template = [{
    //     label: "Application",
    //     submenu: [
    //         { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
    //         { type: "separator" },
    //         { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
    //     ]}, {
    //     label: "Edit",
    //     submenu: [
    //         { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
    //         { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
    //         { type: "separator" },
    //         { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
    //         { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
    //         { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
    //         { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    //     ]}
    // ];
    //Menu.setApplicationMenu(Menu.buildFromTemplate(template));

    // If a loading operation goes wrong, we'll send Electron back to
    // app entry point
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

    // Handle an unhandled error in the main thread
    //
    // Note that 'uncaughtException' is a crude mechanism for exception handling intended to
    // be used only as a last resort. The event should not be used as an equivalent to
    // "On Error Resume Next". Unhandled exceptions inherently mean that an application is in
    // an undefined state. Attempting to resume application code without properly recovering
    // from the exception can cause additional unforeseen and unpredictable issues.
    //
    // Attempting to resume normally after an uncaught exception can be similar to pulling out
    // of the power cord when upgrading a computer -- nine out of ten times nothing happens -
    // but the 10th time, the system becomes corrupted.
    //
    // The correct use of 'uncaughtException' is to perform synchronous cleanup of allocated
    // resources (e.g. file descriptors, handles, etc) before shutting down the process. It is
    // not safe to resume normal operation after 'uncaughtException'.
    process.on('uncaughtException', (err) => {
        console.log('An exception in the main thread was not handled.');
        console.log('This is a serious issue that needs to be handled and/or debugged.');
        console.log(`Exception: ${err}`);
    });


});
