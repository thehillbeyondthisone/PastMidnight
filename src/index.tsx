import {
  ButtonItem,
  definePlugin,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  SliderField,
  staticClasses,
  ToggleField,
} from "decky-frontend-lib";
import { VFC, useState, useEffect } from "react";
import { FaMoon } from "react-icons/fa";

interface Settings {
  enabled: boolean;
  brightness: number;
  blueLight: number;
  autoEnable: boolean;
  startTime: number;
  endTime: number;
}

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  const [settings, setSettings] = useState<Settings>({
    enabled: false,
    brightness: 50,
    blueLight: 0,
    autoEnable: false,
    startTime: 22,
    endTime: 6,
  });

  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    // Load settings from backend
    serverAPI.callPluginMethod<{}, Settings>("get_settings", {}).then((result) => {
      if (result.success) {
        setSettings(result.result);
      }
    });

    // Update current time
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const updateSetting = async (key: keyof Settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await serverAPI.callPluginMethod("save_settings", { settings: newSettings });

    if (key === "enabled" || key === "brightness" || key === "blueLight") {
      await serverAPI.callPluginMethod("apply_settings", { settings: newSettings });
    }
  };

  const applyNow = async () => {
    await serverAPI.callPluginMethod("apply_settings", { settings });
  };

  return (
    <PanelSection title="PastMidnight">
      <PanelSectionRow>
        <div style={{ fontSize: "0.9em", opacity: 0.7 }}>
          Current time: {currentTime}
        </div>
      </PanelSectionRow>

      <PanelSectionRow>
        <ToggleField
          label="Night Mode"
          description="Enable nighttime optimizations"
          checked={settings.enabled}
          onChange={(value) => updateSetting("enabled", value)}
        />
      </PanelSectionRow>

      {settings.enabled && (
        <>
          <PanelSectionRow>
            <SliderField
              label="Brightness Reduction"
              description={`Reduce brightness by ${settings.brightness}%`}
              value={settings.brightness}
              min={0}
              max={100}
              step={5}
              onChange={(value) => updateSetting("brightness", value)}
            />
          </PanelSectionRow>

          <PanelSectionRow>
            <SliderField
              label="Blue Light Filter"
              description={`Filter intensity: ${settings.blueLight}%`}
              value={settings.blueLight}
              min={0}
              max={100}
              step={10}
              onChange={(value) => updateSetting("blueLight", value)}
            />
          </PanelSectionRow>
        </>
      )}

      <PanelSectionRow>
        <ToggleField
          label="Auto Enable"
          description="Automatically enable based on time"
          checked={settings.autoEnable}
          onChange={(value) => updateSetting("autoEnable", value)}
        />
      </PanelSectionRow>

      {settings.autoEnable && (
        <>
          <PanelSectionRow>
            <SliderField
              label="Start Time"
              description={`Enable at ${settings.startTime}:00`}
              value={settings.startTime}
              min={0}
              max={23}
              step={1}
              onChange={(value) => updateSetting("startTime", value)}
            />
          </PanelSectionRow>

          <PanelSectionRow>
            <SliderField
              label="End Time"
              description={`Disable at ${settings.endTime}:00`}
              value={settings.endTime}
              min={0}
              max={23}
              step={1}
              onChange={(value) => updateSetting("endTime", value)}
            />
          </PanelSectionRow>
        </>
      )}

      <PanelSectionRow>
        <ButtonItem layout="below" onClick={applyNow}>
          Apply Settings Now
        </ButtonItem>
      </PanelSectionRow>
    </PanelSection>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  return {
    title: <div className={staticClasses.Title}>PastMidnight</div>,
    content: <Content serverAPI={serverApi} />,
    icon: <FaMoon />,
    onDismount() {
      // Cleanup if needed
    },
  };
});
