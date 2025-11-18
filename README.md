# PastMidnight

**For when it's already dark.**

A Decky Loader plugin for Steam Deck that enhances your nighttime gaming experience with automatic brightness control and blue light filtering.

## Features

- **Night Mode Toggle**: Quickly enable/disable nighttime optimizations
- **Brightness Reduction**: Reduce screen brightness by up to 100% for comfortable late-night gaming
- **Blue Light Filter**: Adjustable color temperature filtering to reduce eye strain
- **Auto-Enable Scheduling**: Automatically enable night mode based on time of day
- **Simple UI**: Easy-to-use Quick Access menu integration
- **Lightweight**: Minimal resource usage, works seamlessly in the background

## Installation

### Prerequisites

1. Install [Decky Loader](https://decky.xyz/) on your Steam Deck
2. Ensure your Steam Deck is in Developer Mode (if required)

### Method 1: From Decky Plugin Store (Coming Soon)

1. Open Decky Loader from Quick Access menu
2. Navigate to the Plugin Store
3. Search for "PastMidnight"
4. Click Install

### Method 2: Manual Installation

1. Download the latest release from [GitHub Releases](https://github.com/thehillbeyondthisone/PastMidnight/releases)
2. Extract the zip file to: `~/homebrew/plugins/PastMidnight/`
3. Restart Decky Loader or reboot your Steam Deck

### Method 3: Development Installation

```bash
# Clone the repository
git clone https://github.com/thehillbeyondthisone/PastMidnight.git
cd PastMidnight

# Install dependencies
pnpm install

# Build the plugin
pnpm run build

# Deploy to Decky (creates symlink)
mkdir -p ~/homebrew/plugins
ln -s $(pwd) ~/homebrew/plugins/PastMidnight

# Restart Decky Loader
sudo systemctl restart plugin_loader
```

## Usage

1. Press the **Quick Access** button (•••)
2. Look for the **PastMidnight** icon (moon symbol)
3. Toggle **Night Mode** to enable
4. Adjust settings:
   - **Brightness Reduction**: How much to dim the screen (0-100%)
   - **Blue Light Filter**: Color temperature adjustment intensity (0-100%)
   - **Auto Enable**: Automatically turn on/off based on time
   - **Start/End Time**: When auto-enable should activate

### Tips

- **For Reading**: Set brightness reduction to 60-70% with blue light filter at 50-60%
- **For Gaming**: Set brightness reduction to 30-40% with blue light filter at 30-40%
- **For Movies**: Set brightness reduction to 20-30% with blue light filter at 20%
- **Auto Schedule**: Default is 10 PM to 6 AM - adjust based on your sleep schedule

## How It Works

PastMidnight uses direct hardware control to adjust your Steam Deck's display:

- **Brightness Control**: Interfaces with the AMD GPU backlight driver (`/sys/class/backlight/amdgpu_bl0`)
- **Color Temperature**: Uses gamescope color management to reduce blue light
- **Settings Persistence**: Saves your preferences and automatically applies them on restart

## Development

### Building

```bash
# Install dependencies
pnpm install

# Build for production
pnpm run build

# Watch mode for development
pnpm run watch
```

### Project Structure

```
PastMidnight/
├── src/
│   └── index.tsx          # React frontend component
├── main.py                # Python backend for system control
├── plugin.json            # Plugin manifest
├── package.json           # Node.js dependencies
├── tsconfig.json          # TypeScript configuration
└── rollup.config.js       # Build configuration
```

### Testing

1. Make changes to source files
2. Run `pnpm run build`
3. Reload the plugin in Decky settings or restart Decky Loader
4. Check logs at `/tmp/pastmidnight.log` for debugging

## Troubleshooting

### Plugin doesn't appear in Quick Access

- Ensure Decky Loader is installed and running
- Check that the plugin directory exists: `~/homebrew/plugins/PastMidnight/`
- Restart Decky: `sudo systemctl restart plugin_loader`

### Settings don't apply

- Check permissions on `/sys/class/backlight/amdgpu_bl0/brightness`
- Review logs: `tail -f /tmp/pastmidnight.log`
- Ensure you're running the latest SteamOS version

### Brightness won't change

- The plugin requires Decky to run with appropriate permissions
- Some third-party overlays may conflict - try disabling them
- Reboot your Steam Deck and try again

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details

## Credits

- Built with [Decky Loader](https://github.com/SteamDeckHomebrew/decky-loader)
- Uses [decky-frontend-lib](https://github.com/SteamDeckHomebrew/decky-frontend-lib)
- Inspired by late-night gaming sessions

## Support

- Report bugs on [GitHub Issues](https://github.com/thehillbeyondthisone/PastMidnight/issues)
- Join the [Decky Loader Discord](https://deckbrew.xyz/discord) for community support
- Check the [Steam Deck Homebrew Wiki](https://wiki.deckbrew.xyz/) for more resources

---

Made with ☕ for nighttime gamers everywhere
