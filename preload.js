const {contextBridge, ipcRenderer} = require('electron');
const Store = require('electron-store');
const path = require('path');

let store;

ipcRenderer.invoke('isDev').then(flag => {
    const cwd = flag ? path.join(__dirname, './config') : path.join(__dirname, '../../config');
    store = new Store({
        name: 'fm-config',
        cwd
    });
});

const blurCallBacks = new Map();
const electronApi = {
    setStore: (key, value) => {
        return store.set(key, value);
    },

    getStore: key => {
        return store.get(key);
    },

    isPathExist: path => {
        return ipcRenderer.invoke("isPathExist", path);
    },

    creatInitDir: () => {
        return ipcRenderer.invoke("creatInitDir");
    },

    watchPath: path => {
        ipcRenderer.send("watchPath", path);
    },

    getLocalFileData: path => {
        return ipcRenderer.invoke("getLocalFileData", path);
    },

    parseFile: path => {
        return ipcRenderer.invoke("parseFile", path);
    },

    showFileInExplorer: path => {
        ipcRenderer.send("showFileInExplorer", path);
    },

    deleteFiles: paths => {
        ipcRenderer.send("daleteFiles", paths);
    },

    // type
    //     cover     覆盖原文件
    //     uncover   不覆盖原文件
    copyFiles: (filePath, copyPath, type) => {
        ipcRenderer.send("copyFiles", filePath, copyPath, type);
    },

    onFileChange: fn => {
        ipcRenderer.removeAllListeners("onFileChange");
        ipcRenderer.on("onFileChange", () => {
            fn();
        });
    },

    onPathMiss: fn => {
        ipcRenderer.removeAllListeners("onPathMiss");
        ipcRenderer.on("onPathMiss", () => {
            fn();
        });
    },

    onWindowBlur: (key, fn) => {
        blurCallBacks.set(key, fn);
        ipcRenderer.removeAllListeners("onWindowBlur");
        ipcRenderer.on("onWindowBlur", () => {
            blurCallBacks.forEach(callBack => {
                callBack();
            });
        });
    },

    onShowSetting: fn => {
        ipcRenderer.removeAllListeners("onShowSetting");
        ipcRenderer.on("onShowSetting", () => {
            fn();
        });
    },
};

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke('ping')
    // we can also expose variables, not just functions
});