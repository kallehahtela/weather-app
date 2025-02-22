import React, { useEffect, useState } from "react";
import { 
    View,
    StyleSheet,
    ActivityIndicator,
    Text,
} from 'react-native';

// Custom Files
import { openWaetherConfig, WeatherProps } from '../store/OpenWeatherConfig';
import colors from "../constants/colors";
 
const CurrentWeather: React.FC<WeatherProps> = ({ lat, lon }) => {
    const [weather, setWeather] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        if (!lat || !lon) {
            setWeather(null);
            setErrorMsg("No location data");
            return;
        }

        const fetchCurrentWeather = async () => {
            setLoading(true);
            setWeather(null);
            setErrorMsg(null);

            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${openWaetherConfig.apiKey}`
                );
                const data = await response.json();

                if (!response.ok) {
                    setErrorMsg(data.message || 'Error fetching weather');
                    return;
                }

                setWeather(data);
            } catch (error) {
                setErrorMsg('Failed to load weather');
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentWeather();
    }, [lat, lon]);

    if (loading) {
        return (
            <View>
                <ActivityIndicator size="large" color={colors.white} />
            </View>
        );
    }

    if (errorMsg) return <Text>{errorMsg}</Text>;

    return (
        <View style={styles.container}>
            <View style={styles.temp}>
                <Text style={styles.tempValue}>{Math.ceil(weather?.main?.temp)}</Text>
                <Text style={styles.degree}>°C</Text>
            </View>

            <View style={styles.descContainer}>
                <Text style={styles.desc}>
                    {weather?.weather?.[0]?.description || "No description"}
                </Text>
            </View>
        </View>
    );
};

export default CurrentWeather;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 20,
        height: 300
    },
    temp: {
        flexDirection: 'row',
        alignSelf: 'center',
    },
    tempValue: {
        fontSize: 98,
        fontWeight: 'bold',
        color: colors.white,
    },
    degree: {
        fontSize: 24,
        fontWeight: '500',
        color: colors.white,
        marginTop: 20,
    },
    descContainer: {
        transform: [{ rotate: '-90deg' }], // Rotates the text
        textAlign: 'center',
        justifyContent: 'center',
    },
    desc: {
        fontSize: 17,
        color: colors.white,
        textAlign: 'center',
    },
});
