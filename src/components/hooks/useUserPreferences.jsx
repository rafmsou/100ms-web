import { useLocalStorage } from "react-use";

export const UserPreferencesKeys = {
  PREVIEW: "preview",
  NOTIFICATIONS: "notifications",
  UI_SETTINGS: "uiSettings",
  RTMP_URLS: "rtmpUrls",
};

export const defaultPreviewPreference = {
  name: "",
  isAudioMuted: false,
  isVideoMuted: false,
};

export const useUserPreferences = (key, defaultValue) => {
  const [value, setValue] = useLocalStorage(key, defaultValue);
  return [value, setValue];
};
