import os
import json
import subprocess
import logging
from pathlib import Path
from typing import Dict, Any

# Set up logging
logging.basicConfig(
    filename="/tmp/pastmidnight.log",
    format='[PastMidnight] %(asctime)s %(levelname)s %(message)s',
    level=logging.INFO
)
logger = logging.getLogger()

class Plugin:
    async def get_settings(self) -> Dict[str, Any]:
        """Load settings from file or return defaults."""
        settings_path = self._get_settings_path()

        default_settings = {
            "enabled": False,
            "brightness": 50,
            "blueLight": 0,
            "autoEnable": False,
            "startTime": 22,
            "endTime": 6,
        }

        try:
            if settings_path.exists():
                with open(settings_path, 'r') as f:
                    return json.load(f)
        except Exception as e:
            logger.error(f"Error loading settings: {e}")

        return default_settings

    async def save_settings(self, settings: Dict[str, Any]) -> bool:
        """Save settings to file."""
        settings_path = self._get_settings_path()

        try:
            settings_path.parent.mkdir(parents=True, exist_ok=True)
            with open(settings_path, 'w') as f:
                json.dump(settings, f, indent=2)
            logger.info("Settings saved successfully")
            return True
        except Exception as e:
            logger.error(f"Error saving settings: {e}")
            return False

    async def apply_settings(self, settings: Dict[str, Any]) -> bool:
        """Apply brightness and color temperature settings."""
        try:
            if not settings.get("enabled", False):
                logger.info("Night mode disabled, resetting to defaults")
                self._reset_display()
                return True

            brightness = settings.get("brightness", 0)
            blue_light = settings.get("blueLight", 0)

            logger.info(f"Applying settings - Brightness: {brightness}%, Blue Light: {blue_light}%")

            # Calculate actual brightness value (100% - reduction%)
            actual_brightness = 100 - brightness

            # Apply brightness using gamescope or direct backlight control
            self._set_brightness(actual_brightness)

            # Apply color temperature for blue light filtering
            if blue_light > 0:
                self._set_color_temperature(blue_light)
            else:
                self._reset_color_temperature()

            return True

        except Exception as e:
            logger.error(f"Error applying settings: {e}")
            return False

    def _get_settings_path(self) -> Path:
        """Get the path to settings file."""
        # Try to use Decky's plugin settings directory if available
        settings_dir = os.environ.get('DECKY_PLUGIN_SETTINGS_DIR')
        if settings_dir:
            return Path(settings_dir) / "settings.json"

        # Fallback to home directory
        return Path.home() / ".config" / "pastmidnight" / "settings.json"

    def _set_brightness(self, brightness: float) -> None:
        """Set screen brightness (0-100)."""
        try:
            # Try multiple methods for SteamDeck compatibility

            # Method 1: Direct backlight control (most reliable on SteamDeck)
            backlight_path = "/sys/class/backlight/amdgpu_bl0/brightness"
            max_brightness_path = "/sys/class/backlight/amdgpu_bl0/max_brightness"

            if os.path.exists(backlight_path) and os.path.exists(max_brightness_path):
                with open(max_brightness_path, 'r') as f:
                    max_brightness = int(f.read().strip())

                target_brightness = int((brightness / 100.0) * max_brightness)

                # This requires root permissions - Decky runs with appropriate permissions
                subprocess.run(
                    ['sh', '-c', f'echo {target_brightness} > {backlight_path}'],
                    check=False
                )
                logger.info(f"Set brightness to {brightness}% ({target_brightness}/{max_brightness})")
                return

            # Method 2: Try xrandr (if in desktop mode)
            result = subprocess.run(
                ['xrandr', '--output', 'eDP', '--brightness', str(brightness / 100.0)],
                capture_output=True,
                text=True,
                check=False
            )
            if result.returncode == 0:
                logger.info(f"Set brightness via xrandr to {brightness}%")
                return

            logger.warning("Could not set brightness - no method available")

        except Exception as e:
            logger.error(f"Error setting brightness: {e}")

    def _set_color_temperature(self, intensity: float) -> None:
        """Set color temperature for blue light filtering (0-100)."""
        try:
            # Calculate temperature (6500K normal, down to 3400K for max filtering)
            min_temp = 3400
            max_temp = 6500
            temperature = int(max_temp - ((max_temp - min_temp) * (intensity / 100.0)))

            # Try using gamescope color management
            # Gamescope supports color temperature adjustment
            subprocess.run(
                ['gamescope-color-temp', str(temperature)],
                capture_output=True,
                check=False
            )
            logger.info(f"Set color temperature to {temperature}K")

        except Exception as e:
            logger.error(f"Error setting color temperature: {e}")

    def _reset_color_temperature(self) -> None:
        """Reset color temperature to default."""
        try:
            subprocess.run(
                ['gamescope-color-temp', '6500'],
                capture_output=True,
                check=False
            )
            logger.info("Reset color temperature to 6500K")
        except Exception as e:
            logger.error(f"Error resetting color temperature: {e}")

    def _reset_display(self) -> None:
        """Reset all display settings to default."""
        self._set_brightness(100)
        self._reset_color_temperature()

    async def _main(self):
        """Main plugin initialization."""
        logger.info("PastMidnight plugin started")

        # Load and apply saved settings
        settings = await self.get_settings()
        if settings.get("enabled", False):
            await self.apply_settings(settings)

    async def _unload(self):
        """Cleanup when plugin unloads."""
        logger.info("PastMidnight plugin unloading, resetting display")
        self._reset_display()
