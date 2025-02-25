import Constants from 'expo-constants'

export type LocationData = {
    name: string;
};

export type WeatherProps = {
    lat: number | null;
    lon: number | null;
};


export const openWeatherConfig = {
    // API key cannot be empty
    // That's why we use ! operator on extra
    apiKey: Constants.expoConfig?.extra!.APIKEY,
};