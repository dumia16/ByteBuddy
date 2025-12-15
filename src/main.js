const { app, BrowserWindow, Tray, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let settingsWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 240,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    hasShadow: false, // Disable shadow to reduce ghosting
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      offscreen: false,
      enableWebSQL: false,
      // Enable GPU acceleration
      disableHardwareAcceleration: false
    },
    // macOS specific options to reduce ghosting
    ...(process.platform === 'darwin' && {
      vibrancy: null, // Disable vibrancy
      visualEffectState: 'active'
    })
  });

  mainWindow.loadFile('src/index.html');

  // Dev mode: open devtools
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createSettingsWindow() {
  // Don't create multiple settings windows
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 500,
    height: 600,
    transparent: false,
    frame: true,
    alwaysOnTop: false,
    resizable: false,
    title: 'ByteBuddy Settings',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  settingsWindow.loadFile('src/settings.html');

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
}

function showChangeImageDialog() {
  dialog.showOpenDialog({
    title: 'Choose Pet Image',
    filters: [
      { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif'] }
    ],
    properties: ['openFile']
  }).then(result => {
    if (!result.canceled && result.filePaths.length > 0) {
      const imagePath = result.filePaths[0];

      // Read image as base64
      fs.readFile(imagePath, (err, data) => {
        if (err) {
          dialog.showErrorBox('Error', 'Failed to load image');
          return;
        }

        const base64 = data.toString('base64');
        const ext = path.extname(imagePath).substring(1);
        const dataUrl = `data:image/${ext};base64,${base64}`;

        // Send to renderer
        if (mainWindow) {
          mainWindow.webContents.send('update-pet-image', dataUrl);
        }
      });
    }
  });
}

function createTray() {
  const iconPath = path.join(__dirname, '../assets/tray-iconTemplate.png');
  tray = new Tray(iconPath);

  // Set as template image for macOS (adapts to light/dark mode)
  tray.setToolTip('ByteBuddy 🐾');
  if (process.platform === 'darwin') {
    const nativeImage = require('electron').nativeImage;
    const image = nativeImage.createFromPath(iconPath);
    image.setTemplateImage(true);
    tray.setImage(image);
  }

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show ByteBuddy',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Settings',
      click: () => {
        createSettingsWindow();
      }
    },
    {
      label: 'Change Pet Image',
      click: () => {
        showChangeImageDialog();
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);

  tray.setToolTip('ByteBuddy - Your Desktop Pet');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    if (mainWindow) {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // On macOS, keep app running even when window is closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for reminders
ipcMain.on('show-notification', (event, data) => {
  console.log('Notification:', data);
  // System notifications will be handled in renderer
});

// Force window repaint for macOS transparency ghosting fix
ipcMain.on('force-repaint', () => {
  if (mainWindow && process.platform === 'darwin') {
    // Method 1: Force bounds refresh
    const bounds = mainWindow.getBounds();
    mainWindow.setBounds({
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height
    });

    // Method 2: Force window to redraw by toggling opacity very slightly
    const currentOpacity = mainWindow.getOpacity();
    mainWindow.setOpacity(0.99);
    setTimeout(() => {
      mainWindow.setOpacity(currentOpacity);
    }, 10);

    // Method 3: Invalidate the window shadow (forces complete redraw on macOS)
    mainWindow.setHasShadow(false);
    setTimeout(() => {
      mainWindow.setHasShadow(false); // Keep shadow off for transparent window
    }, 10);

    // Method 4: Force a webContents repaint
    if (mainWindow.webContents) {
      mainWindow.webContents.invalidate();
    }
  }
});

// Handle pet image updates from settings window
ipcMain.on('update-pet-image', (event, imageData) => {
  if (mainWindow) {
    mainWindow.webContents.send('update-pet-image', imageData);
  }
});

// Handle settings changes to restart reminders
ipcMain.on('settings-changed', () => {
  if (mainWindow) {
    mainWindow.webContents.send('settings-changed');
  }
});
