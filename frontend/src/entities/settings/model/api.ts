import { fetchFromApi } from "@/shared/api/client";
import { SettingsSnapshot } from "./types";

export const SettingsApi = {
    async fetchSettings() {
        const response = await fetchFromApi<SettingsSnapshot>("/settings");
        
        return response;
    },
    async saveSettings(settings: SettingsSnapshot) {
        await fetchFromApi<SettingsSnapshot, SettingsSnapshot>("/settings", {
            method: "POST",
            body: settings,
        });
    }
}
