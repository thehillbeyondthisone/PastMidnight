# PastMidnight - Wallpaper Engine Edition

**For when it's already dark.**

A dynamic nighttime wallpaper for Wallpaper Engine featuring time-based lighting, blue light filtering, and a beautiful starry night sky.

![Preview](preview.jpg)

## Features

- **Dynamic Time of Day**: Automatically adjusts based on your system time
  - Stars appear and brighten at night (8 PM - 6 AM)
  - Moon follows a realistic arc across the sky
  - Smooth transitions at dusk and dawn

- **Blue Light Filter**: Customizable warm color overlay
  - Adjustable intensity (0-100%)
  - Reduces eye strain during nighttime use
  - Toggle on/off as needed

- **Live Clock**: Real-time display of current time
  - 12-hour format with AM/PM
  - Updates every second
  - Subtle, non-intrusive design

- **Customizable Elements**:
  - Star count (0-200 stars)
  - Moon brightness
  - Time mode (Auto, Always Night, Dusk, Midnight)
  - Blue light filter intensity

- **Performance Optimized**:
  - Efficient particle system
  - Smooth transitions with minimal CPU usage
  - Works great on 1080p, 1440p, and 4K displays

## Installation

### From Steam Workshop (Recommended)

1. Subscribe to the wallpaper on [Steam Workshop](https://steamcommunity.com/workshop/filedetails/?id=XXXXXXX)
2. Open Wallpaper Engine
3. Find "PastMidnight" in your Library
4. Click "Apply" to set as your wallpaper

### Manual Installation

1. Download the latest release
2. Extract to: `C:\Program Files (x86)\Steam\steamapps\common\wallpaper_engine\projects\myprojects\PastMidnight\`
3. Open Wallpaper Engine
4. Click "Open from file" and select the `project.json` file
5. Click "OK" to load the wallpaper

### Development Setup

For developers who want to modify or contribute:

```bash
git clone https://github.com/thehillbeyondthisone/PastMidnight.git
cd PastMidnight/wallpaper-engine
```

Then in Wallpaper Engine:
1. Click "Editor" button
2. File → Open → Navigate to the `wallpaper-engine` folder
3. Select `project.json`
4. Make your changes
5. File → Save

## Customization

### User Properties

Access these settings by right-clicking your desktop and selecting "Wallpaper Engine Settings":

#### Blue Light Filter
- **Enable Blue Light Filter** (Toggle): Turn warm overlay on/off
- **Blue Light Filter Intensity** (0-100): Adjust strength of warm filter

#### Time Settings
- **Time of Day** (Dropdown):
  - **Auto (System Time)**: Follows your computer's clock
  - **Always Night**: Always shows nighttime scene
  - **Dusk**: Fixed twilight appearance
  - **Midnight**: Deep night with maximum stars

#### Visual Elements
- **Star Count** (0-200): Number of visible stars
- **Show Moon** (Toggle): Display/hide the moon
- **Moon Brightness** (0-100): Adjust moon glow intensity

### Editing the Code

The wallpaper uses SceneScript (JavaScript-like) for dynamic behavior:

- **scripts/clock.js**: Time display logic
- **scripts/bluelight.js**: Blue light filter effects
- **scripts/moon.js**: Moon movement and brightness
- **scripts/stars.js**: Star particle system control

Feel free to modify these to customize the behavior!

## Project Structure

```
wallpaper-engine/
├── project.json           # Wallpaper metadata
├── scene.json            # Scene configuration
├── preview.jpg           # Thumbnail preview
├── scripts/
│   ├── clock.js         # Time display script
│   ├── bluelight.js     # Blue light filter script
│   ├── moon.js          # Moon animation script
│   └── stars.js         # Stars particle script
├── materials/
│   └── stars.json       # Star particle system config
└── images/
    ├── background.png   # Night sky background
    ├── moon.png         # Moon texture
    ├── star.png         # Star particle sprite
    └── overlay.png      # Blue light filter overlay
```

## Creating Your Own Images

The wallpaper requires several image assets. See [images/README.md](images/README.md) for detailed specifications.

### Quick Start Images

For testing, you can create simple placeholder images:

1. **background.png** (1920x1080): Dark blue gradient
2. **moon.png** (512x512): White circle with soft glow
3. **star.png** (32x32): Small white dot
4. **overlay.png** (1920x1080): Warm orange color

Use any image editor (GIMP, Photoshop, Paint.NET) or online tools.

## Performance Notes

- **Low Impact**: Uses approximately 1-3% CPU on modern systems
- **Memory**: ~100-200 MB depending on image quality
- **GPU**: Minimal usage, works on integrated graphics

If you experience performance issues:
- Reduce star count to 50 or lower
- Disable bloom effects in Wallpaper Engine settings
- Lower wallpaper quality in general settings

## Troubleshooting

### Wallpaper appears black
- Ensure all required images are present in the `images/` folder
- Check Wallpaper Engine logs for errors
- Try reloading the wallpaper

### Blue light filter not working
- Check that "Enable Blue Light Filter" is toggled on
- Ensure intensity is above 0
- Verify `scripts/bluelight.js` is present

### Clock shows wrong time
- The clock uses your system time
- Verify your computer's time zone settings
- Restart Wallpaper Engine

### Stars not visible
- Increase star count in settings
- If using "Auto" time mode, check that it's nighttime (after 8 PM)
- Try switching to "Always Night" mode

## Technical Details

### SceneScript Features Used

- **update()**: Called every frame for smooth animations
- **init()**: Initializes values when wallpaper loads
- **applyUserProperties()**: Responds to user setting changes
- **Smooth interpolation**: All transitions use lerp for smoothness

### Time-Based Logic

The "Auto" mode uses system time to determine:
- **Night** (8 PM - 6 AM): Full stars, bright moon
- **Dusk** (6-8 PM): Stars appearing, moon rising
- **Dawn** (6-8 AM): Stars fading, moon setting
- **Day** (8 AM - 6 PM): Minimal stars, moon hidden

### Color Science

The blue light filter uses:
- Warm amber tone (RGB: 1.0, 0.7, 0.3)
- Additive color blending
- Dynamic intensity adjustment
- Maximum 60% opacity to avoid over-saturation

## Contributing

Contributions welcome! Areas for improvement:

- [ ] Add shooting stars effect
- [ ] Clouds layer with parallax
- [ ] Constellation patterns
- [ ] Northern lights effect
- [ ] Audio reactivity (stars pulse to music)
- [ ] Weather effects (rain, snow)
- [ ] Multiple color themes

To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test in Wallpaper Engine
5. Submit a pull request

## Resources

- [Wallpaper Engine Documentation](https://docs.wallpaperengine.io/)
- [SceneScript Reference](https://docs.wallpaperengine.io/en/scene/scenescript/reference.html)
- [SceneScript Tutorials](https://docs.wallpaperengine.io/en/scene/scenescript/tutorials.html)
- [Wallpaper Engine Workshop](https://steamcommunity.com/app/431960/workshop/)

## License

MIT License - see [../LICENSE](../LICENSE) file for details

## Credits

- Created for nighttime desktop users
- Inspired by the beauty of starry nights
- Built with Wallpaper Engine SceneScript

## Support

- Report bugs on [GitHub Issues](https://github.com/thehillbeyondthisone/PastMidnight/issues)
- Join [Wallpaper Engine Discord](https://discord.gg/wallpaperengine) for community support
- Check [Steam Workshop](https://steamcommunity.com/app/431960/workshop/) for similar wallpapers

---

**Tip**: For best experience, pair this wallpaper with f.lux or Windows Night Light for comprehensive blue light reduction across your entire system!

Made with ⭐ for nighttime productivity and gaming
