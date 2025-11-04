/*
 * @Author: yum richardminyu@foxmail.com
 * @Date: 2025-11-04 12:38:27
 * @LastEditors: yum richardminyu@foxmail.com
 * @LastEditTime: 2025-11-04 12:38:43
 * @FilePath: \FM-mp\main.js
 * @Description:
 */
const {app, BrowserWindow, ipcMain} = require('electron/main')
const path = require('node:path')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong')
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})