import Constants from 'expo-constants'

export type LocationData = {
    name: string;
};

export const openWaetherConfig = {
    // API key cannot be empty
    // That's why we use ! operator on extra
    apiKey: Constants.expoConfig?.extra!.APIKEY,
};