# 🌙 Past Midnight

**For when it's already dark.**

A full-featured, expandable, nostalgically accurate recreation of the legendary **After Dark** screensavers from Berkeley Systems (1989-1997). Experience the magic of flying toasters, starry nights, and mesmerizing patterns that defined a generation of computing.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 🎨 **Nostalgically Accurate** - Faithful recreations of classic After Dark screensavers
- 🔌 **Expandable Architecture** - Plugin system makes it easy to add your own screensavers
- ⚙️ **Vintage Control Panel** - Classic Mac/Windows 95-style settings interface
- ⌨️ **Full Activation System** - Idle detection, keyboard/mouse activation
- 🎲 **Random Mode** - Automatically cycle through different screensavers
- ⏱️ **Configurable Timeout** - Set your own idle time
- 📱 **Modern & Responsive** - Works on all screen sizes
- 💾 **Persistent Settings** - Your preferences are saved locally

## 🎮 Included Screensavers

### 🍞 Flying Toasters
The legendary screensaver featuring toasters with wings and flying toast. The most iconic After Dark screensaver that captured the imagination of millions.

### ⭐ Starry Night
A peaceful field of twinkling stars with occasional shooting stars streaking across the night sky.

### 💫 Mystify
Mesmerizing bouncing polygons with colorful trails creating hypnotic geometric patterns.

### 🌟 Warp!
Stars rushing past at warp speed, giving you the feeling of traveling through hyperspace.

### 🔧 Pipes
Classic 3D pipe construction with colorful segments building across your screen.

### 💚 Matrix Code
Falling green characters inspired by The Matrix, featuring both ASCII and Katakana characters.

### 📀 Bouncing Logo
The legendary bouncing logo that changes color on impact. Includes a counter for the rare corner hits!

### 🐠 Aquarium
Peaceful fish swimming with bubbles in a serene underwater environment.

## 🚀 Quick Start

### Option 1: Open Directly
Simply open `index.html` in your web browser.

### Option 2: Local Server
```bash
# Using Python 3
python3 -m http.server 8080

# Or using npm
npm start

# Then open http://localhost:8080
```

## 🎯 Usage

### Basic Usage
1. Open the page
2. Click **"Preview Now"** to see the screensaver immediately
3. Click any screensaver card to preview that specific one
4. Move your mouse or press any key to exit

### Configuration
1. Click **"Open Control Panel"** to access settings
2. Select your favorite screensaver or enable Random Mode
3. Set the idle timeout (how long before activation)
4. Click **"Test"** to preview or **"OK"** to save
5. The screensaver will automatically activate after the idle period

### Keyboard Shortcuts
- Any key: Exit screensaver
- Mouse movement: Exit screensaver

## 🔧 Architecture

Past Midnight uses a clean, modular plugin architecture that makes it easy to add new screensavers.

```
PastMidnight/
├── index.html              # Main HTML page
├── src/
│   ├── core/
│   │   ├── BaseScreensaver.js      # Abstract base class
│   │   └── ScreensaverEngine.js    # Core engine
│   ├── screensavers/
│   │   ├── FlyingToasters.js
│   │   ├── StarryNight.js
│   │   ├── Mystify.js
│   │   ├── Warp.js
│   │   ├── Pipes.js
│   │   ├── Matrix.js
│   │   ├── BouncingLogo.js
│   │   └── Aquarium.js
│   ├── ui/
│   │   └── ControlPanel.js         # Settings UI
│   └── main.js             # App initialization
└── styles/
    ├── main.css            # Main styles
    └── control-panel.css   # Control panel styles
```

## 🛠️ Creating Your Own Screensaver

Adding a new screensaver is simple! Just extend the `BaseScreensaver` class:

