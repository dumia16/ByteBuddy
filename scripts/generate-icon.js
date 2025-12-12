// Simple script to generate a placeholder tray icon
// This creates a minimal PNG that can be replaced later

const fs = require('fs');
const path = require('path');

// Create a simple 16x16 PNG (tray icon size for macOS)
// This is a base64 encoded minimal dog emoji-like icon
const iconBase64 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAdgAAAHYBTnsmCAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAE3SURBVDiNpZK/SgNBEMZ/s7ubS7xESOwsRLC0EqwsBEsLwUKwsxHExldQn8JCfAALG7GwEBTBQrAQLASLFCKCjXgkd3u7MxZnLomJhYUDw8LOfN/M/JmBf5YJAKqqIiJYa3HOAdBut+l0OgghUFV1CZgAaLVaeO9xzmGMwXuP955mswnAwcEB5+fnDAYDnHPfxgDK5TKlUgkRYTQaMZlMqNVqGGMQEcbjMavVKm9vbzw+PjIcDgE4PDxkZ2eHfr/P/f0929vbVCoVut0uR0dHHB8f0+v1WF9fp9lsYq1lfX0dVeXy8pKXlxdu7u64vb3F+WwLt7a2SCk9e/h4MEYIYU0pdQxsAlPgSlWvgefvAv4EJBH5TF9E3r0QQkoppZSeTCaZ+zIkXdBlAKXAP/2dYvvfAHwBFuaIVSWiU6UAAAAASUVORK5CYII=';

const assetsDir = path.join(__dirname, '../assets');

// Ensure assets directory exists
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Write the icon
const iconPath = path.join(assetsDir, 'tray-icon.png');
const iconBuffer = Buffer.from(iconBase64, 'base64');
fs.writeFileSync(iconPath, iconBuffer);

console.log('✅ Tray icon generated at:', iconPath);
console.log('📝 Note: This is a placeholder icon. Replace it with your own design!');
