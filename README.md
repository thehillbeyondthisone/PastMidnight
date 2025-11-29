# Past Midnight

**For when it's already dark.**

A full-featured recreation of the legendary After Dark screensavers from Berkeley Systems (1989-1997). Built with vanilla JavaScript and HTML5 Canvas, Past Midnight brings back the magic of flying toasters, starry nights, and mesmerizing patterns that defined a generation of computing.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **Nostalgically Accurate** - Faithful recreations of classic After Dark screensavers
- **Expandable Architecture** - Plugin system makes it easy to add your own screensavers
- **Vintage Control Panel** - Classic Mac/Windows 95-style settings interface
- **Full Activation System** - Idle detection, keyboard/mouse activation
- **Random Mode** - Automatically cycle through different screensavers
- **Configurable Timeout** - Set your own idle time
- **Modern & Responsive** - Works on all screen sizes
- **Persistent Settings** - Your preferences are saved locally

## Included Screensavers

### Flying Toasters
The legendary screensaver featuring toasters with wings and flying toast. The most iconic After Dark screensaver that captured the imagination of millions in the early 90s.

**Configurable options:** Speed, density, toast ratio, wing flap speed

### Starry Night
A peaceful field of twinkling stars with occasional shooting stars streaking across the night sky, complete with a city skyline.

**Configurable options:** Star density, shooting star frequency, buildings toggle, star color

### Mystify
Mesmerizing bouncing polygons with colorful trails creating hypnotic geometric patterns.

**Configurable options:** Polygon count, trail length, speed

### Warp!
Stars rushing past at warp speed, giving you the feeling of traveling through hyperspace.

**Configurable options:** Speed (including ludicrous mode), star density

### Pipes
Classic 3D pipe construction with colorful segments building across your screen.

### Matrix Code
Falling green characters inspired by The Matrix, featuring both ASCII and Katakana characters.

### Bouncing Logo
The DVD-style bouncing logo that changes color on impact. Includes a counter for the rare corner hits.

### Aquarium
Peaceful fish swimming with bubbles, swaying plants, and a sandy bottom in a serene underwater environment.

### Rain
Gentle to heavy rainfall with realistic droplets and ripple effects when drops hit the ground. Optional lightning flashes add drama to the storm.

**Configurable options:** Intensity, wind speed, lightning toggle, ripples toggle

### Bad Dog
The mischievous dog from After Dark returns to tear and scratch your screen, leaving pawprints and chaos in his wake.

**Configurable options:** Dog speed, destruction level, pawprint toggle

### Mowing Man
Watch as a lawn mower systematically cuts your screen into neat grass strips, revealing freshly mowed lawn underneath.

**Configurable options:** Mowing speed, pattern (horizontal/vertical/random), grass style

## Quick Start

### Option 1: Open Directly
Simply open `index.html` in your web browser.

### Option 2: Local Server
```bash
# Using Python 3
python3 -m http.server 8080

# Or using Node.js
npx http-server

# Then open http://localhost:8080
```

## Usage

### Basic Usage
1. Open the page in your browser
2. Click "Preview Now" to see the screensaver immediately
3. Click any screensaver card to preview that specific one
4. Move your mouse or press any key to exit

### Configuration
1. Click "Open Control Panel" to access settings
2. Select your favorite screensaver or enable Random Mode
3. Set the idle timeout (how long before activation)
4. Adjust individual screensaver settings
5. Click "Test" to preview or "OK" to save
6. The screensaver will automatically activate after the idle period

### Keyboard Shortcuts
- Any key: Exit screensaver
- Mouse movement: Exit screensaver

## Architecture

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
│   │   ├── Aquarium.js
│   │   ├── Rain.js
│   │   ├── BadDog.js
│   │   └── MowingMan.js
│   ├── ui/
│   │   └── ControlPanel.js         # Settings UI
│   └── main.js             # App initialization
└── styles/
    ├── main.css            # Main styles
    └── control-panel.css   # Control panel styles
```

## Creating Your Own Screensaver

Adding a new screensaver is straightforward. Extend the `BaseScreensaver` class:

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

    // Optional: Define configurable settings
    static get defaultSettings() {
        return {
            speed: 'normal',      // slow, normal, fast
            color: 'blue',        // red, blue, green
            enabled: true
        };
    }

    // Initialize your screensaver
    init() {
        // Set up initial state
        const settings = { ...this.constructor.defaultSettings, ...this.config };
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
- `random(min, max)` - Random float between min and max
- `randomInt(min, max)` - Random integer between min and max
- `randomColor()` - Random HSL color
- `getElapsedTime(timestamp)` - Time since screensaver start

**Lifecycle Methods:**
- `init()` - Called once when screensaver starts
- `draw(timestamp)` - Called every frame (60fps)
- `cleanup()` - Called when screensaver stops

## Screensaver Engine

The `ScreensaverEngine` manages all screensavers and provides:

- **Plugin System** - Register and manage screensavers
- **Idle Detection** - Automatically activate after inactivity
- **Settings Management** - Save/load user preferences via localStorage
- **Event System** - Subscribe to screensaver lifecycle events

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

## Customization

### Adjust Idle Timeout
Change the default timeout in the control panel or programmatically:

```javascript
engine.updateSettings({
    idleTimeout: 5 * 60 * 1000  // 5 minutes in milliseconds
});
```

### Disable Auto-Activation
```javascript
engine.updateSettings({
    enabled: false
});
```

### Customize Screensaver Behavior
Edit the screensaver source files to customize colors, speeds, and behaviors. Each screensaver exposes configurable settings through the `defaultSettings` static getter.

## History

After Dark was a series of screensavers released by Berkeley Systems from 1989 to 1997. The original purpose was practical: prevent CRT monitor burn-in. But After Dark transcended utility to become a cultural phenomenon.

Flying Toasters, released in 1989, became one of the most recognizable computer graphics of the early 1990s. The surreal image of winged toasters and flying toast captured the playful spirit of early personal computing. Other modules like Starry Night, Bad Dog, and Mowing Man became beloved classics.

Past Midnight is a tribute to these screensavers, recreated with modern web technologies while maintaining the nostalgic charm and personality of the originals.

## Credits

- **Original After Dark** - Berkeley Systems (1989-1997)
- **Inspiration** - [after-dark-css](https://github.com/bryanbraun/after-dark-css) by Bryan Braun
- **Past Midnight** - Modern recreation with expandable architecture

## License

MIT License - See LICENSE file for details.

**Note:** After Dark is a trademark of Berkeley Systems. This project is a fan recreation for educational and nostalgic purposes. Original screensaver concepts are copyright Berkeley Systems 1989-1997.

## Contributing

Want to add more screensavers? Found a bug? Contributions are welcome.

1. Fork the repository
2. Create your feature branch
3. Add your screensaver following the existing patterns
4. Test thoroughly across different screen sizes
5. Submit a pull request

## Known Issues

None currently. If you find any issues, please report them on GitHub.

## Future Possibilities

- Additional classic screensavers (Daredevil Dan, Boris the Cat, etc.)
- Sound effects with mute option
- Multi-monitor support
- Performance optimizations (OffscreenCanvas, WebGL)
- Desktop application via Electron
- Enhanced mobile/touch support
- Screensaver import/export functionality

## Support

Having issues? Questions? Open an issue on GitHub.

---

**Past Midnight** - Because the best ideas come after dark.
