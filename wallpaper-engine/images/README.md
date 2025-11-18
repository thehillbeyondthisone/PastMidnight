# Image Assets

This directory contains the image assets for the PastMidnight wallpaper.

## Required Images

### background.png
- **Size**: 1920x1080 (or higher for 4K support)
- **Description**: Deep night sky gradient background
- **Colors**: Dark blue to black gradient (RGB: 2,1,5 at top to 10,15,30 at bottom)
- **Format**: PNG with no transparency

### moon.png
- **Size**: 512x512 recommended
- **Description**: Moon texture with craters and details
- **Colors**: Pale yellow-white with gray details
- **Format**: PNG with transparency (alpha channel)
- **Notes**: Should have soft glow around edges

### star.png
- **Size**: 16x16 to 32x32
- **Description**: Single star particle sprite
- **Colors**: White with soft glow
- **Format**: PNG with transparency (alpha channel)
- **Notes**: Should be a small bright dot with radial gradient fade

### overlay.png
- **Size**: 1920x1080 (match background size)
- **Description**: Full-screen solid color overlay for blue light filter
- **Colors**: Solid warm color (will be tinted by script)
- **Format**: PNG, can be a simple solid color
- **Notes**: Alpha will be controlled by script

## Creating the Assets

You can create these images using:
- **Photoshop/GIMP**: For detailed work
- **Blender**: For realistic moon renders
- **Free resources**: Search for Creative Commons licensed space images
- **AI Generation**: Tools like Stable Diffusion or DALL-E

## Quick Setup

For quick testing, you can use solid colors:
- background.png: 1920x1080 dark blue (#020105)
- moon.png: 512x512 white circle with gaussian blur
- star.png: 16x16 white dot with radial gradient
- overlay.png: 1920x1080 warm orange (#FFAA66) solid

## License Considerations

Ensure any images you use are:
- Created by you, OR
- Licensed for use (Creative Commons, Public Domain, etc.), OR
- Properly attributed if required by license

Do not use copyrighted images without permission.
