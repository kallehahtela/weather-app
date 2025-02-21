import React, { useEffect, useState } from "react";
import { 
    View,
    StyleSheet,
    ActivityIndicator,
    Text,
} from 'react-native';

// Custom Files
import { openWaetherConfig } from '../store/OpenWeatherConfig';

type WeatherProps = {
    lat: number | null;
    lon: number | null;
};
 
const CurrentWeather: React.FC<WeatherProps> = ({ lat, lon }) => {
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        if (!lat || !lon) return;

        const fetchCurrentWeather = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${openWaetherConfig.apiKey}`
                );
                const data = await response.json();

                if (response.ok) {
                    setWeather(data);
                } else {
                    setErrorMsg('Error fetching weather');
                }
            } catch (error) {
                setErrorMsg('Failed to load weather');
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentWeather();
    }, [lat, lon]);

    if (loading) return <ActivityIndicator />;
    if (errorMsg) return <Text style={styles.error}>{errorMsg}</Text>;

    return (
        <View style={styles.container}>
            <Text style={styles.temp}>
                {weather?.main?.temp}°C
            </Text>
            <Text style={styles.desc}>
                {weather?.weather[0]?.description}
            </Text>
        </View>
    );
};

export default CurrentWeather;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginTop: 20,
    },
    temp: {
        fontSize: 40,
        fontWeight: "bold",
        marginVertical: 5,
    },
    desc: {
        fontSize: 18,
        fontStyle: "italic",
    },
    error: {
        fontSize: 18,
        color: "red",
    },
});