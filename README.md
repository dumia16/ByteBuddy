# ByteBuddy 🐾

> Bring your pet to your desktop - a lightweight, customizable desktop companion that keeps you hydrated and reminds you to take breaks.

![ByteBuddy Demo](docs/demo.png)
*Meet JayJay, the original ByteBuddy!*

## 💡 Inspiration

Remember those virtual pet apps from the 90s? I was obsessed with them in high school (my parents wouldn't let me have a real pet). Fast forward to now - I have my own dog JayJay, and I wanted to bring him onto my desktop so I can see him while working. ByteBuddy is the best of both worlds: a virtual companion based on your actual pet!

## ✨ Features

### 🐕 **Your Pet, Your Desktop**
- Upload your own pet's photo through the settings
- Transparent, draggable window that floats on your screen
- Always-on-top companion that stays visible
- Smooth animations with no ghosting (optimized for macOS)

### 💧 **Smart Reminders**
- **Water Reminders** - Configurable intervals to stay hydrated
- **Walk Reminders** - Set a specific time for your daily walk break
- Desktop notifications with playful messages
- Animated speech bubbles
- Pet celebrates when you acknowledge reminders!

### ⚙️ **Easy Customization**
- **System Tray Menu** - Quick access from your macOS menu bar
- **Settings Window** - Clean UI to configure everything
- Upload custom pet images (PNG, JPG, GIF up to 5MB)
- Toggle reminders on/off
- Adjust reminder frequencies
- Settings persist across sessions

### 🎭 **Animated Pet**
- Idle animations (gentle bounce, wiggle, tilt)
- Alert states when reminders pop up
- Celebration with hearts when you click OK
- Hardware-accelerated rendering for smooth performance

## 🚀 Quick Start

### For New Users

1. **Clone the repository**
   ```bash
   git clone https://github.com/dumia16/ByteBuddy.git
   cd ByteBuddy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the app**
   ```bash
   npm start
   ```

4. **Customize your pet**
   - Look for the paw print icon 🐾 in your macOS menu bar (top right)
   - Click it → Select "Settings"
   - Click "Choose Image" to upload your pet's photo
   - Adjust reminder settings to your preference
   - Click "Save Settings"

That's it! Your personalized desktop pet is ready to go!

### Development Mode

Run with DevTools for debugging:
```bash
npm start -- --dev
```

## 📁 Project Structure

```
ByteBuddy/
├── assets/
│   ├── pet.png              # Default pet image
│   ├── tray-iconTemplate.png # Menu bar icon (paw print)
│   └── tray-icon-option*.png # Alternative icon designs
├── src/
│   ├── main.js              # Electron main process, tray menu
│   ├── index.html           # Pet window UI
│   ├── settings.html        # Settings window UI
│   ├── styles.css           # Pet window styling
│   ├── renderer.js          # Pet window logic (reminders, animations, repaint)
│   ├── settings-renderer.js # Settings window logic
│   └── pet.js               # Pet component & animation behaviors
├── package.json
└── README.md
```

## 🎨 Customization Guide

### Create a Cartoon Version with Nano Banana (Optional)

Want to turn your pet into an adorable cartoon character? Use Nano Banana AI to generate a cartoon version:

1. **Generate your pet's cartoon**
   - Visit [Nano Banana](https://nanobanana.ai) (or use Claude with prompt engineering)
   - Upload your pet's photo
   - Prompt: "Create a cute cartoon/anime style character of this dog/cat with simple, clean lines"
   - Download the generated image

2. **Upload to ByteBuddy**
   - Follow the steps below to upload your new cartoon pet image!

### Upload Your Pet's Photo (Recommended)

The easiest way to personalize ByteBuddy:

1. Click the 🐾 icon in your menu bar
2. Select "Settings"
3. Click "Choose Image"
4. Select your pet's photo (supports PNG, JPG, GIF)
5. Preview appears automatically
6. Click "Save Settings"

Your pet image is saved locally and will persist when you restart the app!

### Quick Image Change

You can also use the "Change Pet Image" option directly from the menu bar for quick uploads.

### Reset to Default

In Settings, click "Reset to Default" to return to the original JayJay image.

## ⚙️ Settings

Access settings through the menu bar icon (🐾):

### Pet Image
- **Choose Image** - Upload your pet's photo
- **Reset to Default** - Return to JayJay
- Supported formats: PNG, JPG, GIF
- Max file size: 5MB

### Water Reminders
- **Enable/Disable** - Toggle water reminders
- **Interval** - Set frequency in minutes (default: 120 min / 2 hours)

### Walk Reminders
- **Enable/Disable** - Toggle walk reminders
- **Time** - Set specific time for daily walk (default: 18:00)

All settings are saved automatically in localStorage.

## 🔧 Technical Details

### Tech Stack
- **Electron** - Cross-platform desktop framework
- **Vanilla JavaScript** - No dependencies, lightweight and fast
- **localStorage** - Settings and image persistence
- **macOS Integration** - System tray menu, notifications

### Performance Optimizations
- **Hardware Acceleration** - GPU-accelerated rendering with CSS transforms
- **Force Repaint System** - Multi-layered approach to prevent ghosting on macOS transparent windows
- **Efficient Storage** - Base64 image encoding for quick loading

### Platform Support
- **macOS** - Fully supported with menu bar integration
- **Windows/Linux** - Core features work, but some UI optimizations are macOS-specific

## 🐛 Troubleshooting

### Pet not showing up?
- Make sure the window isn't off-screen (restart the app)
- Check if transparency is supported on your OS
- Try running in dev mode: `npm start -- --dev`

### Notifications not working?
- Check System Preferences > Notifications
- Ensure ByteBuddy has notification permissions
- Try restarting the app

### Can't see the menu bar icon?
- Look for the 🐾 paw print in your macOS menu bar (top right)
- If missing, make sure the app is running

### Image upload fails?
- Check file size (max 5MB)
- Ensure file format is PNG, JPG, or GIF
- Try a smaller image if you see storage quota errors

## 🎯 Future Enhancements

Ideas for extending ByteBuddy:

- [ ] **Multiple Pet Support** - Switch between different pets
- [ ] **More Animations** - Walking, sleeping, playing
- [ ] **Pomodoro Timer** - Work session tracking
- [ ] **Activity Stats** - Track hydration and break streaks
- [ ] **Custom Reminder Messages** - Personalize what your pet says
- [ ] **Weather Integration** - Pet reacts to weather
- [ ] **Windows/Linux Optimization** - Platform-specific improvements

## 📝 License

MIT

## 🙏 Credits

Created with love for JayJay 🐕 and inspired by the virtual pet apps of the 90s.

Built using Electron and lots of coffee ☕

---

## 💬 Community

Found a bug? Have an idea? Want to share your pet?
- Open an issue
- Submit a PR
- Share screenshots of your desktop buddy!

Happy pet parenting! 🐾