```javascript
import { BaseScreensaver } from '../core/BaseScreensaver.js';

export class MyScreensaver extends BaseScreensaver {
    // Define metadata
    static get metadata() {
        return {
            id: 'my-screensaver',
            name: 'My Awesome Screensaver',
            description: 'Does something cool!',
            icon: '🎨',
            author: 'Your Name',
            year: 2025
        };
    }

    // Initialize your screensaver
    init() {
        // Set up initial state
        this.myValue = 0;
    }

    // Main draw loop (called every frame)
    draw(timestamp) {
        // Clear or fade background
        this.fillBackground('#000');

        // Draw your animation
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(100, 100, 200, 200);

        // Update state
        this.myValue++;
    }

    // Optional: cleanup when screensaver stops
    cleanup() {
        // Clean up resources
    }
}
```

Then register it in `src/main.js`:

```javascript
import { MyScreensaver } from './screensavers/MyScreensaver.js';

// In the init() function:
engine.register(MyScreensaver);
```

### BaseScreensaver API

The `BaseScreensaver` class provides many useful utilities:

**Canvas Methods:**
- `this.ctx` - Canvas 2D context
- `this.width`, `this.height` - Canvas dimensions
- `clear()` - Clear the canvas
- `fillBackground(color)` - Fill with solid color

**Utility Methods:**
- `random(min, max)` - Random float
- `randomInt(min, max)` - Random integer
- `randomColor()` - Random HSL color
- `getElapsedTime(timestamp)` - Time since start

**Lifecycle Methods:**
- `init()` - Called once at start
- `draw(timestamp)` - Called every frame
- `cleanup()` - Called when stopping

## 🎨 Screensaver Engine

The `ScreensaverEngine` manages all screensavers and provides:

- **Plugin System** - Register and manage screensavers
- **Idle Detection** - Automatically activate after inactivity
- **Settings Management** - Save/load user preferences
- **Event System** - Subscribe to screensaver events

```javascript
import { engine } from './core/ScreensaverEngine.js';

// Start a specific screensaver
engine.start('flying-toasters');

// Start with random mode
engine.updateSettings({ randomMode: true });
engine.start();

// Listen to events
engine.on('screensaver:started', (data) => {
    console.log('Started:', data.metadata.name);
});
```

## 🎭 Customization

### Adjust Idle Timeout
Change the default timeout in the control panel or programmatically:

```javascript
engine.updateSettings({
    idleTimeout: 5 * 60 * 1000  // 5 minutes
});
```

### Disable Auto-Activation
```javascript
engine.updateSettings({
    enabled: false
});
```

### Change Screensaver Colors
Edit the screensaver source files to customize colors, speeds, and behaviors.

## 📜 History

After Dark was a series of screensavers released by Berkeley Systems from 1989 to 1997. Flying Toasters, released in 1989, became a cultural phenomenon and one of the most recognizable computer graphics of the early 1990s.

Past Midnight is a tribute to these classic screensavers, recreated with modern web technologies while maintaining the nostalgic charm of the originals.

## 🙏 Credits

- **Original After Dark** - Berkeley Systems (1989-1997)
- **Inspiration** - [after-dark-css](https://github.com/bryanbraun/after-dark-css) by Bryan Braun
- **Past Midnight** - Modern recreation with expandable architecture

## 📄 License

MIT License - See LICENSE file for details

**Note:** After Dark™ is a trademark of Berkeley Systems. This project is a fan recreation for educational and nostalgic purposes. Original screensaver concepts © Berkeley Systems 1989-1997.

## 🤝 Contributing

Want to add more screensavers? Found a bug? Contributions are welcome!

1. Fork the repository
2. Create your feature branch
3. Add your screensaver following the examples
4. Test thoroughly
5. Submit a pull request

## 🐛 Known Issues

- None currently! But if you find any, please report them.

## 🔮 Future Ideas

- [ ] More classic screensavers (Mowing Man, Solitaire, etc.)
- [ ] Sound effects (with mute option)
- [ ] Multi-monitor support
- [ ] Performance optimizations
- [ ] Export as Electron app for desktop
- [ ] Mobile touch support
- [ ] Screensaver marketplace/sharing

## 💬 Support

Having issues? Questions? Open an issue on GitHub!

---

Made with 🌙 and nostalgia

**Past Midnight** - Because the best ideas come after dark.
